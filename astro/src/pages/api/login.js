import { promises as fs } from 'fs';
import { createSession } from '../../lib/sessionStore.js';

// Verwende hier Node's crypto (oder eine alternative UUID-Generierung) für eine eindeutige ID
import { randomUUID } from 'crypto';

export async function POST({ request }) {
  console.log("API-Endpoint aufgerufen");
  const { username, password } = await request.json();
  console.log("Received login request for:", username);
  
  // Absoluten Pfad zur Datei usr/login ermitteln (angepasst an deine Ordnerstruktur)
  const filePath = new URL('../../../../usr/login', import.meta.url).pathname;
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const lines = data.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log("Parsed file data:", lines);
    
    let authenticated = false;
    for (const line of lines) {
      const [fileUser, filePassword] = line.split(':');
      if (fileUser === username && filePassword === password) {
        authenticated = true;
        break;
      }
    }
    if (authenticated) {
      // Erzeuge eine eindeutige Session-ID
      const sessionId = randomUUID();
      // Speichere die Session-Daten (hier nur den Benutzernamen; ggf. erweiterbar)
      createSession(sessionId, { username });
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Setze HttpOnly-Cookie, gültig für den gesamten Pfad, Ablauf in 3600 Sekunden (1 Stunde)
          'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=3600`
        }
      });
    } else {
      return new Response(
        JSON.stringify({ success: false, message: 'Ungültige Anmeldedaten' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Fehler beim Zugriff auf die Login-Datei:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Serverfehler beim Lesen der Login-Datei' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
