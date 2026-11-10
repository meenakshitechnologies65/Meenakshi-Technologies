const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Has icon-hamburger:', html.includes('icon-hamburger'));
    console.log('Has icon-close:', html.includes('icon-close'));
    console.log('Has gold stroke #fbbf24:', html.includes('stroke="#fbbf24"'));
    console.log('Has CSS v=2026.20:', html.includes('style.css?v=2026.20'));
    console.log('Old v=2026.8 gone:', !html.includes('style.css?v=2026.8'));
    console.log('Has mobile-nav-critical-style:', html.includes('mobile-nav-critical-style'));
    process.exit(0);
  });
}).on('error', err => {
  console.error(err);
  process.exit(1);
});
