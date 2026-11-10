/**
 * AUTHENTICATION ROUTES
 * Handles Admin Login, Google OAuth 2.0, 2FA OTP verification, and Logout.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { createRateLimiter } = require('../middleware/authMiddleware');

// Rate limiters for security
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20,
  message: 'Too many authentication attempts. Please try again after 15 minutes.'
});

const otpLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 10,
  message: 'Too many OTP requests. Please wait a few moments.'
});

// 1. Login Page
router.get('/login', authController.renderLoginPage);

// 2. Google OAuth 2.0 Flow
router.get('/auth/google', loginLimiter, authController.initiateGoogleLogin);
router.get('/auth/google/callback', authController.processGoogleCallback);

// 3. Direct Email OTP Flow (Whitelisted to meenakshitechnologies65@gmail.com)
router.post('/auth/email-otp', otpLimiter, authController.initiateEmailOtp);

// 4. Two-Factor (2FA) OTP Verification
router.get('/verify-otp', authController.renderVerifyOtpPage);
router.post('/verify-otp', loginLimiter, authController.processVerifyOtp);
router.post('/resend-otp', otpLimiter, authController.resendOtpCode);

// 5. Secure Logout
router.get('/logout', authController.handleLogout);
router.post('/logout', authController.handleLogout);

module.exports = router;

