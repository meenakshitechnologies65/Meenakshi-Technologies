/**
 * Comprehensive Product Catalogue & PDF Download Verification Script
 */
const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          length: buffer.length,
          text: buffer.toString('utf8', 0, Math.min(buffer.length, 500))
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- STARTING CATALOGUE & PDF VERIFICATION ---');

  const testPaths = [
    { name: 'Products Catalogue Page', path: '/products', expectType: 'text/html' },
    { name: 'Individual Product (eSSL K90 Pro)', path: '/products/essl-k90-pro-biometric-attendance', expectType: 'text/html' },
    { name: 'Individual Product (BioMax SpeedFace 5)', path: '/products/biomax-speedface-5-ai-terminal', expectType: 'text/html' },
    { name: 'Dynamic Datasheet PDF (eSSL K90 Pro)', path: '/products/essl-k90-pro-biometric-attendance/datasheet.pdf', expectType: 'application/pdf' },
    { name: 'Dynamic Datasheet PDF (BioMax SpeedFace 5)', path: '/products/biomax-speedface-5-ai-terminal/datasheet.pdf', expectType: 'application/pdf' },
    { name: 'Dynamic eSSL Brand Catalogue PDF', path: '/catalogues/essl-biometric-catalogue-2026.pdf', expectType: 'application/pdf' },
    { name: 'Dynamic BioMax Brand Catalogue PDF', path: '/catalogues/biomax-biometric-catalogue-2026.pdf', expectType: 'application/pdf' },
    { name: 'Dynamic Category PDF Download', path: '/catalogues/download?category=Biometric%20Fingerprint%20Attendance%20Machines', expectType: 'application/pdf' },
    { name: 'Admin Dashboard / CMS v2.0', path: '/admin', expectType: 'text/html' },
    { name: 'CMS v2.0 Products API', path: '/api/v2/products', expectType: 'application/json' }
  ];

  let passed = 0;
  for (const t of testPaths) {
    try {
      const res = await get(t.path);
      const isStatusOk = res.statusCode >= 200 && res.statusCode < 400;
      const contentType = res.headers['content-type'] || '';
      const isTypeOk = contentType.includes(t.expectType);

      if (isStatusOk && isTypeOk && res.length > 0) {
        console.log(`[PASS] ${t.name}: Status ${res.statusCode}, Type: ${contentType}, Size: ${res.length} bytes`);
        passed++;
      } else {
        console.error(`[FAIL] ${t.name}: Status ${res.statusCode}, Content-Type: ${contentType}, Size: ${res.length}`);
      }
    } catch (e) {
      console.error(`[ERROR] ${t.name}: ${e.message}`);
    }
  }

  console.log(`--- RESULTS: ${passed}/${testPaths.length} TESTS PASSED ---`);
  if (passed === testPaths.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
