/**
 * MEENAKSHI TECHNOLOGIES - SMTP EMAIL DIAGNOSTIC & TEST TOOL
 * Tests SMTP connection and dispatches a test enquiry email.
 */

try {
  process.loadEnvFile();
} catch (e) {}

const nodemailer = require('nodemailer');
const config = require('../backend/config');
const { sendNewLeadEmail } = require('../backend/services/emailService');

async function testEmail() {
  console.log('======================================================');
  console.log('   MEENAKSHI TECHNOLOGIES - EMAIL DIAGNOSTIC TOOL     ');
  console.log('======================================================');
  console.log('SMTP Host:       ', config.smtp.host);
  console.log('SMTP Port:       ', config.smtp.port);
  console.log('SMTP User:       ', config.smtp.user);
  console.log('SMTP Secure:     ', config.smtp.secure);
  console.log('Primary Recipient:', config.leadNotificationEmail || 'info@meenakshitechnologies.in');
  console.log('Backup Admin:    ', config.authorizedAdminEmail || 'meenakshitechnologies65@gmail.com');

  const isConfigured = config.smtp.user && config.smtp.pass && config.smtp.pass !== 'your-app-password';

  if (!isConfigured) {
    console.log('\n❌ [STATUS] Real SMTP is NOT configured.');
    console.log('   Current SMTP_PASS is either missing or still the default "your-app-password".');
    console.log('   Enquiries are currently logged to console and saved to data/leads.json,');
    console.log('   but CANNOT be delivered to the inbox without SMTP credentials.\n');
    return;
  }

  console.log('\nConnecting to SMTP server...');
  const transporter = nodemailer.createTransport({
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

  try {
    await transporter.verify();
    console.log('✅ [SUCCESS] SMTP credentials authenticated successfully!');
  } catch (err) {
    console.error('\n❌ [AUTHENTICATION FAILED]:', err.message);
    if (config.smtp.host.includes('gmail')) {
      console.log('\n👉 FOR GMAIL:');
      console.log('   1. Go to https://myaccount.google.com/apppasswords');
      console.log('   2. Sign in with meenakshitechnologies65@gmail.com');
      console.log('   3. Generate a 16-character App Password (e.g. abcd efgh ijkl mnop)');
      console.log('   4. Update SMTP_PASS in .env with that 16-character password.\n');
    } else if (config.smtp.host.includes('hostinger')) {
      console.log('\n👉 FOR HOSTINGER (info@meenakshitechnologies.in):');
      console.log('   1. Set SMTP_HOST=smtp.hostinger.com');
      console.log('   2. Set SMTP_PORT=465 (or 587)');
      console.log('   3. Set SMTP_USER=info@meenakshitechnologies.in');
      console.log('   4. Set SMTP_PASS to your Hostinger email mailbox password.\n');
    }
    return;
  }

  console.log('Sending test lead email...');
  const testLead = {
    id: 'test-' + Date.now().toString(36),
    fullName: 'Test Verification Lead',
    companyName: 'Meenakshi Technologies Internal Test',
    email: 'test@meenakshitechnologies.org',
    mobileNumber: '+916301593064',
    location: 'Hyderabad',
    productOrService: 'eSSL K90 Pro Biometric Attendance',
    employeeCount: '25-50 Employees',
    message: 'This is a test notification verifying that customer enquiry emails are being delivered properly.',
    timestamp: new Date().toISOString()
  };

  const res = await sendNewLeadEmail(testLead);
  if (res && res.error) {
    console.error('❌ Failed to send test email:', res.error);
  } else {
    console.log('✅ Test email successfully sent! Check inbox at:');
    console.log('   - ' + (config.leadNotificationEmail || 'info@meenakshitechnologies.in'));
    console.log('   - ' + (config.authorizedAdminEmail || 'meenakshitechnologies65@gmail.com'));
  }
}

testEmail();
