/**
 * USER MODEL
 * Manages administrator records, password hashing, and active sessions.
 */

const { db } = require('../database/db');

class User {
  static findByEmail(email) {
    if (!email) return null;
    return db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(email.trim().toLowerCase());
  }

  static findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  static updateLastLogin(id) {
    return db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  }

  static getActiveSession(token) {
    return db.prepare(`
      SELECT s.token, s.expires_at, u.id, u.name, u.email, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND u.is_active = 1
    `).get(token);
  }
}

module.exports = User;

