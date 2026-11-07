const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return fetchPage(redirectUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function checkDropBolt() {
  const page = await fetchPage('https://www.esslsecurity.com/locksandbuttons/bl-5');
  const media = (page.data.match(/(https?:\/\/[^\s"'>]+?\.(?:png|jpg|jpeg|webp|pdf))/gi) || []);
  console.log('Drop bolt media:', [...new Set(media)]);

  const rfid = await fetchPage('https://www.esslsecurity.com/rfidcardsandtags/uhf1-tag1');
  const rfidMedia = (rfid.data.match(/(https?:\/\/[^\s"'>]+?\.(?:png|jpg|jpeg|webp|pdf))/gi) || []);
  console.log('RFID media:', [...new Set(rfidMedia)]);
}

checkDropBolt();
