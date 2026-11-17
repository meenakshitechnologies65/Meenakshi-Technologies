/**
 * CMS MANAGEMENT v2.0 - DYNAMIC PRODUCT CATALOGUE & DATASHEET PDF GENERATOR
 * Generates branded, high-resolution, print-ready PDF documents using PDFKit.
 * Supports: Individual Product Datasheets, Manufacturer Catalogues, Category Catalogues.
 */

const PDFDocument = require('pdfkit');
const path = require('node:path');
const fs = require('node:fs');

/**
 * Generate Individual Product Datasheet PDF Stream
 */
function generateProductDatasheetPdf(product, res) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const filename = `${product.slug || 'product'}-datasheet.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  doc.pipe(res);

  const primaryBlue = '#0284c7';
  const darkNavy = '#0b2545';
  const slateMuted = '#64748b';

  // --- HEADER WITH BRANDING ---
  doc.rect(40, 40, doc.page.width - 80, 75).fill('#f8fafc');
  doc.rect(40, 40, 6, 75).fill(primaryBlue);

  // Logo if available
  const logoPath = path.join(__dirname, '..', '..', 'public', 'images', 'logo.png');
  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, 55, 48, { width: 45, height: 45 });
    } catch (e) {}
  }

  doc.fillColor(darkNavy).fontSize(16).font('Helvetica-Bold').text('MEENAKSHI TECHNOLOGIES', 110, 48);
  doc.fillColor(slateMuted).fontSize(8.5).font('Helvetica').text('Biometric Attendance & Access Control Solutions | Hyderabad, Telangana', 110, 68);
  doc.fillColor(primaryBlue).fontSize(8).font('Helvetica-Bold').text('Direct Helpline: +91 6301593064 | Email: info@meenakshitechnologies.in', 110, 82);

  // --- PRODUCT HEADER ---
  doc.moveDown(3);
  doc.fillColor(primaryBlue).fontSize(9).font('Helvetica-Bold').text(`${(product.brand || 'GENUINE HARDWARE').toUpperCase()} • OFFICIAL TECHNICAL DATASHEET`, 40, 130);
  doc.fillColor(darkNavy).fontSize(20).font('Helvetica-Bold').text(product.name || 'Biometric Product', 40, 145);
  doc.fillColor(slateMuted).fontSize(10).font('Helvetica').text(product.shortDesc || product.tagline || 'Verified specifications and technical operational parameters.', 40, 172, { width: doc.page.width - 80 });

  // --- KEY METRICS BANNER ---
  let yPos = 205;
  doc.rect(40, yPos, doc.page.width - 80, 40).fill('#f1f5f9');
  
  const specs = product.specifications || product.specs || {};
  const cap = product.capacity || {};
  const primaryCap = cap.fingerprints || cap.faces || cap.holdingForce || specs.fingerprintCapacity || specs.faceCapacity || 'Commercial Grade';
  const transactions = cap.transactions || specs.logCapacity || '100,000 Logs';
  const comms = specs.communication || specs.connectivity || 'TCP/IP, USB';

  doc.fillColor(darkNavy).fontSize(8.5).font('Helvetica-Bold').text('User Capacity:', 50, yPos + 10);
  doc.fillColor(primaryBlue).fontSize(9).font('Helvetica-Bold').text(String(primaryCap), 50, yPos + 22);

  doc.fillColor(darkNavy).fontSize(8.5).font('Helvetica-Bold').text('Transaction Memory:', 220, yPos + 10);
  doc.fillColor(primaryBlue).fontSize(9).font('Helvetica-Bold').text(String(transactions), 220, yPos + 22);

  doc.fillColor(darkNavy).fontSize(8.5).font('Helvetica-Bold').text('Communication:', 400, yPos + 10);
  doc.fillColor(primaryBlue).fontSize(9).font('Helvetica-Bold').text(String(comms), 400, yPos + 22);

  // --- SPECIFICATIONS TABLE ---
  yPos = 265;
  doc.fillColor(darkNavy).fontSize(12).font('Helvetica-Bold').text('Verified Technical Specifications', 40, yPos);
  yPos += 20;

  doc.rect(40, yPos, doc.page.width - 80, 20).fill(darkNavy);
  doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold').text('Parameter', 50, yPos + 5);
  doc.text('Specification Detail', 240, yPos + 5);
  yPos += 20;

  const specRows = [
    ['Manufacturer / Brand', product.brand || 'eSSL'],
    ['Model Number', product.model || product.name],
    ['Category', product.category || 'Biometric Security'],
    ['Primary Technology', specs.biometricTechnology || specs.sensorType || 'Optical Biometrics'],
    ['Verification Speed', specs.verificationSpeed || '< 0.8 Seconds'],
    ['Operating Voltage', specs.powerSupply || specs.operatingVoltage || '12V DC 2A'],
    ['Display Screen', specs.display || '2.8" Color Screen'],
    ['Battery Backup', specs.batteryBackup || 'Optional External UPS / Built-in'],
    ['Access Control Relay', specs.accessControlInterface || specs.relayOutput || 'Built-in NO/NC Contacts'],
    ['Warranty', '1 Year Comprehensive Manufacturer Warranty']
  ];

  specRows.forEach((row, idx) => {
    const bgColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    doc.rect(40, yPos, doc.page.width - 80, 20).fill(bgColor);
    doc.fillColor(darkNavy).fontSize(8.5).font('Helvetica-Bold').text(row[0], 50, yPos + 5);
    doc.fillColor(slateMuted).fontSize(8.5).font('Helvetica').text(String(row[1]), 240, yPos + 5);
    yPos += 20;
  });

  // --- FEATURES & APPLICATIONS ---
  yPos += 15;
  doc.fillColor(darkNavy).fontSize(12).font('Helvetica-Bold').text('Key Features & Commercial Applications', 40, yPos);
  yPos += 20;

  const features = product.features || [
    'Fast biometric verification with optical anti-spoofing algorithm',
    'Standalone non-volatile flash memory logging without continuous PC connectivity',
    'Built-in electric relay output for 600lbs electromagnetic door access locks',
    'Automatic attendance sync with multi-shift Indian payroll and muster rolls'
  ];

  features.slice(0, 4).forEach((feat) => {
    doc.fillColor(primaryBlue).fontSize(10).text('•', 45, yPos);
    doc.fillColor(darkNavy).fontSize(8.5).font('Helvetica').text(feat, 60, yPos, { width: doc.page.width - 100 });
    yPos += 18;
  });

  // --- FOOTER & CONTACT CALLOUT ---
  const footerY = doc.page.height - 85;
  doc.rect(40, footerY, doc.page.width - 80, 50).fill('#eef4f8');
  doc.fillColor(darkNavy).fontSize(9).font('Helvetica-Bold').text('HYDERABAD SALES & ONSITE INSTALLATION', 50, footerY + 8);
  doc.fillColor(slateMuted).fontSize(7.5).font('Helvetica').text('Gowlipura Central Office: Near Gandhi Statue, 18-7-751, Outside Gowlipura, Hyderabad 500053', 50, footerY + 22);
  doc.text('Balapur Branch: Balapur Main Road, Near DRDL / Kanchanbagh Sector, Hyderabad 500005', 50, footerY + 34);

  doc.fillColor(primaryBlue).fontSize(10).font('Helvetica-Bold').text('CALL: +91 6301593064', doc.page.width - 200, footerY + 18, { align: 'right' });

  doc.end();
}

/**
 * Generate Multi-Product Catalogue PDF
 */
function generateCatalogPdf({ title = 'Complete Product Catalogue 2026', brand = null, category = null, products = [] }, res) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const filename = `${(brand || category || 'meenakshi-catalogue').toLowerCase().replace(/[^a-z0-9]/g, '-')}-2026.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  doc.pipe(res);

  const primaryBlue = '#0284c7';
  const darkNavy = '#0b2545';
  const slateMuted = '#64748b';

  // --- COVER BANNER ---
  doc.rect(40, 40, doc.page.width - 80, 110).fill(darkNavy);
  doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text('MEENAKSHI TECHNOLOGIES', 60, 60);
  doc.fillColor('#38bdf8').fontSize(12).font('Helvetica-Bold').text(title.toUpperCase(), 60, 90);
  doc.fillColor('#cbd5e1').fontSize(8.5).font('Helvetica').text('Official Verified Specifications • Hyderabad Sales, Installation & Warranty • 2026 Edition', 60, 115);

  let yPos = 170;

  // Filter products
  let list = products;
  if (brand) {
    list = list.filter(p => (p.brand || '').toLowerCase().includes(brand.toLowerCase()));
  }
  if (category) {
    list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  }

  doc.fillColor(darkNavy).fontSize(12).font('Helvetica-Bold').text(`Verified Hardware Models (${list.length} Products)`, 40, yPos);
  yPos += 20;

  list.forEach((p, idx) => {
    // Check if new page needed
    if (yPos > doc.page.height - 120) {
      doc.addPage();
      yPos = 50;
    }

    doc.rect(40, yPos, doc.page.width - 80, 60).fill(idx % 2 === 0 ? '#f8fafc' : '#ffffff');
    doc.rect(40, yPos, 4, 60).fill(primaryBlue);

    doc.fillColor(darkNavy).fontSize(11).font('Helvetica-Bold').text(p.name, 52, yPos + 8);
    doc.fillColor(primaryBlue).fontSize(8).font('Helvetica-Bold').text(`${p.brand} | ${p.category}`, 52, yPos + 22);

    const cap = p.capacity || {};
    const specs = p.specifications || p.specs || {};
    const capText = cap.fingerprints || cap.faces || cap.holdingForce || specs.fingerprintCapacity || 'Commercial Grade';
    doc.fillColor(slateMuted).fontSize(8).font('Helvetica').text(`Capacity: ${capText} | Logs: ${cap.transactions || specs.logCapacity || '100k'} | Connectivity: ${specs.communication || specs.connectivity || 'TCP/IP, USB'}`, 52, yPos + 34);

    doc.fillColor(darkNavy).fontSize(8).font('Helvetica-Bold').text(`Datasheet: https://meenakshitechnologies.org/products/${p.slug}`, 52, yPos + 46);

    yPos += 68;
  });

  // Footer
  const footerY = doc.page.height - 50;
  doc.rect(40, footerY, doc.page.width - 80, 30).fill('#f1f5f9');
  doc.fillColor(slateMuted).fontSize(7.5).font('Helvetica').text('Meenakshi Technologies Hyderabad • Phone: +91 6301593064 • Email: info@meenakshitechnologies.in • https://meenakshitechnologies.org/', 50, footerY + 10);

  doc.end();
}

module.exports = {
  generateProductDatasheetPdf,
  generateCatalogPdf
};

