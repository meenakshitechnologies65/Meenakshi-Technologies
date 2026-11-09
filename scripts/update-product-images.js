const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const dbPath = path.join(__dirname, '..', 'data', 'cms_v2.sqlite');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Exact mappings of product slugs to accurate verified images
const slugImageMap = {
  // Fingerprint Attendance
  'essl-k90-pro-biometric-attendance': '/images/products/essl-k90-pro.png',
  'essl-k30-pro-biometric-attendance': '/images/products/essl-k30-pro.png',
  'biomax-n-bm60-biometric-attendance-system': '/images/products/biomax-n-bm60.png',
  'biomax-bio-5000-industrial-fingerprint-system': '/images/products/biomax-bio-5000.png',
  'essl-identix-k21-fingerprint-attendance-system': '/images/products/essl-identix-k21.png',

  // Face Recognition Attendance
  'biomax-speedface-5-ai-face-recognition-terminal': '/images/products/biomax-speedface-5.png',
  'biomax-ai-face-4-compact-face-recognition': '/images/products/biomax-ai-face-4.png',

  // Advanced Multi-Biometric Devices
  'essl-uface-202-multi-biometric-attendance-machine': '/images/products/essl-uface-202.png',
  'essl-silkbio-100tc-multi-biometric-attendance-machine': '/images/products/essl-silkbio-100tc.png',
  'biomax-facemax-7-palm-face-recognition-terminal': '/images/products/biomax-facemax-7.png',

  // Advanced Access Control Systems
  'essl-inbio-260-multi-door-controller': '/images/products/essl-inbio-260.png',
  'essl-inbio-460-four-door-access-controller': '/images/products/essl-inbio-460.png',
  'biomax-c22-two-door-access-controller': '/images/products/biomax-c22.png',

  // Biometric Access Control Readers
  'essl-f22-ultra-thin-access-control-terminal': '/images/products/essl-f22.png',
  'essl-fr1200-waterproof-slave-reader': '/images/products/essl-fr1200.png',

  // Door Locking Systems
  'electromagnetic-door-lock-600lbs': '/images/products/electromagnetic-door-lock-600lbs.png',
  'electromagnetic-door-lock-1200lbs': '/images/products/electromagnetic-door-lock-1200lbs.png',
  'electric-drop-bolt-lock': '/images/products/drop-bolt-lock.png',
  'smart-fingerprint-glass-door-lock': '/images/products/smart-glass-door-lock-gl300.png',

  // Access Control Accessories
  'exit-push-button-no-touch-infrared-switch': '/images/products/exit-button-no-touch-switch.png',
  'access-control-power-supply-12v-5a-battery-backup': '/images/products/access-control-power-supply-12v5a.png',
  'rfid-proximity-cards-mifare-smart-cards': '/images/products/rfid-smart-cards-tags.png',

  // Turnstile and Entrance Management
  'essl-ts1000-pro-tripod-turnstile': '/images/products/essl-ts1000-pro-turnstile.png',
  'essl-fbl4000-high-speed-flap-barrier': '/images/products/essl-fbl4000-flap-barrier.png',

  // Boom Barrier Systems
  'essl-bg1000-automatic-vehicle-boom-barrier': '/images/products/essl-bg1000-boom-barrier.png',

  // Additional Security Products
  'essl-d1065s-walk-through-metal-detector': '/images/products/essl-d1065s-walk-through-metal-detector.jpg',
  'biomax-md-300-handheld-metal-detector': '/images/products/biomax-md-300-metal-detector.png'
};

let updatedCount = 0;

products.forEach(p => {
  if (slugImageMap[p.slug]) {
    p.image = slugImageMap[p.slug];
    updatedCount++;
  } else {
    console.warn(`[WARNING] No mapping for slug: ${p.slug} (${p.name})`);
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Updated ${updatedCount} products in ${productsPath}`);

// Sync to SQLite CMS database
if (fs.existsSync(dbPath)) {
  const db = new DatabaseSync(dbPath);
  const updateStmt = db.prepare(`
    UPDATE products 
    SET featured_image_url = ? 
    WHERE slug = ?
  `);

  products.forEach(p => {
    updateStmt.run(p.image, p.slug);
  });

  console.log(`Synced all ${products.length} product images to CMS v2.0 SQLite database.`);
}
