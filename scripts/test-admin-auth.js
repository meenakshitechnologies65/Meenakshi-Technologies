/**
 * AUTOMATED SECURITY & AUTHENTICATION TEST SUITE
 * Verifies:
 * 1. Unauthenticated /admin redirect to /admin/login
 * 2. Unauthorized email rejection (HTTP 403)
 * 3. Whitelisted email OTP generation (meenakshitechnologies65@gmail.com)
 * 4. Invalid OTP rejection
 * 5. Valid OTP verification & session cookie issuance
 * 6. Authenticated access to /admin
 * 7. Secure logout & session invalidation
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const BASE_URL = 'http://localhost:3000';
const dbPath = path.join(__dirname, '../data/cms_v2.sqlite');
const db = new DatabaseSync(dbPath);

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING MEENAKSHI TECHNOLOGIES AUTH SECURITY TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // TEST 1: Unauthenticated access to /admin
    console.log('--- Test 1: Direct access to /admin without auth ---');
    const res1 = await fetch(`${BASE_URL}/admin`, { redirect: 'manual' });
    assert(res1.status === 302, `Unauthenticated /admin redirects with HTTP 302 (got ${res1.status})`);
    assert(res1.headers.get('location') === '/admin/login', `Redirect location is /admin/login (got ${res1.headers.get('location')})`);

    // TEST 2: Unauthorized email rejection
    console.log('\n--- Test 2: Unauthorized email rejection ---');
    const res2 = await fetch(`${BASE_URL}/admin/auth/email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'unauthorized_hacker@gmail.com' })
    });
    assert(res2.status === 403, `Unauthorized email receives HTTP 403 (got ${res2.status})`);
    const data2 = await res2.json();
    assert(data2.success === false, `Response success is false`);
    assert(data2.error.includes('Access Denied'), `Error states Access Denied: "${data2.error}"`);

    // Verify rejection audit log in SQLite
    const auditRejected = db.prepare(`
      SELECT action, status, email FROM auth_audit_logs 
      WHERE email = 'unauthorized_hacker@gmail.com' 
      ORDER BY id DESC LIMIT 1
    `).get();
    assert(auditRejected && auditRejected.action === 'unauthorized_rejected' && auditRejected.status === 'BLOCKED', 
      `Audit trail logged blocked unauthorized attempt in SQLite`);

    // TEST 3: Authorized admin email OTP generation
    console.log('\n--- Test 3: Authorized admin email OTP generation ---');
    const res3 = await fetch(`${BASE_URL}/admin/auth/email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'meenakshitechnologies65@gmail.com' })
    });
    assert(res3.status === 200, `Authorized email receives HTTP 200 (got ${res3.status})`);
    const setCookie = res3.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('mt_preauth_email='), `Pre-auth cookie issued: ${setCookie}`);

    // TEST 4: Invalid OTP rejection
    console.log('\n--- Test 4: Invalid OTP submission ---');
    const res4 = await fetch(`${BASE_URL}/admin/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'mt_preauth_email=meenakshitechnologies65%40gmail.com'
      },
      body: JSON.stringify({ otp: '000000' })
    });
    assert(res4.status === 400, `Incorrect OTP returns HTTP 400 (got ${res4.status})`);

    // TEST 5: Valid OTP verification
    console.log('\n--- Test 5: Fetch latest OTP and verify ---');
    // Invalidate previous OTPs so our known test OTP is the single active OTP
    db.prepare("UPDATE admin_otps SET is_used = 1 WHERE email = 'meenakshitechnologies65@gmail.com'").run();

    const crypto = require('node:crypto');
    const testCode = '654321';
    const testSalt = crypto.randomBytes(16).toString('hex');
    const testHash = crypto.pbkdf2Sync(testCode, testSalt, 10000, 32, 'sha256').toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO admin_otps (id, email, otp_hash, salt, attempts, is_used, expires_at)
      VALUES (?, 'meenakshitechnologies65@gmail.com', ?, ?, 0, 0, ?)
    `).run('test_otp_' + Date.now(), testHash, testSalt, expiresAt);

    const res5 = await fetch(`${BASE_URL}/admin/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'mt_preauth_email=meenakshitechnologies65%40gmail.com'
      },
      body: JSON.stringify({ otp: testCode })
    });

    assert(res5.status === 200, `Valid OTP verification returns HTTP 200 (got ${res5.status})`);
    const data5 = await res5.json();
    assert(data5.success === true, `Response success is true: "${data5.message}"`);
    const sessionCookieHeader = res5.headers.get('set-cookie');
    assert(sessionCookieHeader && sessionCookieHeader.includes('mt_admin_session='), `Authenticated session cookie set: ${sessionCookieHeader}`);

    const sessionMatch = sessionCookieHeader.match(/mt_admin_session=([^;]+)/);
    const sessionToken = sessionMatch ? sessionMatch[1] : '';

    // TEST 6: Access protected /admin with valid session cookie
    console.log('\n--- Test 6: Access protected /admin with session cookie ---');
    const res6 = await fetch(`${BASE_URL}/admin`, {
      headers: { 'Cookie': `mt_admin_session=${sessionToken}` }
    });
    assert(res6.status === 200, `Protected /admin returns HTTP 200 (got ${res6.status})`);
    const html6 = await res6.text();
    assert(html6.includes('meenakshitechnologies65@gmail.com'), `Dashboard contains authenticated admin email`);
    assert(html6.includes('Product Catalog Inventory'), `Dashboard contains product catalog module`);

    // TEST 7: Logout
    console.log('\n--- Test 7: Secure Logout ---');
    const res7 = await fetch(`${BASE_URL}/admin/logout`, {
      headers: { 'Cookie': `mt_admin_session=${sessionToken}` },
      redirect: 'manual'
    });
    assert(res7.status === 302, `Logout returns HTTP 302 redirect`);

    // TEST 8: Verify session invalidated
    console.log('\n--- Test 8: Verify destroyed session cannot access /admin ---');
    const res8 = await fetch(`${BASE_URL}/admin`, {
      headers: { 'Cookie': `mt_admin_session=${sessionToken}` },
      redirect: 'manual'
    });
    assert(res8.status === 302 && res8.headers.get('location').includes('/admin/login'), 
      `Destroyed session redirects back to /admin/login`);

    console.log('\n====================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
