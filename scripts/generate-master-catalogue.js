const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const products = require('../data/products.json');

const outputPath = path.join(__dirname, '..', 'public', 'catalogues', 'meenakshi-technologies-product-catalogue-2026.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  bufferPages: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const NAVY = '#031926';
const BLUE = '#0066cc';
const CYAN = '#00b4d8';
const DARK_GRAY = '#1f2937';
const LIGHT_BG = '#f8fafc';
const BORDER_COLOR = '#e2e8f0';

// -------------------------------------------------------------
// COVER PAGE
// -------------------------------------------------------------
doc.rect(0, 0, 595.28, 841.89).fill(NAVY);

// Decorative gradient / accents
doc.rect(0, 810, 595.28, 32).fill(BLUE);
doc.rect(0, 800, 595.28, 10).fill(CYAN);

// Logo if available
const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');
if (fs.existsSync(logoPath)) {
  try {
    doc.image(logoPath, 45, 60, { width: 180 });
  } catch (e) {}
}

doc.fontSize(12).fillColor('#94a3b8').text('MEENAKSHI TECHNOLOGIES • HYDERABAD & BALAPUR', 45, 180, { characterSpacing: 1.5 });

doc.fontSize(32).font('Helvetica-Bold').fillColor('#ffffff').text('PRODUCT CATALOGUE', 45, 205);
doc.fontSize(32).font('Helvetica-Bold').fillColor(CYAN).text('2026 EDITION', 45, 245);

doc.fontSize(14).font('Helvetica').fillColor('#cbd5e1').text(
  'Comprehensive Hardware & Engineering Solutions for Biometric Attendance, Touchless AI Face Terminals, Electromagnetic Door Access Control, and Enterprise Payroll Integration.',
  45, 295, { width: 505, lineGap: 5 }
);

// Key Highlights Boxes
const boxY = 400;
const boxWidth = 240;
const boxHeight = 85;

// Box 1
doc.roundedRect(45, boxY, boxWidth, boxHeight, 8).fill('#0b2545');
doc.fontSize(11).font('Helvetica-Bold').fillColor(CYAN).text('OFFICIAL SOLUTIONS PARTNER', 60, boxY + 15);
doc.fontSize(10).font('Helvetica').fillColor('#ffffff').text('Authorized System Integrator for:\n• eSSL Security India\n• BioMax Security Systems', 60, boxY + 34, { lineGap: 3 });

// Box 2
doc.roundedRect(310, boxY, boxWidth, boxHeight, 8).fill('#0b2545');
doc.fontSize(11).font('Helvetica-Bold').fillColor(CYAN).text('GUARANTEED SERVICE SLA', 325, boxY + 15);
doc.fontSize(10).font('Helvetica').fillColor('#ffffff').text('• 1-Year Comprehensive Warranty\n• 4-Hour On-Site Support Response\n• Free Lifetime Software Demo & Setup', 325, boxY + 34, { lineGap: 3 });

// Founder / Verification Box
const fBoxY = 510;
doc.roundedRect(45, fBoxY, 505, 110, 8).fill('#071f33');
doc.rect(45, fBoxY, 5, 110).fill(CYAN);

doc.fontSize(12).font('Helvetica-Bold').fillColor('#ffffff').text('About Meenakshi Technologies', 65, fBoxY + 16);
doc.fontSize(10).font('Helvetica').fillColor('#94a3b8').text(
  'Founded by Tingirikar Teja, Meenakshi Technologies is Hyderabad’s premier biometric engineering and security automation company. Having deployed hundreds of biometric terminals and automated access controllers across hospitals, IT parks, pharmaceutical plants, gyms, and educational institutes, we deliver tailored security hardware engineered for Indian operating conditions.',
  65, fBoxY + 35, { width: 465, lineGap: 3 }
);

// Contact Footer on Cover
doc.fontSize(11).font('Helvetica-Bold').fillColor(CYAN).text('CONNECT WITH OUR ENGINEERING DESK', 45, 680);
doc.fontSize(10).font('Helvetica').fillColor('#ffffff').text('Call / WhatsApp: +91 6301593064  |  Email: meenakshitechnologies65@gmail.com', 45, 700);
doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text('Office 1: Hyderabad Central Office, Lat 17.3459, Lng 78.4798\nOffice 2: Balapur Business Location, Lat 17.3095, Lng 78.5152\nOfficial Web: http://localhost:3000', 45, 720, { lineGap: 2 });


// -------------------------------------------------------------
// PRODUCT PAGES
// -------------------------------------------------------------
products.forEach((prod) => {
  doc.addPage();

  // Top header banner
  doc.rect(0, 0, 595.28, 55).fill(NAVY);
  doc.fontSize(9).font('Helvetica-Bold').fillColor(CYAN).text('MEENAKSHI TECHNOLOGIES • 2026 OFFICIAL PRODUCT CATALOGUE', 45, 22);
  doc.fontSize(9).font('Helvetica').fillColor('#cbd5e1').text('+91 6301593064', 500, 22, { align: 'right' });

  // Product Title & Brand
  doc.fontSize(18).font('Helvetica-Bold').fillColor(NAVY).text(prod.name, 45, 75);
  doc.fontSize(10).font('Helvetica-Bold').fillColor(BLUE).text(`${prod.brand.toUpperCase()} | ${prod.category.toUpperCase()}`, 45, 98);
  doc.fontSize(10).font('Helvetica-Oblique').fillColor('#4b5563').text(prod.tagline, 45, 114, { width: 505 });

  // Divider line
  doc.rect(45, 135, 505, 1.5).fill(BORDER_COLOR);

  // Left Column: Product Image & Capacity Card
  const leftX = 45;
  const colWidth = 210;

  // Image Box
  doc.roundedRect(leftX, 150, colWidth, 190, 8).fill(LIGHT_BG).stroke(BORDER_COLOR);
  
  // Try loading genuine downloaded product image
  let imgLoaded = false;
  const extensions = ['png', 'jpg', 'jpeg'];
  for (const ext of extensions) {
    const candidatePath = path.join(__dirname, '..', 'public', 'images', 'products', `${prod.id}.${ext}`);
    if (fs.existsSync(candidatePath)) {
      try {
        doc.image(candidatePath, leftX + 15, 160, { fit: [180, 170], align: 'center', valign: 'center' });
        imgLoaded = true;
        break;
      } catch (err) {}
    }
  }

  // Capacity / Key Indicators Card below Image
  doc.roundedRect(leftX, 355, colWidth, 110, 8).fill('#0b2545');
  doc.fontSize(10).font('Helvetica-Bold').fillColor(CYAN).text('SYSTEM CAPACITY', leftX + 15, 368);
  
  let capY = 388;
  if (prod.capacity) {
    Object.entries(prod.capacity).forEach(([k, v]) => {
      const label = k.charAt(0).toUpperCase() + k.slice(1);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#ffffff').text(`• ${label}: `, leftX + 15, capY, { continued: true });
      doc.font('Helvetica').fillColor('#cbd5e1').text(v);
      capY += 15;
    });
  }

  // Right Column: Technical Specifications & Features
  const rightX = 275;
  const rightWidth = 275;

  doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('TECHNICAL SPECIFICATIONS', rightX, 150);

  // Spec Table
  let specY = 170;
  if (prod.specs) {
    Object.entries(prod.specs).forEach(([key, val], idx) => {
      const bg = idx % 2 === 0 ? '#f1f5f9' : '#ffffff';
      doc.rect(rightX, specY - 3, rightWidth, 20).fill(bg);
      
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#334155').text(label, rightX + 6, specY + 2, { width: 110 });
      doc.font('Helvetica').fillColor('#0f172a').text(String(val), rightX + 120, specY + 2, { width: 150 });
      specY += 21;
    });
  }

  // Key Features
  const featY = Math.max(specY + 15, 410);
  doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('KEY OPERATIONAL FEATURES', rightX, featY);
  
  let curFeatY = featY + 18;
  if (prod.features && Array.isArray(prod.features)) {
    prod.features.slice(0, 5).forEach(f => {
      doc.fontSize(8.5).font('Helvetica').fillColor('#334155').text(`✔  ${f}`, rightX, curFeatY, { width: rightWidth, lineGap: 2 });
      curFeatY += 22;
    });
  }

  // Application Areas & Installation Info Banner
  const bannerY = 620;
  doc.roundedRect(45, bannerY, 505, 115, 8).fill('#f8fafc').stroke(BORDER_COLOR);
  doc.rect(45, bannerY, 5, 115).fill(BLUE);

  doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('TARGET APPLICATIONS', 60, bannerY + 12);
  const appText = prod.applications ? prod.applications.join(' • ') : 'Corporate Offices, Factories, Hospitals, Retail Stores';
  doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text(appText, 60, bannerY + 28, { width: 475 });

  doc.fontSize(10).font('Helvetica-Bold').fillColor(NAVY).text('INSTALLATION & WIRING ENGINEERING', 60, bannerY + 58);
  const installText = prod.installationInfo || 'Wall-mounted bracket, 12V 5A regulated power supply, standard CAT6 network cable or standalone USB sync.';
  doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text(installText, 60, bannerY + 74, { width: 475, lineGap: 2 });

  // Bottom CTA Bar
  const footY = 755;
  doc.roundedRect(45, footY, 505, 45, 6).fill(NAVY);
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#ffffff').text(`Ready to install ${prod.name} at your facility?`, 60, footY + 15);
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(CYAN).text('Call / WhatsApp: +91 6301593064  |  Free Site Survey', 300, footY + 15, { align: 'right' });

  // Page Footer
  doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text('Meenakshi Technologies Hyderabad • Official Dealer & Integrator • meenakshitechnologies65@gmail.com', 45, 815);
});

// Finalize document
doc.end();

writeStream.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`[OK] Master Catalogue PDF generated successfully at ${outputPath} (${Math.round(stats.size / 1024)} KB)`);
});
