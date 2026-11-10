/**
 * BACKEND CONFIGURATION
 * Centralized, secure environment configuration.
 * All credentials and secrets are loaded from process.env with secure defaults.
 */

const path = require('node:path');

const config = {
  env: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  appUrl: process.env.APP_URL || 'https://meenakshitechnologies.in',
  baseUrl: process.env.BASE_URL || 'https://meenakshitechnologies.in',
  websiteUrl: process.env.WEBSITE_URL || 'https://meenakshitechnologies.in',

  // Authorized Admin Gmail Account (Strictly Enforced)
  authorizedAdminEmail: (process.env.AUTHORIZED_ADMIN_EMAIL || 'meenakshitechnologies65@gmail.com').trim().toLowerCase(),

  // Google OAuth 2.0 Credentials
  googleOAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || `${process.env.BASE_URL || 'https://meenakshitechnologies.in'}/admin/auth/google/callback`,
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userinfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },

  // 2-Factor Authentication (OTP) Settings
  otp: {
    length: 6,
    expiresInMs: 10 * 60 * 1000, // 10 minutes
    maxAttempts: 5,
    resendCooldownMs: 60 * 1000 // 60 seconds
  },

  // Security & Sessions
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'meenakshi_session_secret_encryption_key_2026',
    jwtSecret: process.env.JWT_SECRET || 'meenakshi_jwt_secret_production_2026_super_secure',
    cookieName: 'mt_admin_session',
    cookieMaxAgeMs: 7 * 24 * 60 * 60 * 1000 // 7 days
  },

  // SMTP Email Dispatch (for OTP & Enquiries)
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || 'meenakshitechnologies65@gmail.com',
    pass: process.env.SMTP_PASS || '',
    fromName: 'Meenakshi Technologies Security',
    fromEmail: process.env.SMTP_USER || 'meenakshitechnologies65@gmail.com'
  },

  // Paths
  paths: {
    root: path.join(__dirname, '../..'),
    data: path.join(__dirname, '../../data'),
    public: path.join(__dirname, '../../public'),
    views: path.join(__dirname, '../../views'),
    adminViews: path.join(__dirname, '../../admin-panel/views')
  }
};

module.exports = config;

