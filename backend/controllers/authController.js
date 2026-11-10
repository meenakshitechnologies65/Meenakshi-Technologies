/**
 * AUTHENTICATION CONTROLLER
 * Manages Admin Login, Google OAuth 2.0 flow, 6-digit 2FA OTP verification, and Logout.
 */

const config = require('../config');
const { db } = require('../database/db');
const { getGoogleAuthUrl, handleGoogleCallback } = require('../services/oauthService');
const { generateAndSendOtp, verifyOtp } = require('../services/otpService');
const { extractSessionToken } = require('../middleware/authMiddleware');

/**
 * Render Admin Login Page
 */
function renderLoginPage(req, res) {
  const token = extractSessionToken(req);
  if (token) {
    const session = db.prepare('SELECT user_id, expires_at FROM sessions WHERE token = ?').get(token);
    if (session && new Date(session.expires_at) > new Date()) {
      return res.redirect('/admin');
    }
  }

  const error = req.query.error || null;
  const message = req.query.message || null;
  const googleConfigured = Boolean(config.googleOAuth.clientId && config.googleOAuth.clientSecret);

  res.render('login', {
    authorizedEmail: config.authorizedAdminEmail,
    googleConfigured,
    error,
    message
  });
}

/**
 * Start Google OAuth 2.0 Flow
 */
function initiateGoogleLogin(req, res) {
  if (!config.googleOAuth.clientId || !config.googleOAuth.clientSecret) {
    return res.redirect('/admin/login?error=oauth_not_configured');
  }

  const authUrl = getGoogleAuthUrl();
  res.redirect(authUrl);
}

/**
 * Handle Google OAuth 2.0 Callback
 */
async function processGoogleCallback(req, res) {
  const { code, state, error } = req.query;
  const ip = req.ip || req.connection.remoteAddress;

  if (error) {
    return res.redirect(`/admin/login?error=${encodeURIComponent('Google login was cancelled or denied: ' + error)}`);
  }

  if (!code || !state) {
    return res.redirect('/admin/login?error=invalid_oauth_response');
  }

  const result = await handleGoogleCallback(code, state, ip);

  if (!result.success) {
    if (result.unauthorized) {
      return res.status(403).render('login', {
        authorizedEmail: config.authorizedAdminEmail,
        googleConfigured: true,
        error: `ACCESS DENIED: The Google account "${result.email}" is not authorized. Access is strictly restricted to ${config.authorizedAdminEmail}.`,
        message: null
      });
    }
    return res.redirect(`/admin/login?error=${encodeURIComponent(result.message)}`);
  }

  // Google OAuth Primary Step Succeeded!
  // Now execute Requirement 5: Second-Factor 6-digit OTP verification!
  const otpResult = await generateAndSendOtp(result.email, ip);

  // Store pre-auth state in secure short-lived cookie for OTP verification
  res.cookie('mt_preauth_email', result.email, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 10 * 60 * 1000 // 10 minutes
  });

  return res.redirect('/admin/verify-otp?method=google');
}

/**
 * Initiate Direct Email OTP (for authorized admin email)
 */
async function initiateEmailOtp(req, res) {
  const { email } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const normalized = email.trim().toLowerCase();

  // Strict whitelist verification
  if (normalized !== config.authorizedAdminEmail) {
    db.prepare(`
      INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
      VALUES (?, 'unauthorized_rejected', 'BLOCKED', ?, 'Rejected non-whitelisted email')
    `).run(normalized, ip);

    return res.status(403).json({
      success: false,
      error: `Access Denied: ${normalized} is not an authorized administrator account.`
    });
  }

  const result = await generateAndSendOtp(normalized, ip);

  if (!result.success) {
    return res.status(result.rateLimited ? 429 : 400).json(result);
  }

  // Set pre-auth cookie
  res.cookie('mt_preauth_email', normalized, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 10 * 60 * 1000
  });

  res.json({
    success: true,
    redirectUrl: '/admin/verify-otp?method=email',
    message: result.message
  });
}

/**
 * Render 2FA OTP Verification Page
 */
function renderVerifyOtpPage(req, res) {
  let email = req.cookies?.mt_preauth_email;

  // Fallback if cookies not parsed via cookie-parser yet
  if (!email && req.headers.cookie) {
    const match = req.headers.cookie.match(/mt_preauth_email=([^;]+)/);
    if (match) email = decodeURIComponent(match[1]);
  }

  if (!email || email !== config.authorizedAdminEmail) {
    return res.redirect('/admin/login?error=session_expired');
  }

  const error = req.query.error || null;
  const method = req.query.method || 'email';

  res.render('verify-otp', {
    email,
    method,
    error
  });
}

/**
 * Process Submitted 6-Digit OTP
 */
function processVerifyOtp(req, res) {
  let email = req.cookies?.mt_preauth_email;
  if (!email && req.headers.cookie) {
    const match = req.headers.cookie.match(/mt_preauth_email=([^;]+)/);
    if (match) email = decodeURIComponent(match[1]);
  }

  const { otp } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Session expired. Please initiate login again.' });
  }

  const result = verifyOtp(email, otp, ip);

  if (!result.success) {
    return res.status(400).json(result);
  }

  // Establish Authenticated Session
  res.clearCookie('mt_preauth_email');
  res.cookie(config.security.cookieName, result.sessionToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: config.security.cookieMaxAgeMs
  });

  res.json({
    success: true,
    redirectUrl: '/admin',
    message: 'Authentication successful. Redirecting to Admin Dashboard...'
  });
}

/**
 * Resend OTP Code
 */
async function resendOtpCode(req, res) {
  let email = req.cookies?.mt_preauth_email;
  if (!email && req.headers.cookie) {
    const match = req.headers.cookie.match(/mt_preauth_email=([^;]+)/);
    if (match) email = decodeURIComponent(match[1]);
  }

  const ip = req.ip || req.connection.remoteAddress;

  if (!email || email !== config.authorizedAdminEmail) {
    return res.status(400).json({ success: false, error: 'Invalid authentication session.' });
  }

  const result = await generateAndSendOtp(email, ip);
  if (!result.success) {
    return res.status(result.rateLimited ? 429 : 400).json(result);
  }

  res.json({ success: true, message: 'A new 6-digit verification code has been dispatched.' });
}

/**
 * Admin Logout
 */
function handleLogout(req, res) {
  const token = extractSessionToken(req);
  const ip = req.ip || req.connection.remoteAddress;

  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    db.prepare(`
      INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
      VALUES (?, 'logout', 'SUCCESS', ?, 'Admin session terminated')
    `).run(config.authorizedAdminEmail, ip);
  }

  res.clearCookie(config.security.cookieName);
  res.clearCookie('mt_preauth_email');
  res.redirect('/admin/login?message=logged_out');
}

module.exports = {
  renderLoginPage,
  initiateGoogleLogin,
  processGoogleCallback,
  initiateEmailOtp,
  renderVerifyOtpPage,
  processVerifyOtp,
  resendOtpCode,
  handleLogout
};
