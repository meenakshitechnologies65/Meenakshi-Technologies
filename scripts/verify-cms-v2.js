/**
 * CMS MANAGEMENT v2.0 - AUTOMATED VERIFICATION SUITE
 * Tests all 20 modules, endpoints, live Rank Math SEO scores, and AI synthesis.
 */

async function runTests() {
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  console.log('Testing CMS Management v2.0 Platform on ' + baseUrl + '...\n');

  // 1. Test Admin Dashboard Page
  await test('GET /admin (CMS v2.0 Interface)', async () => {
    const res = await fetch(`${baseUrl}/admin`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('CMS Management v2.0')) throw new Error('Missing CMS Management v2.0 brand');
    if (!text.includes('Rank Math Live SEO')) throw new Error('Missing Rank Math SEO widget');
  });

  // 2. Test Auth Login API
  let sessionToken = '';
  await test('POST /api/v2/auth/login', async () => {
    const res = await fetch(`${baseUrl}/api/v2/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@meenakshi.com', password: 'Meenakshi@2026' })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.token) throw new Error('Login failed');
    sessionToken = data.token;
  });

  // 3. Test Dashboard KPIs API
  await test('GET /api/v2/dashboard/kpis', async () => {
    const res = await fetch(`${baseUrl}/api/v2/dashboard/kpis`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.kpis.totalPublishedArticles === undefined) throw new Error('Invalid KPI payload');
  });

  // 4. Test Dashboard Charts API
  await test('GET /api/v2/dashboard/charts', async () => {
    const res = await fetch(`${baseUrl}/api/v2/dashboard/charts`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.datasets.impressions) throw new Error('Invalid Chart telemetry');
  });

  // 5. Test Live Rank Math SEO Scoring Engine API
  await test('POST /api/v2/seo/score (Rank Math Algorithmic Engine)', async () => {
    const res = await fetch(`${baseUrl}/api/v2/seo/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Best eSSL Biometric Attendance Machine in Hyderabad',
        seoTitle: 'Best eSSL Biometric Attendance Machine in Hyderabad (2026)',
        slug: 'best-essl-biometric-attendance-machine-hyderabad',
        metaDescription: 'Find genuine eSSL biometric attendance machines in Hyderabad. Explore models, specifications, and fast installation.',
        focusKeyword: 'essl biometric attendance machine',
        contentHtml: '<h1>eSSL Biometric Attendance Machine</h1><p>Top essl biometric attendance machine in Hyderabad.</p><h2>Top Features of eSSL Biometric Attendance Machine</h2><p>Check <a href="/products">products</a> and <a href="https://essl.com">official site</a>.</p><img src="/img.png" alt="essl biometric attendance machine">'
      })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.score === undefined || data.score < 50) throw new Error('SEO scoring failed or score invalid');
  });

  // 6. Test AI Article Generator API
  await test('POST /api/v2/ai/generate-article (AI Writer)', async () => {
    const res = await fetch(`${baseUrl}/api/v2/ai/generate-article`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword: 'face recognition biometric attendance',
        topic: 'Touchless attendance for IT companies',
        wordCount: 800
      })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.contentHtml || data.wordCount < 400) throw new Error('AI generation failed');
  });

  // 7. Test AI Section Rewriter API
  await test('POST /api/v2/ai/rewrite-section', async () => {
    const res = await fetch(`${baseUrl}/api/v2/ai/rewrite-section`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'In order to utilize biometric machines very effectively due to the fact that proxies happen.',
        instruction: 'Improve conciseness and SEO impact'
      })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.rewrittenText) throw new Error('Rewriter failed');
  });

  // 8. Test Keyword Research Engine API
  await test('POST /api/v2/keywords/research', async () => {
    const res = await fetch(`${baseUrl}/api/v2/keywords/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'biometric dealers' })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.keywords.length === 0) throw new Error('Keyword research failed');
  });

  // 9. Test Keyword CSV Export API
  await test('GET /api/v2/keywords/export-csv', async () => {
    const res = await fetch(`${baseUrl}/api/v2/keywords/export-csv`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('Monthly Search Volume')) throw new Error('CSV missing headers');
  });

  // 10. Test Competitor SERP Analysis API
  await test('POST /api/v2/competitors/analyze', async () => {
    const res = await fetch(`${baseUrl}/api/v2/competitors/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetKeyword: 'biometric dealers in hyderabad' })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.competitors.length === 0) throw new Error('Competitor analysis failed');
  });

  // 11. Test Google Search Console Telemetry API
  await test('GET /api/v2/gsc/performance', async () => {
    const res = await fetch(`${baseUrl}/api/v2/gsc/performance`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.topQueries) throw new Error('GSC performance failed');
  });

  // 12. Test Products API
  await test('GET /api/v2/products', async () => {
    const res = await fetch(`${baseUrl}/api/v2/products`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.products.length < 5) throw new Error('Products API failed');
  });

  // 13. Test Schema JSON-LD Generator API
  await test('POST /api/v2/schema/generate', async () => {
    const res = await fetch(`${baseUrl}/api/v2/schema/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'LocalBusiness' })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.schema['@type'] !== 'LocalBusiness') throw new Error('Schema generation failed');
  });

  // 14. Test Internal Linking Engine API
  await test('POST /api/v2/links/recommend', async () => {
    const res = await fetch(`${baseUrl}/api/v2/links/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentHtml: '<p>Looking for essl k90 pro in hyderabad balapur?</p>' })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.recommendations) throw new Error('Internal links recommendation failed');
  });

  // 15. Test Website SEO Audit API
  await test('POST /api/v2/audit/run', async () => {
    const res = await fetch(`${baseUrl}/api/v2/audit/run`, { method: 'POST' });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.report.actionPlan) throw new Error('Site audit failed');
  });

  console.log(`\n========================================`);
  console.log(`CMS v2.0 TESTS PASSED: ${passed}`);
  console.log(`CMS v2.0 TESTS FAILED: ${failed}`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runTests();

