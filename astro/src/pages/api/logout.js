import { deleteSession } from '../../lib/sessionStore.js';

export async function POST({ request }) {
  // Lese den Cookie-Header aus
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionMatch = cookieHeader.match(/sessionId=([^;]+)/);
  
  if (sessionMatch) {
    const sessionId = sessionMatch[1];
    // Lösche die Session aus dem Session-Store
    deleteSession(sessionId);
  }
  
  // Sende ein Cookie, das den sessionId-Cookie löscht (Max-Age=0)
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'sessionId=; HttpOnly; Path=/; Max-Age=0'
    }
  });
}

