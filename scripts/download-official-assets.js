const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const items = [
  {
    id: 'essl-k90-pro',
    imageExt: 'png',
    imageUrl: 'https://media.esslsecurity.com/media/fingerprint/K90.png',
    pdfUrl: 'https://media.esslsecurity.com/media/fingerprint/K90-Pro.pdf'
  },
  {
    id: 'essl-k30-pro',
    imageExt: 'png',
    imageUrl: 'https://media.esslsecurity.com/media/fingerprint/K30.png',
    pdfUrl: 'https://media.esslsecurity.com/media/fingerprint/K30-Pro.pdf'
  },
  {
    id: 'essl-silkbio-100tc',
    imageExt: 'png',
    imageUrl: 'https://media.esslsecurity.com/media/face/silkbio101tc/silkbio101tc.png',
    pdfUrl: 'https://media.esslsecurity.com/media/face/catalogue/SilkBio-101TC.pdf'
  },
  {
    id: 'essl-uface-202',
    imageExt: 'png',
    imageUrl: 'https://media.esslsecurity.com/media/face/uface302/uFace-302.png',
    pdfUrl: 'https://media.esslsecurity.com/media/face/catalogue/uface-302.pdf'
  },
  {
    id: 'essl-f22',
    imageExt: 'png',
    imageUrl: 'https://media.esslsecurity.com/media/fingerprint/f22/F22.png',
    pdfUrl: 'https://media.esslsecurity.com/media/fingerprint/Catalogue/F22.pdf'
  },
  {
    id: 'essl-identix-k21',
    imageExt: 'png',
    imageUrl: 'https://media.esslsecurity.com/media/fingerprint/k21.png',
    pdfUrl: 'https://media.esslsecurity.com/media/fingerprint/K30-Pro.pdf'
  },
  {
    id: 'biomax-speedface-5',
    imageExt: 'png',
    imageUrl: 'https://www.biomaxsecurity.com/storage/app/media/AI-Series/SpeedFace5se/SF_5SE.png',
    pdfUrl: 'https://www.biomaxsecurity.com/storage/app/media/catalogue/SpeedFace5.pdf'
  },
  {
    id: 'biomax-bio-finger-100',
    imageExt: 'png',
    imageUrl: 'https://www.biomaxsecurity.com/storage/app/media/device/n-bm30w/N-BM30front.png',
    pdfUrl: 'https://www.biomaxsecurity.com/storage/app/media/catalogue/N-BM30WPro_.pdf'
  },
  {
    id: 'biomax-n-bm60',
    imageExt: 'png',
    imageUrl: 'https://www.biomaxsecurity.com/storage/app/media/device/N-BM60Wpro/N-BM60W.png',
    pdfUrl: 'https://www.biomaxsecurity.com/storage/app/media/catalogue/N-BM60W%20Pro%201200%20face.pdf'
  },
  {
    id: 'electromagnetic-lock-600lbs',
    imageExt: 'jpg',
    imageUrl: 'https://media.esslsecurity.com/media/locksandbuttons/single_Door_EML_Lock.jpg',
    pdfUrl: 'https://media.esslsecurity.com/media/locksandbuttons/eml600-8-5-New.pdf'
  },
  {
    id: 'drop-bolt-lock',
    imageExt: 'png',
    imageUrl: 'https://media.esslsecurity.com/media/locksandbuttons/BL-5.png',
    pdfUrl: 'https://media.esslsecurity.com/media/locksandbuttons/BL-5.pdf'
  },
  {
    id: 'essl-inbio-260',
    imageExt: 'png',
    imageUrl: 'https://media.esslsecurity.com/media/doorcontroller/inBio-260.png',
    pdfUrl: 'https://media.esslsecurity.com/media/doorcontroller/Catalouge/inBio%20260.pdf'
  },
  {
    id: 'rfid-smart-cards-tags',
    imageExt: 'png',
    imageUrl: 'https://media.esslsecurity.com/media/RFIDCardsandTags/UHF1-Tag1.png',
    pdfUrl: 'https://media.esslsecurity.com/media/RFIDCardsandTags/UHF1-Tag1.pdf'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return downloadFile(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(dest);
      });
      fileStream.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function main() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');
  const cataloguesDir = path.join(__dirname, '..', 'public', 'catalogues');

  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
  if (!fs.existsSync(cataloguesDir)) fs.mkdirSync(cataloguesDir, { recursive: true });

  console.log(`Starting asset download for ${items.length} products...`);

  for (const item of items) {
    const imageDest = path.join(imagesDir, `${item.id}.${item.imageExt}`);
    const pdfDest = path.join(cataloguesDir, `${item.id}-catalogue.pdf`);

    // Download image
    try {
      console.log(`Downloading image for ${item.id} from ${item.imageUrl}...`);
      await downloadFile(item.imageUrl, imageDest);
      const stats = fs.statSync(imageDest);
      console.log(`  [OK] Image saved: ${item.id}.${item.imageExt} (${Math.round(stats.size / 1024)} KB)`);
    } catch (e) {
      console.error(`  [FAIL] Image error for ${item.id}:`, e.message);
    }

    // Download PDF
    try {
      console.log(`Downloading PDF for ${item.id} from ${item.pdfUrl}...`);
      await downloadFile(item.pdfUrl, pdfDest);
      const stats = fs.statSync(pdfDest);
      console.log(`  [OK] PDF saved: ${item.id}-catalogue.pdf (${Math.round(stats.size / 1024)} KB)`);
    } catch (e) {
      console.error(`  [FAIL] PDF error for ${item.id}:`, e.message);
    }
  }

  console.log('All downloads completed!');
}

main();

