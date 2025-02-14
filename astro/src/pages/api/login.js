import { promises as fs } from 'fs';
import { join } from 'path';

export async function post({ request }) {
  console.log("API-Endpoint aufgerufen");
  const { username, password } = await request.json();
  console.log("Received login request for:", username);
  
  // Absoluten Pfad zur Datei usr/login ermitteln
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
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
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

