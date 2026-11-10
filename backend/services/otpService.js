/**
 * OTP AUTHENTICATION SERVICE (2-FACTOR AUTHENTICATION)
 * Generates secure, cryptographically random 6-digit codes.
 * Stores PBKDF2 hashes with per-OTP salt, enforces attempt limits, expiry, and rate limiting.
 */

const crypto = require('node:crypto');
const { db } = require('../database/db');
const config = require('../config');
const { sendAdminOtpEmail } = require('./emailService');

/**
 * Generate and dispatch a 6-digit OTP for an authorized administrator
 */
async function generateAndSendOtp(email, ipAddress = '') {
  const normalizedEmail = email.trim().toLowerCase();

  // Strict whitelist check
  if (normalizedEmail !== config.authorizedAdminEmail) {
    db.prepare(`
      INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
      VALUES (?, 'unauthorized_rejected', 'BLOCKED', ?, 'Non-whitelisted email attempted OTP generation')
    `).run(normalizedEmail, ipAddress);

    return {
      success: false,
      message: 'Unauthorized account. Access is restricted exclusively to authorized administrators.'
    };
  }

  // Check rate limiting on recent OTP generation (60s cooldown)
  const recentOtp = db.prepare(`
    SELECT created_at FROM admin_otps
    WHERE email = ? AND is_used = 0 AND expires_at > datetime('now')
    ORDER BY rowid DESC LIMIT 1
  `).get(normalizedEmail);

  if (recentOtp) {
    const elapsedMs = Date.now() - new Date(recentOtp.created_at).getTime();
    if (elapsedMs < config.otp.resendCooldownMs) {
      const waitSeconds = Math.ceil((config.otp.resendCooldownMs - elapsedMs) / 1000);
      return {
        success: false,
        rateLimited: true,
        message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`
      };
    }
  }

  // Invalidate any existing unused OTPs for this email
  db.prepare(`UPDATE admin_otps SET is_used = 1 WHERE email = ? AND is_used = 0`).run(normalizedEmail);

  // Generate cryptographically secure 6-digit number
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const salt = crypto.randomBytes(16).toString('hex');
  const otpHash = crypto.pbkdf2Sync(otpCode, salt, 10000, 32, 'sha256').toString('hex');

  const otpId = 'otp_' + crypto.randomBytes(12).toString('hex');
  const expiresAt = new Date(Date.now() + config.otp.expiresInMs).toISOString();

  db.prepare(`
    INSERT INTO admin_otps (id, email, otp_hash, salt, attempts, is_used, expires_at)
    VALUES (?, ?, ?, ?, 0, 0, ?)
  `).run(otpId, normalizedEmail, otpHash, salt, expiresAt);

  // Log audit
  db.prepare(`
    INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
    VALUES (?, 'otp_generated', 'SUCCESS', ?, '6-digit OTP generated and dispatched')
  `).run(normalizedEmail, ipAddress);

  // Dispatch email
  await sendAdminOtpEmail(normalizedEmail, otpCode);

  const isMockSmtp = !config.smtp.pass || config.smtp.pass === 'your-app-password';
  const fallbackOtp = isMockSmtp ? otpCode : null;

  return {
    success: true,
    otpId,
    email: normalizedEmail,
    fallbackOtp,
    expiresInSeconds: config.otp.expiresInMs / 1000,
    message: fallbackOtp 
      ? `Verification code dispatched! (Setup Mode OTP: ${fallbackOtp})` 
      : `Verification code sent to ${normalizedEmail}`
  };
}

/**
 * Verify submitted 6-digit OTP code
 */
function verifyOtp(email, submittedCode, ipAddress = '') {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== config.authorizedAdminEmail) {
    return { success: false, message: 'Unauthorized account' };
  }

  const cleanCode = (submittedCode || '').toString().trim();
  if (!cleanCode || cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
    return { success: false, message: 'Please enter a valid 6-digit verification code.' };
  }

  const activeOtp = db.prepare(`
    SELECT * FROM admin_otps
    WHERE email = ? AND is_used = 0
    ORDER BY rowid DESC LIMIT 1
  `).get(normalizedEmail);

  if (!activeOtp) {
    return {
      success: false,
      message: 'No active verification code found. Please request a new code.'
    };
  }

  // Check expiration
  if (new Date(activeOtp.expires_at) < new Date()) {
    db.prepare('UPDATE admin_otps SET is_used = 1 WHERE id = ?').run(activeOtp.id);
    return {
      success: false,
      expired: true,
      message: 'Verification code has expired. Please request a new one.'
    };
  }

  // Check attempt limit
  if (activeOtp.attempts >= config.otp.maxAttempts) {
    db.prepare('UPDATE admin_otps SET is_used = 1 WHERE id = ?').run(activeOtp.id);
    db.prepare(`
      INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
      VALUES (?, 'otp_failed', 'BLOCKED', ?, 'Maximum OTP attempts exceeded')
    `).run(normalizedEmail, ipAddress);

    return {
      success: false,
      blocked: true,
      message: 'Too many incorrect attempts. This code is invalidated. Please request a new code.'
    };
  }

  // Verify hash
  const submittedHash = crypto.pbkdf2Sync(cleanCode, activeOtp.salt, 10000, 32, 'sha256').toString('hex');
  const match = crypto.timingSafeEqual(Buffer.from(submittedHash), Buffer.from(activeOtp.otp_hash));

  if (!match) {
    db.prepare('UPDATE admin_otps SET attempts = attempts + 1 WHERE id = ?').run(activeOtp.id);
    const remaining = config.otp.maxAttempts - (activeOtp.attempts + 1);

    db.prepare(`
      INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
      VALUES (?, 'otp_failed', 'FAILED', ?, ?)
    `).run(normalizedEmail, ipAddress, `Incorrect OTP submitted. ${remaining} attempts left.`);

    return {
      success: false,
      remainingAttempts: remaining,
      message: `Incorrect code. ${remaining} attempt(s) remaining.`
    };
  }

  // Mark OTP as used
  db.prepare('UPDATE admin_otps SET is_used = 1 WHERE id = ?').run(activeOtp.id);

  // Create session
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionExpiresAt = new Date(Date.now() + config.security.cookieMaxAgeMs).toISOString();

  // Find admin user
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE LOWER(email) = ?').get(normalizedEmail);
  const userId = user ? user.id : 'user_admin_primary';

  db.prepare(`
    INSERT INTO sessions (token, user_id, ip_address, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(sessionToken, userId, ipAddress, sessionExpiresAt);

  db.prepare(`
    INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
    VALUES (?, 'otp_verified', 'SUCCESS', ?, 'Admin session established successfully')
  `).run(normalizedEmail, ipAddress);

  return {
    success: true,
    sessionToken,
    user: {
      id: userId,
      email: normalizedEmail,
      name: user ? user.name : 'Meenakshi Admin',
      role: 'super_admin'
    }
  };
}

module.exports = {
  generateAndSendOtp,
  verifyOtp
};
