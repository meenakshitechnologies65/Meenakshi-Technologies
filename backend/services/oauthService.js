/**
 * GOOGLE OAUTH 2.0 SERVICE
 * Handles Google OAuth flow, CSRF state verification, and strict whitelist enforcement.
 */

const crypto = require('node:crypto');
const config = require('../config');
const { db } = require('../database/db');

// In-memory or state store for CSRF verification
const oauthStates = new Map();

/**
 * Generate Google OAuth 2.0 Authorization URL
 */
function getGoogleAuthUrl() {
  const state = crypto.randomBytes(24).toString('hex');
  oauthStates.set(state, { createdAt: Date.now() });

  // Cleanup old states (>10 mins)
  for (const [st, val] of oauthStates.entries()) {
    if (Date.now() - val.createdAt > 10 * 60 * 1000) {
      oauthStates.delete(st);
    }
  }

  const params = new URLSearchParams({
    client_id: config.googleOAuth.clientId,
    redirect_uri: config.googleOAuth.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account'
  });

  return `${config.googleOAuth.authEndpoint}?${params.toString()}`;
}

/**
 * Verify State parameter against CSRF
 */
function verifyOAuthState(state) {
  if (!state || !oauthStates.has(state)) {
    return false;
  }
  oauthStates.delete(state);
  return true;
}

/**
 * Exchange code for user info and verify authorized administrator
 */
async function handleGoogleCallback(code, state, ipAddress = '') {
  // Validate CSRF state
  if (!verifyOAuthState(state)) {
    return {
      success: false,
      status: 400,
      message: 'Invalid or expired OAuth state token. Please try again.'
    };
  }

  if (!config.googleOAuth.clientId || !config.googleOAuth.clientSecret) {
    return {
      success: false,
      status: 500,
      message: 'Google OAuth Client ID/Secret not configured on server. Please use Email OTP verification.'
    };
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch(config.googleOAuth.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.googleOAuth.clientId,
        client_secret: config.googleOAuth.clientSecret,
        redirect_uri: config.googleOAuth.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange token');
    }

    // 2. Fetch User Profile
    const profileRes = await fetch(config.googleOAuth.userinfoEndpoint, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const profile = await profileRes.json();
    if (!profileRes.ok || !profile.email) {
      throw new Error('Failed to retrieve user profile from Google');
    }

    const email = profile.email.trim().toLowerCase();

    // 3. STRICT WHITELIST ENFORCEMENT
    if (email !== config.authorizedAdminEmail) {
      db.prepare(`
        INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
        VALUES (?, 'unauthorized_rejected', 'BLOCKED', ?, ?)
      `).run(email, ipAddress, `Unauthorized Google account rejected: ${email}`);

      return {
        success: false,
        status: 403,
        unauthorized: true,
        email,
        message: `Access Denied: The account ${email} is not authorized. Only ${config.authorizedAdminEmail} can access the administrator panel.`
      };
    }

    // Verified!
    db.prepare(`
      INSERT INTO auth_audit_logs (email, action, status, ip_address, details)
      VALUES (?, 'oauth_success', 'SUCCESS', ?, 'Google OAuth primary authentication succeeded')
    `).run(email, ipAddress);

    return {
      success: true,
      email,
      name: profile.name || 'Meenakshi Admin',
      picture: profile.picture
    };

  } catch (err) {
    console.error('[GOOGLE OAUTH ERROR]:', err.message);
    return {
      success: false,
      status: 500,
      message: `Authentication failed: ${err.message}`
    };
  }
}

module.exports = {
  getGoogleAuthUrl,
  verifyOAuthState,
  handleGoogleCallback
};

