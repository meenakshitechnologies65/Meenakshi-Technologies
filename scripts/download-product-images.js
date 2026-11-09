const fs = require('fs');
const path = require('path');

const downloads = [
  {
    url: 'https://www.biomaxsecurity.com/storage/app/media/device/N-UltraFace/n-ultraface_.png',
    dest: 'public/images/products/biomax-ai-face-4.png'
  },
  {
    url: 'https://www.biomaxsecurity.com/storage/app/media/AI-Series/Front/7.png',
    dest: 'public/images/products/biomax-facemax-7.png'
  },
  {
    url: 'https://media.esslsecurity.com/media/doorcontroller/inBio-460.png',
    dest: 'public/images/products/essl-inbio-460.png'
  },
  {
    url: 'https://www.biomaxsecurity.com/storage/app/media/device/N-BM22-Face/N-BM22F1.png',
    dest: 'public/images/products/biomax-c22.png'
  },
  {
    url: 'https://media.esslsecurity.com/media/fingerprint/FR1200.png',
    dest: 'public/images/products/essl-fr1200.png'
  },
  {
    url: 'https://www.biomaxsecurity.com/storage/app/media/Accessories/EM%20Lock.png',
    dest: 'public/images/products/electromagnetic-door-lock-600lbs.png'
  },
  {
    url: 'https://www.biomaxsecurity.com/storage/app/media/Accessories/EM%20Lock%20with%20Feedback.png',
    dest: 'public/images/products/electromagnetic-door-lock-1200lbs.png'
  },
  {
    url: 'https://media.esslsecurity.com/media/fingerprintdoorlock/GL300.png',
    dest: 'public/images/products/smart-glass-door-lock-gl300.png'
  },
  {
    url: 'https://media.esslsecurity.com/media/locksandbuttons/NO-touch.png',
    dest: 'public/images/products/exit-button-no-touch-switch.png'
  },
  {
    url: 'https://media.esslsecurity.com/media/Turnstiles/et-1000/ET1000.png',
    dest: 'public/images/products/essl-ts1000-pro-turnstile.png'
  },
  {
    url: 'https://media.esslsecurity.com/media/Turnstiles/ET-1219.png',
    dest: 'public/images/products/essl-fbl4000-flap-barrier.png'
  },
  {
    url: 'https://media.esslsecurity.com/media/boombarrieranduhf/bg-100-grey/BG-100-Grey.png',
    dest: 'public/images/products/essl-bg1000-boom-barrier.png'
  },
  {
    url: 'https://media.esslsecurity.com/media/metaldetector/D270.jpg',
    dest: 'public/images/products/essl-d1065s-walk-through-metal-detector.jpg'
  },
  {
    url: 'https://media.esslsecurity.com/media/metaldetector/HM-300.png',
    dest: 'public/images/products/biomax-md-300-metal-detector.png'
  }
];

async function downloadFile(item) {
  try {
    const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      console.error(`[FAIL] ${item.url} -> ${res.status}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const fullDest = path.join(__dirname, '..', item.dest);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    fs.writeFileSync(fullDest, buffer);
    console.log(`[SUCCESS] Downloaded ${item.dest} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return true;
  } catch (err) {
    console.error(`[ERROR] ${item.url} -> ${err.message}`);
    return false;
  }
}

async function run() {
  console.log('--- DOWNLOADING OFFICIAL PRODUCT IMAGES ---');
  let successCount = 0;
  for (const item of downloads) {
    const ok = await downloadFile(item);
    if (ok) successCount++;
  }
  console.log(`\nCompleted: ${successCount}/${downloads.length} downloaded successfully.`);
}

run();

