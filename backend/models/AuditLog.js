/**
 * AUDIT LOG MODEL
 * Cryptographic security audit trail tracking logins, OAuth, and admin operations.
 */

const { db } = require('../database/db');

class AuditLog {
  static log(email, action, status, ipAddress = '', details = '') {
    try {
      db.prepare(`
        INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
        VALUES (?, ?, ?, ?, ?)
      `).run(email, action, status, ipAddress, details);
      return true;
    } catch (err) {
      console.error('[AuditLog Model] Log error:', err.message);
      return false;
    }
  }

  static getRecent(limit = 50) {
    try {
      return db.prepare(`
        SELECT id, email, action, status, ip_address, details, created_at
        FROM auth_audit_logs
        ORDER BY id DESC
        LIMIT ?
      `).all(limit);
    } catch (err) {
      console.error('[AuditLog Model] Query error:', err.message);
      return [];
    }
  }
}

module.exports = AuditLog;

