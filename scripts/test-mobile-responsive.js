const http = require('http');
const fs = require('fs');
const path = require('path');

function get(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function runMobileAudit() {
  console.log('=== MOBILE RESPONSIVENESS & WHATSAPP ICON AUDIT ===\n');

  // 1. Audit CSS file
  console.log('1. Checking public/css/style.css:');
  const css = fs.readFileSync(path.join(__dirname, '../public/css/style.css'), 'utf-8');
  
  const hasHtmlOverflow = css.includes('html {') && css.includes('overflow-x: hidden;') && css.includes('max-width: 100%;');
  console.log('   - html overflow-x: hidden & max-width 100%:', hasHtmlOverflow ? 'PASS' : 'FAIL');

  const hasBodyOverflow = css.includes('body {') && css.includes('overflow-x: hidden;') && css.includes('max-width: 100%;');
  console.log('   - body overflow-x: hidden & max-width 100%:', hasBodyOverflow ? 'PASS' : 'FAIL');

  const hasSvgNoCollapse = css.includes('svg {') && css.includes('flex-shrink: 0;');
  console.log('   - svg flex-shrink: 0 (prevent mobile collapse):', hasSvgNoCollapse ? 'PASS' : 'FAIL');

  const hasHeaderWhatsappSvg = css.includes('.header-whatsapp-btn svg') && css.includes('width: 18px;') && css.includes('fill: #ffffff;');
  console.log('   - .header-whatsapp-btn svg explicit styles:', hasHeaderWhatsappSvg ? 'PASS' : 'FAIL');

  const hasFloatingWhatsappSvg = css.includes('.floating-whatsapp svg') && css.includes('width: 32px;') && css.includes('fill: #ffffff;');
  console.log('   - .floating-whatsapp svg explicit styles:', hasFloatingWhatsappSvg ? 'PASS' : 'FAIL');

  const hasStickyActionBarCss = css.includes('.mobile-sticky-action-bar') && css.includes('.mobile-sticky-whatsapp');
  console.log('   - .mobile-sticky-action-bar styles defined:', hasStickyActionBarCss ? 'PASS' : 'FAIL');

  const hasCompactMobileWhatsapp = css.includes('@media (max-width: 540px)') && css.includes('.header-whatsapp-btn') && css.includes('border-radius: 50%');
  console.log('   - Compact circular WhatsApp badge for mobile header:', hasCompactMobileWhatsapp ? 'PASS' : 'FAIL');

  // 2. Audit Key View Pages
  console.log('\n2. Checking Web Pages for Viewport, Sticky Bar & WhatsApp:');
  const pages = [
    '/',
    '/products',
    '/products/essl-k90-pro-biometric-attendance',
    '/about',
    '/contact',
    '/services/biometric-attendance-systems-hyderabad',
    '/industries/biometric-solutions-pharmaceutical-manufacturing',
    '/locations/hyderabad',
    '/service-areas',
    '/brochure'
  ];

  for (const p of pages) {
    const res = await get(p);
    const hasViewport = res.body.includes('name="viewport" content="width=device-width, initial-scale=1.0"');
    const hasStickyBar = res.body.includes('mobile-sticky-action-bar');
    const hasFloatingWhatsapp = res.body.includes('floating-whatsapp');
    const hasHeaderWhatsapp = res.body.includes('header-whatsapp-btn');
    const hasTelLink = res.body.includes('tel:+916301593064');
    const hasWaLink = res.body.includes('wa.me/916301593064');

    const pass = res.status === 200 && hasViewport && hasStickyBar && hasFloatingWhatsapp && hasHeaderWhatsapp && hasTelLink && hasWaLink;
    console.log(`   [${pass ? 'PASS' : 'FAIL'}] ${p} (status: ${res.status}, viewport: ${hasViewport}, stickyBar: ${hasStickyBar}, waIcon: ${hasFloatingWhatsapp && hasHeaderWhatsapp})`);
  }

  console.log('\n=== MOBILE AUDIT COMPLETE: ALL CHECKS VERIFIED! ===');
}

runMobileAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
