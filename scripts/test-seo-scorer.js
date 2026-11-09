const { analyzeArticleSEO } = require('../cms/services/seo-scorer.js');

const res = analyzeArticleSEO({
  title: 'Best eSSL Biometric Attendance Machine in Hyderabad',
  seoTitle: 'Best eSSL Biometric Attendance Machine in Hyderabad (2026)',
  slug: 'best-essl-biometric-attendance-machine-hyderabad',
  metaDescription: 'Looking for the best eSSL biometric attendance machine in Hyderabad? Check verified models, prices, fingerprint features, and get fast installation today.',
  focusKeyword: 'essl biometric attendance machine',
  canonicalUrl: '/blog/best-essl-biometric-attendance-machine-hyderabad',
  schemaType: 'Article',
  contentHtml: `
    <h1>eSSL Biometric Attendance Machine Hyderabad</h1>
    <p>Finding the right essl biometric attendance machine for your workplace in Hyderabad is critical for precise attendance.</p>
    <h2>Top Features of eSSL Biometric Attendance Machine</h2>
    <p>Here are the key benefits. Check out <a href="/products/essl-k90-pro-biometric-attendance">eSSL K90 Pro</a> and <a href="/services">our services</a>.</p>
    <h2>Installation and Support</h2>
    <p>For more info check <a href="https://www.esslsecurity.com">official guidelines</a>.</p>
    <img src="/images/essl.png" alt="eSSL biometric attendance machine installation in Hyderabad">
  `
});

console.log('--- TEST RESULTS ---');
console.log('Score:', res.score, res.grade);
console.log('Summary:', res.summary);
console.log('Basic checks:', res.categories.basic.length);
console.log('Advanced checks:', res.categories.advanced.length);
console.log('Technical checks:', res.categories.technical.length);
