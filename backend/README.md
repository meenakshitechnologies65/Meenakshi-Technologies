# Meenakshi Technologies - Backend Architecture

Modular backend services, controllers, models, and security middleware.

## Folder Overview
- `config/`: Centralized environment configurations (`index.js`).
- `database/`: Transactional SQLite database engine with WAL journal mode (`db.js`).
- `controllers/`:
  - `authController.js`: Google OAuth 2.0 flow, OTP generation, verification, and session lifecycle.
  - `adminController.js`: Product CRUD, lead management, video embeds, and audit log telemetry.
- `models/`:
  - `User.js`: Administrator authentication queries.
  - `Product.js`: Biometric hardware specifications and catalog management.
  - `Lead.js`: Customer enquiries CRM.
  - `AuditLog.js`: Real-time cryptographic security audit logging.
- `middleware/`:
  - `authMiddleware.js`: Session cookie extractor, `requireAdminAuth` guard, and IP-based rate limiting.
- `services/`:
  - `oauthService.js`: Google OAuth 2.0 API interaction and whitelist verification.
  - `otpService.js`: Cryptographic 6-digit OTP generation, PBKDF2 hashing, rate limits, and timing-safe comparisons.
  - `emailService.js`: Nodemailer dispatch engine for 2FA OTP codes and customer alerts.
- `routes/`:
  - `authRoutes.js`: Public admin authentication endpoints (`/admin/login`, `/admin/verify-otp`, `/admin/auth/*`, `/admin/logout`).
  - `adminRoutes.js`: Protected Super Admin dashboard and management APIs.

