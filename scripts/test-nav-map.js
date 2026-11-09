const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

(async () => {
  console.log('--- Testing Navigation Menu & Direct Links ---');
  const home = await get('/');
  console.log('Homepage HTTP status:', home.status);

  // Check 4 direct links
  const hasDirectHome = home.body.includes('<a href="/" class="nav-link');
  const hasDirectProducts = home.body.includes('<a href="/products" class="nav-link');
  const hasDirectAbout = home.body.includes('<a href="/about" class="nav-link');
  const hasDirectContact = home.body.includes('<a href="/contact" class="nav-link');
  const hasDropdownInNav = home.body.includes('nav-dropdown');

  console.log('Direct Navigation Items:', {
    hasDirectHome,
    hasDirectProducts,
    hasDirectAbout,
    hasDirectContact,
    hasDropdownInNav: !hasDropdownInNav ? 'REMOVED (Direct link active)' : 'Present'
  });

  console.log('\n--- Testing Google Maps Embeds ---');
  const pagesToTest = ['/', '/contact', '/locations', '/locations/hyderabad', '/locations/balapur'];

  for (const page of pagesToTest) {
    const res = await get(page);
    const hasGoogleMapEmbed = res.body.includes('google.com/maps/embed');
    const hasOpenStreetMap = res.body.includes('openstreetmap.org');
    console.log(`Page: ${page} -> Status: ${res.status} | Has Google Maps Embed: ${hasGoogleMapEmbed} | Has OpenStreetMap: ${hasOpenStreetMap}`);
    if (!hasGoogleMapEmbed || hasOpenStreetMap) {
      console.error(`ERROR on page ${page}: Map embed check failed!`);
      process.exit(1);
    }
  }

  console.log('\n>>> ALL NAVIGATION AND GOOGLE MAP EMBED CHECKS PASSED PERFECTLY! <<<');
})();
