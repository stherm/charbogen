// astro/src/lib/sessionStore.js

// Ein einfacher In-Memory-Session-Store (nur für Entwicklungszwecke!)
const sessions = {};

/**
 * Speichert eine neue Session.
 * @param {string} sessionId – Eindeutige Session-ID.
 * @param {object} data – Beliebige Daten, z. B. Benutzername, Rolle etc.
 */
export function createSession(sessionId, data) {
  // Optional: Setze hier ein Ablaufdatum, z. B. 1 Stunde ab Erstellung.
  const expires = Date.now() + 3600 * 1000;
  sessions[sessionId] = { data, expires };
}

/**
 * Gibt die Session-Daten zurück, wenn die Session existiert und nicht abgelaufen ist.
 * @param {string} sessionId
 * @returns {object|null} Session-Daten oder null, wenn nicht gefunden/abgelaufen.
 */
export function getSession(sessionId) {
  const session = sessions[sessionId];
  if (!session) return null;
  // Prüfe, ob die Session noch gültig ist
  if (Date.now() > session.expires) {
    delete sessions[sessionId];
    return null;
  }
  return session.data;
}

/**
 * Löscht eine Session.
 * @param {string} sessionId
 */
export function deleteSession(sessionId) {
  delete sessions[sessionId];
}

