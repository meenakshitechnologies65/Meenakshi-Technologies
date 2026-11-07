const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const updates = {
  'essl-k90-pro': {
    image: '/images/products/essl-k90-pro.png',
    cataloguePdf: '/catalogues/essl-k90-pro-catalogue.pdf'
  },
  'essl-k30-pro': {
    image: '/images/products/essl-k30-pro.png',
    cataloguePdf: '/catalogues/essl-k30-pro-catalogue.pdf'
  },
  'essl-silkbio-100tc': {
    image: '/images/products/essl-silkbio-100tc.png',
    cataloguePdf: '/catalogues/essl-silkbio-100tc-catalogue.pdf'
  },
  'essl-uface-202': {
    image: '/images/products/essl-uface-202.png',
    cataloguePdf: '/catalogues/essl-uface-202-catalogue.pdf'
  },
  'essl-f22': {
    image: '/images/products/essl-f22.png',
    cataloguePdf: '/catalogues/essl-f22-catalogue.pdf'
  },
  'essl-identix-k21': {
    image: '/images/products/essl-identix-k21.png',
    cataloguePdf: '/catalogues/essl-identix-k21-catalogue.pdf'
  },
  'biomax-speedface-5': {
    image: '/images/products/biomax-speedface-5.png',
    cataloguePdf: '/catalogues/biomax-speedface-5-catalogue.pdf'
  },
  'biomax-bio-finger-100': {
    image: '/images/products/biomax-bio-finger-100.png',
    cataloguePdf: '/catalogues/biomax-bio-finger-100-catalogue.pdf'
  },
  'biomax-n-bm60': {
    image: '/images/products/biomax-n-bm60.png',
    cataloguePdf: '/catalogues/biomax-n-bm60-catalogue.pdf'
  },
  'electromagnetic-lock-600lbs': {
    image: '/images/products/electromagnetic-lock-600lbs.jpg',
    cataloguePdf: '/catalogues/electromagnetic-lock-600lbs-catalogue.pdf'
  },
  'drop-bolt-lock': {
    image: '/images/products/drop-bolt-lock.png',
    cataloguePdf: '/catalogues/drop-bolt-lock-catalogue.pdf'
  },
  'essl-inbio-260': {
    image: '/images/products/essl-inbio-260.png',
    cataloguePdf: '/catalogues/essl-inbio-260-catalogue.pdf'
  },
  'rfid-smart-cards-tags': {
    image: '/images/products/rfid-smart-cards-tags.png',
    cataloguePdf: '/catalogues/rfid-smart-cards-tags-catalogue.pdf'
  }
};

products.forEach(p => {
  if (updates[p.id]) {
    p.image = updates[p.id].image;
    p.cataloguePdf = updates[p.id].cataloguePdf;
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log('Successfully updated data/products.json with official images & PDF catalogues!');
