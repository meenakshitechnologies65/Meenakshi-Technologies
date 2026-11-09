/**
 * CMS MANAGEMENT v2.0 - AUTHENTICATION & RBAC ENGINE
 * Secure PBKDF2 hashing, session tokens, role permissions, and audit logging.
 */

const crypto = require('node:crypto');
const { db, hashPassword } = require('./db');

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMINISTRATOR: 'administrator',
  SEO_MANAGER: 'seo_manager',
  CONTENT_WRITER: 'content_writer',
  EDITOR: 'editor'
};

// Permission hierarchy matrix
const ROLE_PERMISSIONS = {
  super_admin: ['all'],
  administrator: ['articles', 'products', 'seo', 'keywords', 'media', 'pdf', 'users', 'audit', 'publishing'],
  seo_manager: ['articles:read', 'articles:edit', 'seo', 'keywords', 'competitor', 'gsc', 'audit'],
  editor: ['articles', 'products:read', 'media', 'pdf:read', 'calendar'],
  content_writer: ['articles:create', 'articles:edit_own', 'keywords:read', 'ai_assistant']
};

/**
 * Authenticate user credentials
 */
function authenticateUser(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Email and password required' };
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email.trim().toLowerCase());
  if (!user) {
    return { success: false, message: 'Invalid credentials or inactive account' };
  }

  const { hash } = hashPassword(password, user.salt);
  if (hash !== user.password_hash) {
    return { success: false, message: 'Invalid credentials' };
  }

  // Create session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, user.id, expiresAt);
  db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

  // Log audit
  logAudit(user.id, user.name, 'auth:login', 'users', user.id, { email });

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url
  };

  return { success: true, token, user: safeUser };
}

/**
 * Get user by session token
 */
function getUserByToken(token) {
  if (!token) return null;
  const session = db.prepare(`
    SELECT s.token, s.expires_at, u.id, u.name, u.email, u.role, u.avatar_url, u.is_active
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND u.is_active = 1
  `).get(token);

  if (!session) return null;

  if (new Date(session.expires_at) < new Date()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  return {
    id: session.id,
    name: session.name,
    email: session.email,
    role: session.role,
    avatar_url: session.avatar_url
  };
}

/**
 * Destroy session (Logout)
 */
function logoutUser(token) {
  if (!token) return true;
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  return true;
}

/**
 * Audit Logging Helper
 */
function logAudit(userId, userName, action, entityType, entityId, detailsObj = {}) {
  try {
    const id = 'aud_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, action, entity_type, entity_id, details_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId || 'system', userName || 'System User', action, entityType, entityId || null, JSON.stringify(detailsObj));
  } catch (err) {
    console.error('[CMS Audit Log Error]', err.message);
  }
}

/**
 * Extract auth token from request
 */
function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies && req.cookies.cms_token) {
    return req.cookies.cms_token;
  }
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(/cms_token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
}

/**
 * Express Middleware: Require Authentication
 */
function requireAuth(req, res, next) {
  const token = extractToken(req);
  const user = getUserByToken(token);

  if (!user) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please login to CMS.' });
    }
    return res.redirect('/admin/login');
  }

  req.user = user;
  next();
}

/**
 * Express Middleware: Optional Authentication (sets req.user if present, proceeds otherwise)
 */
function optionalAuth(req, res, next) {
  const token = extractToken(req);
  req.user = getUserByToken(token);
  next();
}

/**
 * Express Middleware: Require Specific Role or Super Admin
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (req.user.role === ROLES.SUPER_ADMIN || allowedRoles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
  };
}

module.exports = {
  ROLES,
  ROLE_PERMISSIONS,
  authenticateUser,
  getUserByToken,
  logoutUser,
  logAudit,
  extractToken,
  requireAuth,
  optionalAuth,
  requireRole
};
