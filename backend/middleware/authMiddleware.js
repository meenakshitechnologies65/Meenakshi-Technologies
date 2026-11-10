/**
 * AUTHENTICATION & SECURITY MIDDLEWARE
 * Protects Admin routes and APIs from unauthorized access, brute-force, and session hijacking.
 */

const { db } = require('../database/db');
const config = require('../config');

/**
 * Extract session token from cookies or Authorization header
 */
function extractSessionToken(req) {
  // 1. Check HTTP-only cookie
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${config.security.cookieName}=`)) {
        return cookie.substring(config.security.cookieName.length + 1);
      }
    }
  }

  // 2. Check Authorization Header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  return null;
}

/**
 * Verify user session and enforce Super Admin access
 */
function requireAdminAuth(req, res, next) {
  const token = extractSessionToken(req);

  if (!token) {
    if (req.path.startsWith('/api/') || req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
    }
    return res.redirect('/admin/login');
  }

  // Query database for valid session
  const session = db.prepare(`
    SELECT s.token, s.expires_at, u.id, u.name, u.email, u.role, u.is_active
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND u.is_active = 1
  `).get(token);

  if (!session) {
    res.clearCookie(config.security.cookieName);
    if (req.path.startsWith('/api/') || req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({ success: false, error: 'Session invalid or expired' });
    }
    return res.redirect('/admin/login?error=session_expired');
  }

  // Check expiration
  if (new Date(session.expires_at) < new Date()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    res.clearCookie(config.security.cookieName);
    if (req.path.startsWith('/api/') || req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({ success: false, error: 'Session expired' });
    }
    return res.redirect('/admin/login?error=session_expired');
  }

  // Double check email whitelist
  if (session.email.toLowerCase() !== config.authorizedAdminEmail) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    res.clearCookie(config.security.cookieName);
    return res.status(403).send('Forbidden: Unauthorized account access.');
  }

  req.adminUser = {
    id: session.id,
    name: session.name,
    email: session.email,
    role: session.role
  };

  res.locals.adminUser = req.adminUser;
  next();
}

/**
 * Memory-based Rate Limiter for Login and OTP endpoints
 */
const rateLimits = new Map();

function createRateLimiter(options = { windowMs: 15 * 60 * 1000, max: 15, message: 'Too many requests. Please wait a few minutes.' }) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown-ip';
    const key = `${req.path}:${ip}`;
    const now = Date.now();

    const record = rateLimits.get(key) || { count: 0, resetTime: now + options.windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + options.windowMs;
    } else {
      record.count++;
    }

    rateLimits.set(key, record);

    if (record.count > options.max) {
      const waitSeconds = Math.ceil((record.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        error: options.message,
        retryAfter: waitSeconds
      });
    }

    next();
  };
}

module.exports = {
  extractSessionToken,
  requireAdminAuth,
  createRateLimiter
};

