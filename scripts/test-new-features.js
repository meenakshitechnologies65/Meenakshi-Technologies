const http = require('http');

function postJson(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (_) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'GET',
      headers
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=== RUNNING TESTS FOR NEW FEATURES ===');

  // Test 1: Lead Submission with Email Dispatch
  console.log('\n--- 1. Testing Lead Submission (/api/enquiry) ---');
  const leadRes = await postJson('/api/enquiry', {
    fullName: 'Test Customer Ramesh',
    companyName: 'Hyderabad Pharma Ltd',
    email: 'ramesh.customer@example.com',
    mobileNumber: '+91 98765 43210',
    location: 'HITEC City, Hyderabad',
    productOrService: 'eSSL K30 Pro Biometric Attendance Machine',
    employeeCount: '50-200 Employees',
    message: 'We require 2 biometric machines with door access control integration.'
  });
  console.log('Lead Submission Status:', leadRes.status);
  console.log('Lead Submission Result:', leadRes.body);
  if (leadRes.status === 200 && leadRes.body.success) {
    console.log('[PASS] Lead captured and email dispatch initiated for meenakshitechnologies65@gmail.com!');
  } else {
    console.error('[FAIL] Lead submission failed:', leadRes);
    process.exit(1);
  }

  // Test 2: Admin Password Login with Authorized Email
  console.log('\n--- 2. Testing Admin Password Login (/admin/auth/password) ---');
  const loginRes = await postJson('/admin/auth/password', {
    email: 'meenakshitechnologies65@gmail.com',
    password: 'Meenakshi@2026'
  });
  console.log('Login Status:', loginRes.status);
  console.log('Login Result:', loginRes.body);
  if (loginRes.status === 200 && loginRes.body.success) {
    console.log('[PASS] Admin password authentication succeeded!');
  } else {
    console.error('[FAIL] Admin password authentication failed:', loginRes);
    process.exit(1);
  }

  // Check session cookie
  const cookieHeader = loginRes.headers['set-cookie'];
  console.log('Session Cookie Set:', Boolean(cookieHeader));
  const sessionCookie = cookieHeader ? cookieHeader.find(c => c.startsWith('mt_admin_session=')) : null;

  // Test 3: Access Protected Admin Dashboard with Cookie
  console.log('\n--- 3. Testing Protected Dashboard Access (/admin) ---');
  const dashRes = await get('/admin', {
    Cookie: sessionCookie
  });
  console.log('Dashboard Status:', dashRes.status);
  if (dashRes.status === 200 && dashRes.body.includes('meenakshitechnologies65@gmail.com')) {
    console.log('[PASS] Admin Dashboard successfully loaded for meenakshitechnologies65@gmail.com!');
  } else {
    console.error('[FAIL] Dashboard access failed, got status:', dashRes.status);
    process.exit(1);
  }

  // Test 4: Unauthorized Email Rejection on Password Login
  console.log('\n--- 4. Testing Unauthorized Email Rejection ---');
  const badLogin = await postJson('/admin/auth/password', {
    email: 'hacker@gmail.com',
    password: 'Meenakshi@2026'
  });
  console.log('Unauthorized Login Status:', badLogin.status);
  if (badLogin.status === 403) {
    console.log('[PASS] Unauthorized login strictly blocked with HTTP 403!');
  } else {
    console.error('[FAIL] Unauthorized login not blocked:', badLogin);
    process.exit(1);
  }

  // Test 5: Verify Mobile Nav & Arrow Mark in HTML
  console.log('\n--- 5. Testing Mobile Nav Arrow Mark & Branding in Rendered HTML ---');
  const pageRes = await get('/');
  const cssRes = await get('/css/style.css');
  const hasArrowFix = pageRes.body.includes("position: static !important") && pageRes.body.includes("content: '›' !important");
  const hasBrandSubtitle = pageRes.body.includes("TECHNOLOGIES");
  const hasResponsiveContact = cssRes.body.includes("RESPONSIVE \"SEND A BUSINESS ENQUIRY\"");
  console.log('Arrow Fix Present (position: static):', hasArrowFix);
  console.log('Brand Subtitle Present:', hasBrandSubtitle);
  console.log('Responsive Contact Form CSS in style.css:', hasResponsiveContact);

  if (hasArrowFix && hasBrandSubtitle && hasResponsiveContact) {
    console.log('[PASS] All visual and responsive styling fixes verified in rendered HTML & CSS!');
  } else {
    console.error('[FAIL] Some styling rules missing!');
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('========================================');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
