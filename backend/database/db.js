/**
 * BACKEND DATABASE LAYER
 * Transactional SQLite engine for users, sessions, 2FA OTPs, products, and audit logs.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const config = require('../config');

const DB_PATH = path.join(config.paths.data, 'cms_v2.sqlite');

// Ensure data folder exists
if (!fs.existsSync(config.paths.data)) {
  fs.mkdirSync(config.paths.data, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

try {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
} catch (err) {
  console.warn('[DB] PRAGMA notice:', err.message);
}

// Initialize tables for auth, 2FA OTP, and audit logs
function initAuthTables() {
  db.exec(`
    -- 1. USERS & ROLES
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      salt TEXT,
      role TEXT NOT NULL DEFAULT 'super_admin',
      avatar_url TEXT,
      is_active INTEGER DEFAULT 1,
      last_login_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. ACTIVE ADMIN SESSIONS
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 3. 2FA OTP VERIFICATION LOG
    CREATE TABLE IF NOT EXISTS admin_otps (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      otp_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      attempts INTEGER DEFAULT 0,
      is_used INTEGER DEFAULT 0,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. SECURITY & AUTHENTICATION AUDIT LOGS
    CREATE TABLE IF NOT EXISTS auth_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      action TEXT NOT NULL, -- 'oauth_attempt', 'oauth_success', 'unauthorized_rejected', 'otp_generated', 'otp_verified', 'otp_failed', 'logout'
      status TEXT NOT NULL, -- 'SUCCESS', 'FAILED', 'BLOCKED'
      ip_address TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure sessions table has ip_address and user_agent columns if created by legacy schema
  try { db.exec('ALTER TABLE sessions ADD COLUMN ip_address TEXT;'); } catch (_) {}
  try { db.exec('ALTER TABLE sessions ADD COLUMN user_agent TEXT;'); } catch (_) {}

  // Ensure authorized administrator exists in users table
  const adminEmail = config.authorizedAdminEmail;
  const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(adminEmail);
  if (!existing) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('Meenakshi@2026', salt, 100000, 64, 'sha512').toString('hex');
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, is_active)
      VALUES (?, ?, ?, ?, ?, 'super_admin', 1)
    `).run('user_admin_primary', 'Meenakshi Admin', adminEmail, hash, salt);
    console.log(`[DB] Seeded authorized admin user: ${adminEmail}`);
  }
}

initAuthTables();

module.exports = {
  db,
  initAuthTables
};
