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
  const home = await get('/');
  console.log('Homepage status:', home.status);

  // Check 4 primary navigation items
  const navItems = ['HOME', 'PRODUCTS', 'ABOUT US', 'CONTACT US'];
  const missingNav = navItems.filter(item => !home.body.includes(`>${item}<`));
  console.log('Primary Nav Items missing:', missingNav);

  // Check 10 requested product categories
  const categories = [
    'Biometric Attendance Machines',
    'Fingerprint Devices',
    'Face Recognition Devices',
    'eSSL Biometric Devices',
    'Biomax Biometric Devices',
    'Access Control Systems',
    'Advanced Access Control',
    'RFID Devices',
    'CCTV Systems',
    'Attendance and Payroll Software'
  ];
  const missingCategories = categories.filter(c => !home.body.includes(c));
  console.log('Missing dropdown categories:', missingCategories);

  // Check YouTube thumbnails on homepage
  const hasThumbContainer = home.body.includes('class="video-thumbnail-container"');
  const hasImgYt = home.body.includes('img.youtube.com/vi/');
  const hasHqDefault = home.body.includes('/hqdefault.jpg');
  const hasPlayOverlay = home.body.includes('class="video-play-overlay"');
  const hasFallback = home.body.includes('/images/youtube-fallback.svg');
  console.log('YouTube Thumbnails markup in Home:', { hasThumbContainer, hasImgYt, hasHqDefault, hasPlayOverlay, hasFallback });

  // Check fallback SVG endpoint
  const svg = await get('/images/youtube-fallback.svg');
  console.log('Fallback SVG status:', svg.status, 'len:', svg.body.length);

  // Check About page
  const about = await get('/about');
  const aboutHasThumb = about.body.includes('class="video-thumbnail-container"');
  console.log('About page YouTube thumbnails:', aboutHasThumb);

  if (missingNav.length === 0 && missingCategories.length === 0 && hasThumbContainer && hasImgYt && aboutHasThumb && svg.status === 200) {
    console.log('\n>>> ALL NAVIGATION AND YOUTUBE THUMBNAIL TESTS PASSED PERFECTLY! <<<');
  } else {
    console.error('\n>>> SOME TESTS FAILED! <<<');
    process.exit(1);
  }
})();

