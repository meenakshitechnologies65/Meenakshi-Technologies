const ejs = require('ejs');
const fs = require('fs');

try {
  const content = fs.readFileSync('views/partials/head.ejs', 'utf8');
  const compiled = ejs.compile(content);
  const result = compiled({
    title: 'Test Title',
    metaDescription: 'Test Desc',
    metaKeywords: 'Test Keywords',
    canonicalUrl: 'https://example.com',
    ogType: 'website',
    ogImage: '/images/logo.png',
    extraCss: undefined
  });
  console.log('EJS compilation SUCCESS! Output bytes:', result.length);
} catch (err) {
  console.error('EJS compilation ERROR:', err);
}

