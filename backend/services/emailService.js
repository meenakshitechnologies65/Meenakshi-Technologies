/**
 * EMAIL DISPATCH SERVICE
 * Transports 2FA OTP codes and customer enquiry notifications via Nodemailer.
 */

const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

function getTransporter() {
  const hasCreds = config.smtp.user && config.smtp.pass && config.smtp.pass.trim() !== '' && config.smtp.pass !== 'your-app-password';

  if (hasCreds) {
    return nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else {
    // Development / fallback transporter
    return {
      sendMail: async (options) => {
        console.log('\n================== [EMAIL DISPATCH LOG] ==================');
        console.log(`[NOTICE] Live SMTP password is not set in .env.`);
        console.log(`To: ${options.to}`);
        console.log(`CC: ${options.cc || 'None'}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text Body:\n${options.text || ''}`);
        console.log('==========================================================\n');
        return { messageId: 'dev-mock-' + Date.now(), mockSent: true };
      }
    };
  }
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

/**
 * Send Customer Business Enquiry Notification to Administrator Email
 */
async function sendNewLeadEmail(lead) {
  const mailer = getTransporter();
  const primaryRecipient = config.leadNotificationEmail || 'info@meenakshitechnologies.in';
  const adminBackupRecipient = config.authorizedAdminEmail || 'meenakshitechnologies65@gmail.com';
  const cleanPhone = (lead.mobileNumber || '').replace(/\D/g, '');
  const whatsappDigits = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    `Hello ${lead.fullName}, thank you for contacting Meenakshi Technologies regarding ${lead.productOrService}. We are pleased to assist you.`
  )}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background: #070a12; color: #f8fafc; padding: 28px; border-radius: 12px; max-width: 580px; margin: 0 auto; border: 2px solid #f59e0b;">
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid rgba(245, 158, 11, 0.3); padding-bottom: 16px;">
        <h2 style="color: #fbbf24; margin: 0; font-size: 22px; letter-spacing: -0.01em;">MEENAKSHI TECHNOLOGIES</h2>
        <span style="color: #38bdf8; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">New Business Enquiry Notification</span>
      </div>

      <div style="background: #0f172a; padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;">
          <span style="color: #94a3b8; font-size: 13px;">Lead Reference ID:</span>
          <strong style="color: #fbbf24; font-family: monospace; font-size: 14px;">#${lead.id}</strong>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 7px 0; color: #94a3b8; width: 35%;"><strong>Customer Name:</strong></td>
            <td style="padding: 7px 0; color: #ffffff; font-weight: 700;">${lead.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;"><strong>Mobile Number:</strong></td>
            <td style="padding: 7px 0;"><a href="tel:${lead.mobileNumber}" style="color: #38bdf8; font-weight: 700; text-decoration: none;">${lead.mobileNumber}</a></td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;"><strong>Customer Email:</strong></td>
            <td style="padding: 7px 0; color: #ffffff;">${lead.email || '<span style="color:#64748b;">Not provided</span>'}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;"><strong>Company Name:</strong></td>
            <td style="padding: 7px 0; color: #ffffff;">${lead.companyName || '<span style="color:#64748b;">Not provided</span>'}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;"><strong>Facility Location:</strong></td>
            <td style="padding: 7px 0; color: #fbbf24; font-weight: 600;">${lead.location || 'Hyderabad'}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;"><strong>Product / Solution:</strong></td>
            <td style="padding: 7px 0; color: #34d399; font-weight: 700;">${lead.productOrService}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;"><strong>Employee Count:</strong></td>
            <td style="padding: 7px 0; color: #cbd5e1;">${lead.employeeCount}</td>
          </tr>
        </table>

        ${lead.message ? `
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08);">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; font-weight: 700;">Customer Requirements:</span>
            <p style="color: #e2e8f0; font-size: 13.5px; background: rgba(0,0,0,0.3); padding: 10px 12px; border-radius: 6px; margin-top: 6px; border-left: 3px solid #f59e0b;">
              ${lead.message}
            </p>
          </div>
        ` : ''}
      </div>

      <!-- Quick Action Buttons -->
      <div style="text-align: center; margin-top: 22px;">
        <a href="${whatsappUrl}" target="_blank" style="background: #25D366; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; margin-right: 8px;">
          💬 Reply on WhatsApp
        </a>
        <a href="tel:${lead.mobileNumber}" style="background: #0284c7; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; margin-right: 8px;">
          📞 Call Customer
        </a>
        <a href="https://meenakshitechnologies.org/admin" target="_blank" style="background: #1e293b; color: #fbbf24; border: 1px solid #f59e0b; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
          🛡 Open CMS
        </a>
      </div>

      <p style="color: #64748b; font-size: 11px; text-align: center; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
        Meenakshi Technologies Hyderabad • Dedicated Biometric Attendance & Access Control Solutions<br>
        This lead was captured live from https://meenakshitechnologies.org at ${new Date(lead.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.
      </p>
    </div>
  `;

  const text = `
NEW BUSINESS ENQUIRY - MEENAKSHI TECHNOLOGIES
--------------------------------------------------
Lead ID: #${lead.id}
Customer Name: ${lead.fullName}
Mobile Number: ${lead.mobileNumber}
Email: ${lead.email || 'Not provided'}
Company: ${lead.companyName || 'Not provided'}
Location: ${lead.location || 'Hyderabad'}
Product / Solution: ${lead.productOrService}
Employee Count: ${lead.employeeCount}
Message: ${lead.message || 'None'}
Timestamp: ${lead.timestamp}
--------------------------------------------------
Admin Portal: https://meenakshitechnologies.org/admin
  `.trim();

  try {
    return await mailer.sendMail({
      from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
      to: primaryRecipient,
      cc: adminBackupRecipient !== primaryRecipient ? adminBackupRecipient : undefined,
      replyTo: lead.email || undefined,
      subject: `🔥 New Business Enquiry: ${lead.fullName} (${lead.productOrService}) - Meenakshi Technologies`,
      text,
      html
    });
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send Lead notification email:', err.message);
    return { error: err.message, mockSent: true };
  }
}

module.exports = {
  sendAdminOtpEmail,
  sendNewLeadEmail,
  getTransporter
};

