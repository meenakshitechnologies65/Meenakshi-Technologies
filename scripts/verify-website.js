const http = require('http');

const BASE_URL = 'http://localhost:3000';

const routes = [
  '/',
  '/about',
  '/products',
  '/products/essl-k30-pro-biometric-attendance',
  '/products/biomax-speedface-5-ai-face-recognition-terminal',
  '/products/electromagnetic-door-lock-600lbs',
  '/services',
  '/services/biometric-attendance-systems-hyderabad',
  '/services/door-access-control-systems-hyderabad',
  '/services/payroll-management-software-integration',
  '/industries',
  '/industries/biometric-solutions-pharmaceutical-manufacturing',
  '/industries/biometric-solutions-manufacturing-companies',
  '/locations',
  '/locations/hyderabad',
  '/locations/balapur',
  '/service-areas',
  '/guide/biometric-dealers-hyderabad',
  '/blog',
  '/blog/essl-vs-biomax-biometric-machines-comparison',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/admin',
  '/api/cms/leads/export-csv',
  '/sitemap.xml',
  '/robots.txt',
  '/css/style.css',
  '/js/main.js',
  '/images/logo.png',
  '/images/tingirikar-teja.jpg',
  '/images/client-1.png',
  '/images/review-1.png',
  '/images/products/essl-k30-pro.svg',
  '/images/diagrams/biometric-workflow.svg'
];

function fetchRoute(route) {
  return new Promise((resolve, reject) => {
    http.get(BASE_URL + route, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ route, statusCode: res.statusCode, length: data.length });
      });
    }).on('error', err => reject(err));
  });
}

function testLeadPost() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      fullName: 'Dr. Suresh Reddy',
      companyName: 'Genome Bio Labs',
      email: 'suresh@genomebiolabs.com',
      mobileNumber: '+919988776655',
      location: 'Genome Valley, Hyderabad',
      productOrService: 'Face Recognition Attendance Machines',
      employeeCount: '50-200 Employees',
      message: 'Need 4 touchless face recognition terminals with cleanroom interlocking.'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/enquiry',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
      });
    });

    req.on('error', err => reject(err));
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('Testing all routes on http://localhost:3000...\n');
  let passCount = 0;
  let failCount = 0;

  for (const r of routes) {
    try {
      const res = await fetchRoute(r);
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`[PASS] ${res.statusCode} | ${r} (${res.length} bytes)`);
        passCount++;
      } else {
        console.error(`[FAIL] ${res.statusCode} | ${r}`);
        failCount++;
      }
    } catch (e) {
      console.error(`[ERR] ${r}:`, e.message);
      failCount++;
    }
  }

  console.log('\nTesting Lead Submission API (/api/enquiry)...');
  try {
    const postRes = await testLeadPost();
    if (postRes.statusCode === 200 && postRes.body.success) {
      console.log(`[PASS] Lead POST successful! Lead ID: #${postRes.body.leadId}`);
      passCount++;
    } else {
      console.error(`[FAIL] Lead POST status: ${postRes.statusCode}`, postRes.body);
      failCount++;
    }
  } catch (e) {
    console.error('[ERR] Lead POST error:', e.message);
    failCount++;
  }

  console.log(`\n========================================`);
  console.log(`TOTAL PASSED: ${passCount}`);
  console.log(`TOTAL FAILED: ${failCount}`);
  console.log(`========================================`);

  if (failCount === 0) {
    console.log('ALL TESTS PASSED! WEBSITE READY FOR PRODUCTION.');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();

