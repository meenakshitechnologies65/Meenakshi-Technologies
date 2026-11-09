/**
 * VERIFY PWA, CACHE SYSTEM & SECURITY HEADERS
 */

const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- STARTING PWA & CACHE VERIFICATION ---\n');
  let passed = 0;
  let failed = 0;

  function assert(desc, condition) {
    if (condition) {
      console.log(`✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
      failed++;
    }
  }

  try {
    // 1. Service Worker Route
    const swRes = await get('/sw.js');
    assert('Service Worker returns 200 OK', swRes.status === 200);
    assert('Service Worker has Service-Worker-Allowed: / header', swRes.headers['service-worker-allowed'] === '/');
    assert('Service Worker content-type is javascript', (swRes.headers['content-type'] || '').includes('javascript'));
    assert('Service Worker body defines CACHE_NAMES', swRes.body.includes('CACHE_NAMES') && swRes.body.includes('v2.1.0'));
    assert('Service Worker implements offline fallback', swRes.body.includes('/offline'));

    // 2. Web App Manifest
    const manifestRes = await get('/site.webmanifest');
    assert('Manifest returns 200 OK', manifestRes.status === 200);
    const manifest = JSON.parse(manifestRes.body);
    assert('Manifest short_name is Meenakshi Tech', manifest.short_name === 'Meenakshi Tech');
    assert('Manifest theme_color is #031926', manifest.theme_color === '#031926');
    assert('Manifest display is standalone', manifest.display === 'standalone');
    assert('Manifest has shortcuts defined', Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3);

    // 3. Offline Mode Page
    const offlineRes = await get('/offline');
    assert('Offline route returns 200 OK', offlineRes.status === 200);
    assert('Offline page has emergency helpline +91 6301593064', offlineRes.body.includes('+91 6301593064'));
    assert('Offline page mentions Gowlipura and Balapur', offlineRes.body.includes('Gowlipura') && offlineRes.body.includes('Balapur'));

    // 4. Security Headers on Homepage
    const homeRes = await get('/');
    assert('Homepage returns 200 OK', homeRes.status === 200);
    assert('Header X-Content-Type-Options: nosniff', homeRes.headers['x-content-type-options'] === 'nosniff');
    assert('Header X-Frame-Options: SAMEORIGIN', homeRes.headers['x-frame-options'] === 'SAMEORIGIN');
    assert('Header Referrer-Policy is present', homeRes.headers['referrer-policy'] === 'strict-origin-when-cross-origin');
    assert('Content-Security-Policy is enforced', !!homeRes.headers['content-security-policy']);

    // 5. XML Sitemap with Google Images
    const sitemapRes = await get('/sitemap.xml');
    assert('Sitemap returns 200 OK', sitemapRes.status === 200);
    assert('Sitemap has image:image namespace', sitemapRes.body.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'));
    assert('Sitemap has <image:image> tags', sitemapRes.body.includes('<image:image>'));
    assert('Sitemap has <image:loc> tags for products', sitemapRes.body.includes('<image:loc>https://www.meenakshitechnologies.org/images/products/'));

    // 6. Navigation Dropdowns & PWA elements in HTML
    assert('Homepage contains hierarchical dropdown nav', homeRes.body.includes('class="nav-dropdown"'));
    assert('Navigation Install App button is removed as requested', !homeRes.body.includes('id="pwaInstallHeaderBtn"'));
    assert('Navigation contains optimized Verified Locations dropdown', homeRes.body.includes('nav-dropdown-locations') && homeRes.body.includes('nav-locations-toggle'));
    assert('Footer contains pwaInstallFooterBtn', homeRes.body.includes('id="pwaInstallFooterBtn"'));
    assert('Homepage contains onlineStatusPill', homeRes.body.includes('id="onlineStatusPill"'));
    assert('Homepage contains clearCacheBtn', homeRes.body.includes('id="clearCacheBtn"'));
    assert('Homepage contains cacheStorageBadge', homeRes.body.includes('id="cacheStorageBadge"'));

    // 7. Static Caching Headers
    const cssRes = await get('/css/style.css');
    assert('CSS returns 200 OK', cssRes.status === 200);
    assert('CSS has immutable long-term Cache-Control', (cssRes.headers['cache-control'] || '').includes('immutable'));

    const imgRes = await get('/images/products/essl-k30-pro.png');
    assert('Product image returns 200 OK', imgRes.status === 200);
    assert('Product image has stale-while-revalidate', (imgRes.headers['cache-control'] || '').includes('stale-while-revalidate'));

    console.log(`\n========================================`);
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log(`========================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

run();

