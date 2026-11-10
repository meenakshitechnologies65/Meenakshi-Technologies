# Meenakshi Technologies - Secure Admin Panel

The administrative management system for Meenakshi Technologies.

## Security Architecture
- **Strict Whitelist**: Exclusively restricted to `meenakshitechnologies65@gmail.com`. All unauthorized email accounts are rejected with HTTP 403 Forbidden and logged into SQLite audit trail.
- **Two-Factor Authentication (2FA)**: Every login triggers a cryptographically random 6-digit OTP code hashed with PBKDF2 (SHA-256) and dispatched to `meenakshitechnologies65@gmail.com`.
- **Session Protection**: Encrypted HTTP-only cookies (`mt_admin_session`), CSRF verification, rate limiting, and automatic 7-day expiration.
- **Protected Endpoints**: All `/admin` dashboard routes and `/api/v2/*` endpoints are guarded by `requireAdminAuth` middleware.

## Views
- `login.ejs`: Google OAuth 2.0 & Direct Email 2FA initiation portal.
- `verify-otp.ejs`: 6-digit OTP input interface with auto-advance, countdown timer, and 60-second resend cooldown.
- `dashboard.ejs`: Full-featured administrative management console (Overview KPIs, Products CRUD, Customer Enquiries / Leads CRM with WhatsApp quick actions, YouTube videos, SEO settings, and SQLite security audit logs).

