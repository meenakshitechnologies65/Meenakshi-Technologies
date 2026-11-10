/**
 * EMAIL DISPATCH SERVICE
 * Transports 2FA OTP codes and customer enquiry notifications via Nodemailer.
 */

const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const hasCreds = config.smtp.user && config.smtp.pass && config.smtp.pass !== 'your-app-password';

  if (hasCreds) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      }
    });
  } else {
    // Development / fallback transporter
    transporter = {
      sendMail: async (options) => {
        console.log('\n================== [EMAIL DISPATCH LOG] ==================');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text Body:\n${options.text || ''}`);
        console.log('==========================================================\n');
        return { messageId: 'dev-mock-' + Date.now() };
      }
    };
  }

  return transporter;
}

/**
 * Send 2FA Six-Digit OTP to Administrator Email
 */
async function sendAdminOtpEmail(email, otpCode) {
  const mailer = getTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px; max-width: 520px; margin: 0 auto; border: 1.5px solid #d97706;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #fbbf24; margin: 0; font-size: 24px; letter-spacing: -0.02em;">MEENAKSHI TECHNOLOGIES</h2>
        <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Security Authentication Engine</span>
      </div>

      <div style="background: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); text-align: center;">
        <p style="color: #cbd5e1; font-size: 15px; margin-top: 0;">
          A request to sign in to the <strong>Meenakshi Technologies Admin Portal</strong> was initiated.
        </p>

        <p style="color: #94a3b8; font-size: 13px;">Your one-time six-digit verification code is:</p>

        <div style="background: #0b0f17; color: #fbbf24; font-size: 34px; font-weight: 900; letter-spacing: 8px; padding: 14px 20px; border-radius: 8px; border: 1.5px dashed #f59e0b; display: inline-block; margin: 16px 0; font-family: monospace;">
          ${otpCode}
        </div>

        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
          ⏱ This code expires in <strong>10 minutes</strong>. Never share this code with anyone.
        </p>
      </div>

      <p style="color: #64748b; font-size: 11px; text-align: center; margin-top: 24px;">
        Meenakshi Technologies Hyderabad • Dedicated Biometric Security & Access Control Infrastructure<br>
        If you did not request this login, please contact security immediately.
      </p>
    </div>
  `;

  const text = `Meenakshi Technologies Admin 2FA Code: ${otpCode}\nThis code is valid for 10 minutes.\nIf you did not request this, ignore this email.`;

  try {
    return await mailer.sendMail({
      from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
      to: email,
      subject: `[OTP: ${otpCode}] Meenakshi Technologies Admin Verification Code`,
      text,
      html
    });
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send OTP email:', err.message);
    // In case SMTP fails or is not setup yet, return mock response and log clearly
    return { error: err.message, mockSent: true };
  }
}

module.exports = {
  sendAdminOtpEmail,
  getTransporter
};

