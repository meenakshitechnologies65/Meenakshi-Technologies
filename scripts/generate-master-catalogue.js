const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const products = require('../data/products.json');

const outputPath = path.join(__dirname, '..', 'public', 'catalogues', 'meenakshi-technologies-product-catalogue-2026.pdf');

// Create PDF with standard A4 margins
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 35, bottom: 35, left: 35, right: 35 },
  bufferPages: true,
  autoFirstPage: false
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Corporate Color Palette
const NAVY = '#031926';
const BLUE = '#0066cc';
const CYAN = '#00b4d8';
const DARK_GRAY = '#1f2937';
const LIGHT_BG = '#f8fafc';
const BORDER_COLOR = '#cbd5e1';
const GOLD = '#f59e0b';
const SUCCESS = '#10b981';

// Helper: Standard A4 Header & Footer
function drawPageHeader(title, category = 'OFFICIAL PRODUCT BROCHURE 2026') {
  doc.rect(0, 0, 595.28, 52).fill(NAVY);
  
  // Meenakshi Tech Logo mini in header
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');
  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, 35, 12, { height: 28 });
    } catch (e) {}
  }

  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(CYAN).text('MEENAKSHI TECHNOLOGIES', 95, 14);
  doc.fontSize(7.5).font('Helvetica').fillColor('#94a3b8').text(category.toUpperCase(), 95, 27);

  doc.fontSize(8).font('Helvetica').fillColor('#ffffff').text('Call / WhatsApp: +91 6301593064', 350, 16, { align: 'right', width: 210 });
  doc.fontSize(7.5).font('Helvetica').fillColor(CYAN).text('meenakshitechnologies65@gmail.com', 350, 28, { align: 'right', width: 210 });

  // Accent Line
  doc.rect(0, 50, 595.28, 2.5).fill(CYAN);
}

function drawPageFooter(pageNum, totalPages = '12') {
  const y = 812;
  doc.rect(0, 804, 595.28, 38).fill('#f1f5f9');
  doc.rect(0, 804, 595.28, 1).fill(BORDER_COLOR);

  doc.fontSize(7.5).font('Helvetica').fillColor('#64748b').text(
    'Meenakshi Technologies • Hyderabad Central Office & Balapur Branch • Official Dealer: eSSL Security & BioMax Security',
    35, y, { width: 440 }
  );

  doc.fontSize(8).font('Helvetica-Bold').fillColor(NAVY).text(
    `Page ${pageNum}`,
    480, y, { align: 'right', width: 80 }
  );
}

// ============================================================================
// PAGE 1: EXECUTIVE COVER PAGE
// ============================================================================
doc.addPage();
doc.rect(0, 0, 595.28, 841.89).fill(NAVY);

// Diagonal / geometric tech accent
doc.save();
doc.rect(0, 795, 595.28, 47).fill(BLUE);
doc.rect(0, 785, 595.28, 10).fill(CYAN);
doc.restore();

// Official Logo
const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');
if (fs.existsSync(logoPath)) {
  try {
    doc.image(logoPath, 45, 55, { width: 190 });
  } catch (e) {}
}

doc.fontSize(11).font('Helvetica-Bold').fillColor(CYAN).text('AUTHORISED DEALER & SOLUTIONS PARTNER', 45, 175, { characterSpacing: 1.2 });
doc.fontSize(30).font('Helvetica-Bold').fillColor('#ffffff').text('CORPORATE BROCHURE', 45, 195);
doc.fontSize(28).font('Helvetica-Bold').fillColor(CYAN).text('& PRODUCT CATALOGUE 2026', 45, 230);

doc.fontSize(11.5).font('Helvetica').fillColor('#cbd5e1').text(
  'A Complete Guide to Enterprise Biometric Attendance, Touchless Face Recognition Terminals, Electromagnetic Door Access Control, and Automated Cloud Payroll Integration.',
  45, 275, { width: 505, lineGap: 4 }
);

// Founder Showcase Card
const founderY = 345;
doc.roundedRect(45, founderY, 505, 125, 8).fill('#0b2545');
doc.rect(45, founderY, 5, 125).fill(CYAN);

// Founder Image
const tejaPath = path.join(__dirname, '..', 'public', 'images', 'tingirikar-teja.jpg');
if (fs.existsSync(tejaPath)) {
  try {
    doc.save();
    doc.roundedRect(60, founderY + 12, 90, 100, 6).clip();
    doc.image(tejaPath, 60, founderY + 12, { width: 90, height: 100, fit: [90, 100], align: 'center', valign: 'center' });
    doc.restore();
  } catch (e) {}
}

doc.fontSize(13).font('Helvetica-Bold').fillColor('#ffffff').text('Tingirikar Teja', 165, founderY + 18);
doc.fontSize(9).font('Helvetica-Bold').fillColor(CYAN).text('FOUNDER & PRINCIPAL BIOMETRIC ENGINEER', 165, founderY + 34);
doc.fontSize(8.5).font('Helvetica').fillColor('#cbd5e1').text(
  '“At Meenakshi Technologies, our mission is simple: provide 100% genuine biometric hardware, flawless door access engineering, and unmatched on-site support across Hyderabad. Every installation is calibrated to Indian workplace environments with guaranteed same-day SLA.”',
  165, founderY + 52, { width: 370, lineGap: 3 }
);

// 3 Key Pillars
const pillarY = 490;
const pWidth = 160;
const pHeight = 90;

// Pillar 1: Hardware
doc.roundedRect(45, pillarY, pWidth, pHeight, 6).fill('#071f33');
doc.fontSize(10).font('Helvetica-Bold').fillColor(CYAN).text('GENUINE OEM HARDWARE', 55, pillarY + 12);
doc.fontSize(8).font('Helvetica').fillColor('#ffffff').text('• eSSL Security Direct Stock\n• BioMax AI Face Series\n• High-Tensile 600 lbs EM Locks\n• Factory Seal & Serial Tracking', 55, pillarY + 28, { lineGap: 2.5 });

// Pillar 2: SLA
doc.roundedRect(217, pillarY, pWidth, pHeight, 6).fill('#071f33');
doc.fontSize(10).font('Helvetica-Bold').fillColor(CYAN).text('4-HOUR ONSITE SLA', 227, pillarY + 12);
doc.fontSize(8).font('Helvetica').fillColor('#ffffff').text('• Same-day site deployment\n• 4-Hour emergency breakdown\n• Clean cabling & glass fittings\n• 1-Year Comprehensive Warranty', 227, pillarY + 28, { lineGap: 2.5 });

// Pillar 3: Software
doc.roundedRect(390, pillarY, pWidth, pHeight, 6).fill('#071f33');
doc.fontSize(10).font('Helvetica-Bold').fillColor(CYAN).text('PAYROLL INTEGRATION', 400, pillarY + 12);
doc.fontSize(8).font('Helvetica').fillColor('#ffffff').text('• eTimeTrackLite / BioMax Pro\n• 1-Click Excel / CSV Export\n• Tally ERP 9 / Tally Prime Sync\n• Free Lifetime Software Setup', 400, pillarY + 28, { lineGap: 2.5 });

// Dual Locations Card on Cover
const locCoverY = 600;
doc.roundedRect(45, locCoverY, 505, 95, 8).fill('#051b2c');
doc.rect(45, locCoverY, 5, 95).fill(BLUE);

doc.fontSize(11).font('Helvetica-Bold').fillColor('#ffffff').text('DUAL VERIFIED HYDERABAD LOCATIONS', 60, locCoverY + 12);

doc.fontSize(8.5).font('Helvetica-Bold').fillColor(CYAN).text('1. Gowlipura Central (HQ):', 60, locCoverY + 30);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text('Near Gandhi Statue, 18-7-751, Outside Gowlipura, Hyderabad 500053  |  GPS: 17.3459° N, 78.4798° E', 60, locCoverY + 42);

doc.fontSize(8.5).font('Helvetica-Bold').fillColor(CYAN).text('2. Balapur Business Branch:', 60, locCoverY + 58);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text('Balapur Main Road, Near DRDL / Kanchanbagh Sector, Balapur, Hyderabad 500005  |  GPS: 17.3095° N, 78.5152° E', 60, locCoverY + 70);

// Cover Footer Helpline
doc.fontSize(11).font('Helvetica-Bold').fillColor(CYAN).text('DIRECT ENGINEERING HELPLINE', 45, 715);
doc.fontSize(10).font('Helvetica').fillColor('#ffffff').text('Call / WhatsApp: +91 6301593064  |  Email: meenakshitechnologies65@gmail.com  |  www.meenakshitechnologies.org', 45, 732);
doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text('Serving: HITEC City • Madhapur • Gachibowli • Bachupally • Boduppal • Kothapet • LB Nagar • Secunderabad', 45, 750);


// ============================================================================
// PAGE 2: CORPORATE PROFILE & DUAL VERIFIED LOCATIONS
// ============================================================================
doc.addPage();
drawPageHeader('Company Profile & Locations', 'Corporate Overview');

let curY = 70;
doc.fontSize(18).font('Helvetica-Bold').fillColor(NAVY).text('Company Profile & Service Infrastructure', 35, curY);
doc.fontSize(9.5).font('Helvetica').fillColor('#4b5563').text(
  'Meenakshi Technologies is Hyderabad’s premier biometric time attendance, door access control engineering, and workforce management technology provider. We engineer turnkey security solutions combining authentic hardware with local on-site support.',
  35, curY + 24, { width: 525, lineGap: 3 }
);

curY += 72;

// Dual Verified Location Detailed Cards
doc.fontSize(13).font('Helvetica-Bold').fillColor(NAVY).text('Our Dual Verified Office Locations in Hyderabad', 35, curY);
curY += 18;

// Location 1 Box
const locBoxWidth = 255;
const locBoxHeight = 160;

doc.roundedRect(35, curY, locBoxWidth, locBoxHeight, 8).fill(LIGHT_BG).stroke(BORDER_COLOR);
doc.rect(35, curY, 4, locBoxHeight).fill(BLUE);

doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('1. Gowlipura Central HQ', 48, curY + 14);
doc.fontSize(8).font('Helvetica-Bold').fillColor(BLUE).text('CENTRAL ADMINISTRATIVE & DISPATCH DESK', 48, curY + 28);

doc.fontSize(8.5).font('Helvetica').fillColor('#334155').text(
  'Address: Near Gandhi Statue, 18-7-751, Outside Gowlipura, Hyderabad, Telangana 500053.\n\n' +
  'Key Focus Areas: HITEC City, Madhapur, Gachibowli, Begumpet, Secunderabad, Dilsukhnagar, Charminar.\n\n' +
  'Coordinates: Lat 17.3459799, Lng 78.479843\n' +
  'Helpline: +91 6301593064\n' +
  'Google Maps: maps.google.com/?q=17.3459799,78.479843',
  48, curY + 44, { width: 232, lineGap: 2 }
);

// Location 2 Box
doc.roundedRect(305, curY, locBoxWidth, locBoxHeight, 8).fill(LIGHT_BG).stroke(BORDER_COLOR);
doc.rect(305, curY, 4, locBoxHeight).fill(CYAN);

doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY).text('2. Balapur Business Branch', 318, curY + 14);
doc.fontSize(8).font('Helvetica-Bold').fillColor(BLUE).text('FIELD ENGINEERING & STOCK DEPOT', 318, curY + 28);

doc.fontSize(8.5).font('Helvetica').fillColor('#334155').text(
  'Address: Balapur Main Road, Near DRDL / Kanchanbagh Sector, Balapur, Hyderabad, Telangana 500005.\n\n' +
  'Key Focus Areas: LB Nagar, Kothapet, Vanasthalipuram, Kanchanbagh, Chandrayangutta, Shamshabad, Adibatla.\n\n' +
  'Coordinates: Lat 17.309578, Lng 78.5152011\n' +
  'Helpline: +91 6301593064\n' +
  'Google Maps: maps.google.com/?q=17.309578,78.5152011',
  318, curY + 44, { width: 232, lineGap: 2 }
);

curY += locBoxHeight + 22;

// Core Service Capabilities Grid
doc.fontSize(13).font('Helvetica-Bold').fillColor(NAVY).text('Turnkey Engineering & Integration Services', 35, curY);
curY += 18;

const caps = [
  { title: 'Biometric Attendance Systems', desc: 'Fingerprint, RFID card, and PIN attendance machines with push data sync and auto shifts.' },
  { title: 'AI Touchless Face Terminals', desc: 'Deep-learning live face detection algorithms effective with masks, spectacles, and low light.' },
  { title: 'Door Access Control Kits', desc: '600 lbs electromagnetic locks, electric drop bolts, push-to-exit buttons, and emergency switches.' },
  { title: 'Multi-Door Controllers', desc: 'eSSL InBio multi-door control panels with Wiegand / OSDP slave readers and TCP/IP networking.' },
  { title: 'Automated Payroll Sync', desc: 'Direct payroll software integration with Tally ERP 9, Tally Prime, Keka, Spine, and Microsoft Excel.' },
  { title: 'Annual Maintenance (AMC)', desc: 'Preventive maintenance, backup battery health checks, database backups, and emergency repairs.' }
];

const capWidth = 170;
const capHeight = 85;

caps.forEach((c, idx) => {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const cx = 35 + col * (capWidth + 8);
  const cy = curY + row * (capHeight + 10);

  doc.roundedRect(cx, cy, capWidth, capHeight, 6).fill('#ffffff').stroke(BORDER_COLOR);
  doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY).text(c.title, cx + 10, cy + 12, { width: capWidth - 20 });
  doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text(c.desc, cx + 10, cy + 32, { width: capWidth - 20, lineGap: 2 });
});

curY += 2 * (capHeight + 10) + 18;

// Guarantee Banner
doc.roundedRect(35, curY, 525, 75, 8).fill('#0b2545');
doc.fontSize(11).font('Helvetica-Bold').fillColor(CYAN).text('OUR 5-POINT QUALITY ASSURANCE', 50, curY + 12);
doc.fontSize(8.5).font('Helvetica').fillColor('#ffffff').text(
  '✔ 100% Brand-New, Sealed eSSL & BioMax Hardware with Serial Number Verification\n' +
  '✔ 1-Year Comprehensive Onsite Hardware Replacement Warranty\n' +
  '✔ Concealed & Aesthetic Cable Dressing (zero exposed or messy wires)\n' +
  '✔ Complimentary Lifetime Attendance Software Training & Remote AnyDesk Support\n' +
  '✔ 4-Hour Onsite Emergency Response Time Across All Hyderabad Business Hubs',
  50, curY + 28, { lineGap: 2.5 }
);

drawPageFooter(2);


// ============================================================================
// PAGE 3: VERIFIED CLIENT ROSTER & CLIENT LOGOS
// ============================================================================
doc.addPage();
drawPageHeader('Our Valued Clients', 'Client Portfolio');

curY = 70;
doc.fontSize(18).font('Helvetica-Bold').fillColor(NAVY).text('Trusted by Leading Businesses Across Hyderabad', 35, curY);
doc.fontSize(9.5).font('Helvetica').fillColor('#4b5563').text(
  'Meenakshi Technologies is the trusted biometric solutions partner for hospitals, IT parks, fitness centers, creative studios, and commercial enterprises. Here are genuine client brand deployments across Telangana.',
  35, curY + 22, { width: 525, lineGap: 3 }
);

curY += 60;

// 8 Client Cards in a clean 2 columns x 4 rows A4 grid
const clientDetails = [
  { img: 'client-1.png', title: 'Shubhakara Hospitals', location: 'Bachupally, Hyderabad', sector: 'Healthcare & Multispecialty Hospital', setup: 'eSSL K90 Fingerprint Time Attendance + Shift Management' },
  { img: 'client-2.png', title: 'Mindspace IT Park Enterprises', location: 'Madhapur, HITEC City', sector: 'Corporate IT & Software Development Hub', setup: 'eSSL K30 Pro + Glass Door EM Lock Access Control' },
  { img: 'client-3.png', title: 'Art Design & Architecture', location: 'Gachibowli, Hyderabad', sector: 'Creative Architecture & Design Studio', setup: 'eSSL X900 + F12 Biometric Slave Reader Access' },
  { img: 'client-4.png', title: 'Develop Tress Software LLP', location: 'Madhapur, Hyderabad', sector: 'Enterprise IT Services & Cloud Engineering', setup: 'eSSL F22 Slim Wi-Fi Biometric Terminal + Push Exit' },
  { img: 'client-5.png', title: 'AYKI Tech Solutions', location: 'Boduppal, Hyderabad', sector: 'Technology Solutions & Engineering Facility', setup: 'eSSL K30 Pro Biometric Attendance & Payroll Sync' },
  { img: 'client-6.png', title: 'The Fit Nation', location: 'Kothapet, Hyderabad', sector: 'Premium Gym & Fitness Chain', setup: 'Biometric Access Control + Turnstile Integration' },
  { img: 'client-7.png', title: 'Fitness & More Gym', location: 'Gachibowli, Hyderabad', sector: 'Health, Wellness & Member Access Facility', setup: 'eSSL Biometric Terminal + Frameless Glass EM Lock' },
  { img: 'client-8.png', title: 'Zinnia Digital Services LLP', location: 'Hyderabad Central Sector', sector: 'Digital Marketing & Corporate BPO Center', setup: 'eSSL X900 Biometric Attendance + Tally Integration' }
];

const cCardW = 255;
const cCardH = 150;

clientDetails.forEach((c, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const cx = 35 + col * (cCardW + 15);
  const cy = curY + row * (cCardH + 12);

  doc.roundedRect(cx, cy, cCardW, cCardH, 8).fill('#ffffff').stroke(BORDER_COLOR);
  
  // Header accent bar inside card
  doc.rect(cx, cy, cCardW, 4).fill(BLUE);

  // Logo box
  const cLogoPath = path.join(__dirname, '..', 'public', 'images', c.img);
  if (fs.existsSync(cLogoPath)) {
    try {
      doc.save();
      doc.rect(cx + 10, cy + 12, 100, 50).fill(LIGHT_BG).stroke('#e2e8f0');
      doc.image(cLogoPath, cx + 15, cy + 16, { fit: [90, 42], align: 'center', valign: 'center' });
      doc.restore();
    } catch (e) {}
  }

  // Client Title & Location
  doc.fontSize(10.5).font('Helvetica-Bold').fillColor(NAVY).text(c.title, cx + 118, cy + 14, { width: 125 });
  doc.fontSize(8).font('Helvetica-Bold').fillColor(BLUE).text(`📍 ${c.location}`, cx + 118, cy + 30, { width: 125 });
  doc.fontSize(7.5).font('Helvetica').fillColor('#64748b').text(c.sector, cx + 118, cy + 44, { width: 125 });

  // Divider
  doc.rect(cx + 10, cy + 72, cCardW - 20, 1).fill('#f1f5f9');

  // Deployed hardware badge
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#334155').text('DEPLOYED SOLUTION & ENGINEERING:', cx + 10, cy + 80);
  doc.fontSize(8).font('Helvetica').fillColor('#0f172a').text(c.setup, cx + 10, cy + 93, { width: cCardW - 20, lineGap: 2 });

  // Verification Badge
  doc.roundedRect(cx + 10, cy + 124, 150, 18, 4).fill('#ecfdf5');
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(SUCCESS).text('✔ Verified Client Deployment', cx + 16, cy + 128);
});

drawPageFooter(3);


// ============================================================================
// PAGE 4: AUTHENTIC CUSTOMER REVIEWS & TESTIMONIALS
// ============================================================================
doc.addPage();
drawPageHeader('Customer Reviews & Ratings', 'Client Testimonials');

curY = 70;
doc.fontSize(18).font('Helvetica-Bold').fillColor(NAVY).text('What Our Clients Say About Us', 35, curY);
doc.fontSize(9.5).font('Helvetica').fillColor('#4b5563').text(
  'Real feedback from real business owners and facility managers in Hyderabad. Every review represents a verified on-site installation completed with precision by Meenakshi Technologies.',
  35, curY + 22, { width: 525, lineGap: 3 }
);

curY += 58;

// Review 1
const rCardH = 210;

const reviews = [
  {
    img: 'review-1.png',
    client: 'Commercial Office Administrator',
    location: 'Madhapur, Hyderabad',
    rating: '5.0 / 5.0 Star Rating',
    hardware: 'eSSL Biometric Attendance Terminal + Shift Software',
    quote: '“Prompt delivery and professional onsite installation of eSSL biometric attendance machine. Highly satisfied with the software configuration and support. Tingirikar Teja personally ensured our complex three-shift timing was configured accurately.”'
  },
  {
    img: 'review-2.png',
    client: 'IT Facility & Operations Manager',
    location: 'HITEC City, Hyderabad',
    rating: '5.0 / 5.0 Star Rating',
    hardware: '600 lbs Heavy Duty EM Lock + Push to Exit Switch',
    quote: '“Excellent door access control setup with electromagnetic locks for our office glass doors. Clean cabling and polite technician. The fail-safe lock releases smoothly and the hydraulic door closer prevents glass banging completely.”'
  },
  {
    img: 'review-3.png',
    client: 'Accounts & HR Lead, Enterprise Firm',
    location: 'Kothapet, Hyderabad',
    rating: '5.0 / 5.0 Star Rating',
    hardware: 'BioMax SpeedFace AI Face Recognition + Tally Integration',
    quote: '“Tingirikar Teja and his team provided genuine Biomax facial recognition hardware. Payroll export works seamlessly with our Tally software. Attendance reports generate in seconds without manual paper registers.”'
  }
];

reviews.forEach((r, idx) => {
  const ry = curY + idx * (rCardH + 14);

  doc.roundedRect(35, ry, 525, rCardH, 8).fill('#ffffff').stroke(BORDER_COLOR);
  doc.rect(35, ry, 5, rCardH).fill(GOLD);

  // Left: Actual Screenshot of the Review
  const revImgPath = path.join(__dirname, '..', 'public', 'images', r.img);
  if (fs.existsSync(revImgPath)) {
    try {
      doc.save();
      doc.roundedRect(50, ry + 15, 180, 180, 6).stroke('#e2e8f0');
      doc.image(revImgPath, 52, ry + 17, { fit: [176, 176], align: 'center', valign: 'center' });
      doc.restore();
    } catch (e) {}
  }

  // Right: Structured Review Metadata & Quote
  const rightX = 245;
  const rightW = 300;

  // Rating Stars
  doc.fontSize(12).font('Helvetica-Bold').fillColor(GOLD).text('★★★★★', rightX, ry + 16);
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(NAVY).text(` ${r.rating}`, rightX + 60, ry + 18);

  doc.fontSize(12).font('Helvetica-Bold').fillColor(NAVY).text(r.client, rightX, ry + 36);
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(BLUE).text(`📍 ${r.location}`, rightX, ry + 52);

  // Installed Hardware Badge
  doc.roundedRect(rightX, ry + 68, rightW, 20, 4).fill('#f1f5f9');
  doc.fontSize(8).font('Helvetica-Bold').fillColor('#334155').text(`Hardware: ${r.hardware}`, rightX + 8, ry + 73, { width: rightW - 16 });

  // Quote
  doc.fontSize(9).font('Helvetica-Oblique').fillColor('#1e293b').text(r.quote, rightX, ry + 100, { width: rightW, lineGap: 3 });

  // Verified Badge at bottom right
  doc.roundedRect(rightX, ry + 170, 160, 22, 4).fill('#ecfdf5');
  doc.fontSize(8).font('Helvetica-Bold').fillColor(SUCCESS).text('✔ 100% Verified Customer Review', rightX + 10, ry + 176);
});

drawPageFooter(4);


// ============================================================================
// HELPER FOR 2-PRODUCTS-PER-PAGE (A4 FRIENDLY, EASY TO READ)
// ============================================================================
function drawTwoProductsPage(p1, p2, pageTitle, pageCategory, pageNum) {
  doc.addPage();
  drawPageHeader(pageTitle, pageCategory);

  const productsToDraw = [
    { p: p1, y: 65 },
    { p: p2, y: 435 }
  ];

  productsToDraw.forEach(({ p, y }) => {
    if (!p) return;

    const cardHeight = 355;
    doc.roundedRect(35, y, 525, cardHeight, 8).fill('#ffffff').stroke(BORDER_COLOR);
    doc.rect(35, y, 5, cardHeight).fill(p.brand.toLowerCase().includes('essl') ? BLUE : CYAN);

    // Header strip inside card
    doc.fontSize(15).font('Helvetica-Bold').fillColor(NAVY).text(p.name, 50, y + 14);
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(BLUE).text(`${p.brand.toUpperCase()} • ${p.category.toUpperCase()}`, 50, y + 33);
    doc.fontSize(8.5).font('Helvetica-Oblique').fillColor('#4b5563').text(p.tagline, 50, y + 46, { width: 500 });

    doc.rect(50, y + 62, 495, 1).fill('#e2e8f0');

    // Left Column: Product Image & Capacity Box
    const leftX = 50;
    const imgBoxW = 160;
    const imgBoxH = 150;

    doc.roundedRect(leftX, y + 72, imgBoxW, imgBoxH, 6).fill(LIGHT_BG).stroke(BORDER_COLOR);

    // Product Image
    const extensions = ['png', 'jpg', 'jpeg'];
    for (const ext of extensions) {
      const candidatePath = path.join(__dirname, '..', 'public', 'images', 'products', `${p.id}.${ext}`);
      if (fs.existsSync(candidatePath)) {
        try {
          doc.image(candidatePath, leftX + 10, y + 78, { fit: [imgBoxW - 20, imgBoxH - 16], align: 'center', valign: 'center' });
          break;
        } catch (err) {}
      }
    }

    // Capacity mini card below image
    doc.roundedRect(leftX, y + 230, imgBoxW, 110, 6).fill('#0b2545');
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(CYAN).text('SYSTEM CAPACITY', leftX + 10, y + 240);

    let capY = y + 256;
    if (p.capacity) {
      Object.entries(p.capacity).forEach(([k, v]) => {
        const label = k.charAt(0).toUpperCase() + k.slice(1);
        doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#ffffff').text(`• ${label}: `, leftX + 10, capY, { continued: true });
        doc.font('Helvetica').fillColor('#cbd5e1').text(String(v));
        capY += 14;
      });
    }

    // Right Column: Technical Specs & Key Features
    const rightX = 225;
    const rightW = 320;

    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(NAVY).text('TECHNICAL SPECIFICATIONS', rightX, y + 72);

    let sY = y + 88;
    if (p.specs) {
      Object.entries(p.specs).slice(0, 5).forEach(([key, val], idx) => {
        const bg = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
        doc.rect(rightX, sY - 2, rightW, 16).fill(bg);
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#334155').text(label, rightX + 6, sY + 2, { width: 110 });
        doc.font('Helvetica').fillColor('#0f172a').text(String(val), rightX + 120, sY + 2, { width: rightW - 125 });
        sY += 17;
      });
    }

    // Key Features
    sY += 6;
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(NAVY).text('KEY FEATURES', rightX, sY);
    sY += 15;
    if (p.features && Array.isArray(p.features)) {
      p.features.slice(0, 3).forEach(f => {
        doc.fontSize(7.5).font('Helvetica').fillColor('#334155').text(`✔  ${f}`, rightX, sY, { width: rightW, lineGap: 1.5 });
        sY += 17;
      });
    }

    // Target applications / wiring footer inside card
    const btmY = y + 305;
    doc.roundedRect(rightX, btmY, rightW, 35, 4).fill('#f1f5f9');
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor(NAVY).text('Applications:', rightX + 8, btmY + 6);
    const appStr = p.applications ? p.applications.slice(0, 2).join(' • ') : 'Corporate Offices, Factories, Hospitals, Retail Stores';
    doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text(appStr, rightX + 8, btmY + 18, { width: rightW - 16 });
  });

  drawPageFooter(pageNum);
}

// Find product by id
const getP = (id) => products.find(x => x.id === id);

// ============================================================================
// PAGE 5: eSSL Core Attendance Terminals (K90 Pro & K30 Pro)
// ============================================================================
drawTwoProductsPage(
  getP('essl-k90-pro'),
  getP('essl-k30-pro'),
  'eSSL Fingerprint Time Attendance Terminals',
  'Fingerprint Terminals',
  5
);

// ============================================================================
// PAGE 6: eSSL Multi-Biometric & Face Recognition (SilkBio-100TC & uFace 202)
// ============================================================================
drawTwoProductsPage(
  getP('essl-silkbio-100tc'),
  getP('essl-uface-202'),
  'eSSL Multi-Biometric & AI Face Recognition',
  'Multi-Bio & Face Systems',
  6
);

// ============================================================================
// PAGE 7: eSSL Slim Access & Compact Terminals (F22 & Identix K21)
// ============================================================================
drawTwoProductsPage(
  getP('essl-f22'),
  getP('essl-identix-k21'),
  'eSSL Slim Wi-Fi & Office Biometric Scanners',
  'Slim Access Series',
  7
);

// ============================================================================
// PAGE 8: BioMax AI Face Recognition & Multi-Bio (SpeedFace 5 & N-BM60)
// ============================================================================
drawTwoProductsPage(
  getP('biomax-speedface-5'),
  getP('biomax-n-bm60'),
  'BioMax AI Face Recognition & Multi-Bio Terminals',
  'BioMax AI Face Series',
  8
);

// ============================================================================
// PAGE 9: BioMax Fingerprint & Enterprise Controller (N-BM30W & InBio 260)
// ============================================================================
drawTwoProductsPage(
  getP('biomax-bio-finger-100'),
  getP('essl-inbio-260'),
  'BioMax Wi-Fi Finger & Multi-Door Controller',
  'Controllers & Fingerprint',
  9
);

// ============================================================================
// PAGE 10: Access Control Electromagnetic Locks & Bolts (EM Lock & Drop Bolt)
// ============================================================================
drawTwoProductsPage(
  getP('electromagnetic-lock-600lbs'),
  getP('drop-bolt-lock'),
  'High-Tensile Electromagnetic Locks & Drop Bolts',
  'Access Control Locks',
  10
);

// ============================================================================
// PAGE 11: RFID SMART CARDS & DOOR ENGINEERING ARCHITECTURE
// ============================================================================
doc.addPage();
drawPageHeader('Access Control Engineering Architecture', 'System Architecture');

curY = 65;

// RFID Product Card on top half
const rfidProd = getP('rfid-smart-cards-tags');
if (rfidProd) {
  doc.roundedRect(35, curY, 525, 185, 8).fill('#ffffff').stroke(BORDER_COLOR);
  doc.rect(35, curY, 5, 185).fill(BLUE);

  // RFID image
  const rfidImgPath = path.join(__dirname, '..', 'public', 'images', 'products', 'rfid-smart-cards-tags.png');
  if (fs.existsSync(rfidImgPath)) {
    try {
      doc.roundedRect(50, curY + 15, 130, 155, 6).fill(LIGHT_BG).stroke(BORDER_COLOR);
      doc.image(rfidImgPath, 55, curY + 25, { fit: [120, 135], align: 'center', valign: 'center' });
    } catch (e) {}
  }

  doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text(rfidProd.name, 195, curY + 16);
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(BLUE).text('RFID SMART CARDS, MIFARE TAGS & KEYFOBS', 195, curY + 34);
  doc.fontSize(8.5).font('Helvetica').fillColor('#334155').text(
    'High-grade contact-less proximity cards and 13.56 MHz Mifare smart cards compatible with all eSSL, BioMax, and third-party RFID readers. Custom company branding printing available for corporate employee IDs.',
    195, curY + 48, { width: 350, lineGap: 2.5 }
  );

  doc.fontSize(8).font('Helvetica-Bold').fillColor(NAVY).text('Key Specifications:', 195, curY + 95);
  doc.fontSize(8).font('Helvetica').fillColor('#475569').text(
    '• Operating Frequency: 125 kHz (EM Proximity) / 13.56 MHz (Mifare 1K)\n' +
    '• Read Distance: 3 to 10 cm fast response | Material: Durable Glossy White PVC\n' +
    '• Applications: Employee ID Cards, Gym Member Cards, Hotel Keycards, Access Control Tags',
    195, curY + 108, { width: 350, lineGap: 2.5 }
  );
}

curY += 205;

// Door Access Control Engineering Blueprint
doc.fontSize(14).font('Helvetica-Bold').fillColor(NAVY).text('Complete Door Access Control Engineering Blueprint', 35, curY);
doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text(
  'Every Meenakshi Technologies access control setup follows a strict 3-zone security blueprint ensuring 100% fail-safe life-safety compliance.',
  35, curY + 18, { width: 525 }
);

curY += 38;

// 3 Zones Layout
const zWidth = 168;
const zHeight = 220;

// Zone 1: Outside
doc.roundedRect(35, curY, zWidth, zHeight, 8).fill(LIGHT_BG).stroke(BORDER_COLOR);
doc.rect(35, curY, zWidth, 24).fill(NAVY);
doc.fontSize(9).font('Helvetica-Bold').fillColor(CYAN).text('ZONE 1: OUTSIDE SECURE', 45, curY + 7);
doc.fontSize(8).font('Helvetica-Bold').fillColor(NAVY).text('Biometric Terminal', 45, curY + 35);
doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text(
  '• eSSL Face / Fingerprint Machine\n' +
  '• Outdoor / Indoor Wall Mounting\n' +
  '• Optical Anti-Scratch Sensor\n' +
  '• Audio-visual punch confirmation\n' +
  '• Tamper alarm switch protection\n' +
  '• Wiegand / TCP/IP data push',
  45, curY + 48, { lineGap: 3.5 }
);

// Zone 2: Door Threshold
doc.roundedRect(213, curY, zWidth, zHeight, 8).fill(LIGHT_BG).stroke(BORDER_COLOR);
doc.rect(213, curY, zWidth, 24).fill(BLUE);
doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff').text('ZONE 2: DOOR THRESHOLD', 223, curY + 7);
doc.fontSize(8).font('Helvetica-Bold').fillColor(NAVY).text('600 lbs EM Lock & Brackets', 223, curY + 35);
doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text(
  '• 280 kg / 600 lbs Holding Force\n' +
  '• U-Bracket for Frameless Glass\n' +
  '• ZL-Bracket for In-Swing Wooden\n' +
  '• Hydraulic Tension Door Closer\n' +
  '• Built-in MOV Surge Protection\n' +
  '• Dual Color Lock Status LED',
  223, curY + 48, { lineGap: 3.5 }
);

// Zone 3: Inside & Power Hub
doc.roundedRect(391, curY, zWidth, zHeight, 8).fill(LIGHT_BG).stroke(BORDER_COLOR);
doc.rect(391, curY, zWidth, 24).fill('#0b2545');
doc.fontSize(9).font('Helvetica-Bold').fillColor(CYAN).text('ZONE 3: INSIDE & POWER HUB', 401, curY + 7);
doc.fontSize(8).font('Helvetica-Bold').fillColor(NAVY).text('Exit Switch & Central SMPS', 401, curY + 35);
doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text(
  '• Stainless Steel Push-to-Exit\n' +
  '• Emergency Break-Glass Cutoff\n' +
  '• 12V 5A Regulated Power SMPS\n' +
  '• 12V 7Ah Standby Battery Backup\n' +
  '• Fail-Safe NC Relay Interlock\n' +
  '• Fire Alarm Emergency Release',
  401, curY + 48, { lineGap: 3.5 }
);

// Bottom Engineering Note
curY += zHeight + 15;
doc.roundedRect(35, curY, 525, 45, 6).fill('#ecfdf5');
doc.fontSize(8.5).font('Helvetica-Bold').fillColor(SUCCESS).text(
  '✔ LIFE-SAFETY COMPLIANCE: In case of building power cut or fire emergency, our fail-safe magnetic locks automatically release to ensure unhindered evacuation.',
  48, curY + 12, { width: 500, lineGap: 2 }
);

drawPageFooter(11);


// ============================================================================
// PAGE 12: ORDER BOOKING, AMC PLANS & BACK COVER
// ============================================================================
doc.addPage();
doc.rect(0, 0, 595.28, 841.89).fill(NAVY);

// Logo on Back Cover
if (fs.existsSync(logoPath)) {
  try {
    doc.image(logoPath, 45, 50, { width: 170 });
  } catch (e) {}
}

doc.fontSize(11).font('Helvetica-Bold').fillColor(CYAN).text('BOOK YOUR FREE ON-SITE SURVEY & DEMO', 45, 140);
doc.fontSize(22).font('Helvetica-Bold').fillColor('#ffffff').text('Ready to Upgrade Your Workplace Security?', 45, 160);

doc.fontSize(9.5).font('Helvetica').fillColor('#cbd5e1').text(
  'Our certified biometric engineers will inspect your entrance doors, recommend the ideal eSSL or BioMax machine, demonstrate real software payroll sync, and provide a transparent formal quotation.',
  45, 195, { width: 505, lineGap: 3.5 }
);

// 3 Ordering Steps
const stepY = 250;
const sCardW = 160;
const sCardH = 100;

doc.roundedRect(45, stepY, sCardW, sCardH, 6).fill('#0b2545');
doc.fontSize(12).font('Helvetica-Bold').fillColor(CYAN).text('STEP 1', 58, stepY + 14);
doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff').text('Call / WhatsApp', 58, stepY + 30);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text('Share your employee count, door type (glass/wooden), and attendance/access requirements.', 58, stepY + 46, { width: 135, lineGap: 2 });

doc.roundedRect(217, stepY, sCardW, sCardH, 6).fill('#0b2545');
doc.fontSize(12).font('Helvetica-Bold').fillColor(CYAN).text('STEP 2', 230, stepY + 14);
doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff').text('Free Site Survey', 230, stepY + 30);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text('Engineer visits your Hyderabad location, measures door clearance, and provides live device demo.', 230, stepY + 46, { width: 135, lineGap: 2 });

doc.roundedRect(390, stepY, sCardW, sCardH, 6).fill('#0b2545');
doc.fontSize(12).font('Helvetica-Bold').fillColor(CYAN).text('STEP 3', 403, stepY + 14);
doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff').text('Same-Day Install', 403, stepY + 30);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text('Professional wall mounting, EM lock installation, clean cabling dressing, and payroll training.', 403, stepY + 46, { width: 135, lineGap: 2 });

// Annual Maintenance Contract (AMC) Card
const amcY = 375;
doc.roundedRect(45, amcY, 505, 120, 8).fill('#071f33');
doc.rect(45, amcY, 5, 120).fill(CYAN);

doc.fontSize(12).font('Helvetica-Bold').fillColor('#ffffff').text('Annual Maintenance Contract (AMC) & Support Packages', 65, amcY + 16);
doc.fontSize(8.5).font('Helvetica').fillColor('#94a3b8').text(
  'Ensure zero downtime for your attendance and access infrastructure with our preventative AMC plans:\n\n' +
  '• Quarterly Physical Audit: Optical sensor recalibration, EM lock holding test, and battery impedance testing.\n' +
  '• Database & Payroll Backup: Automated cloud & local backup of attendance logs to prevent data loss.\n' +
  '• Unlimited Remote Support: Instant resolution of employee shift changes or software reinstallations via AnyDesk.\n' +
  '• Priority 4-Hour Emergency Breakdown SLA across all Hyderabad and Telangana commercial corridors.',
  65, amcY + 35, { width: 465, lineGap: 3 }
);

// Detailed Office Locations Contact Grid
const cFootY = 520;
doc.roundedRect(45, cFootY, 505, 150, 8).fill('#051b2c');
doc.rect(45, cFootY, 5, 150).fill(BLUE);

doc.fontSize(12).font('Helvetica-Bold').fillColor(CYAN).text('OFFICIAL CONTACT & VERIFIED OFFICE ADDRESSES', 65, cFootY + 16);

// Col 1: Central HQ
doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#ffffff').text('Hyderabad Central Office (HQ)', 65, cFootY + 38);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text(
  'Meenakshi Technologies\n' +
  'Near Charminar / Santosh Nagar Ring Road,\n' +
  'Hyderabad, Telangana 500053.\n' +
  'GPS: 17.3459° N, 78.4798° E',
  65, cFootY + 52, { lineGap: 2 }
);

// Col 2: Balapur Branch
doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#ffffff').text('Balapur Business Branch', 315, cFootY + 38);
doc.fontSize(8).font('Helvetica').fillColor('#cbd5e1').text(
  'Meenakshi Technologies\n' +
  'Balapur Main Road, Near DRDL / Kanchanbagh,\n' +
  'Hyderabad, Telangana 500005.\n' +
  'GPS: 17.3095° N, 78.5152° E',
  315, cFootY + 52, { lineGap: 2 }
);

// Direct Helpline Banner
doc.rect(45, cFootY + 112, 505, 1).fill('#1e293b');
doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff').text('Direct Helpline: ', 65, cFootY + 125, { continued: true });
doc.font('Helvetica-Bold').fillColor(CYAN).text('+91 6301593064', { continued: true });
doc.font('Helvetica').fillColor('#cbd5e1').text('   |   Email: meenakshitechnologies65@gmail.com   |   Web: www.meenakshitechnologies.org');

// Founder Sign-Off
const signY = 695;
doc.fontSize(11).font('Helvetica-Bold').fillColor('#ffffff').text('Tingirikar Teja', 45, signY);
doc.fontSize(8.5).font('Helvetica').fillColor(CYAN).text('Founder & Managing Director, Meenakshi Technologies', 45, signY + 15);
doc.fontSize(8).font('Helvetica-Oblique').fillColor('#94a3b8').text('Hyderabad, Telangana • Serving Indian Workplaces with Pride and Integrity.', 45, signY + 28);

// Bottom Decorative Bar
doc.rect(0, 810, 595.28, 32).fill(BLUE);
doc.rect(0, 800, 595.28, 10).fill(CYAN);
doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff').text('MEENAKSHI TECHNOLOGIES • 2026 OFFICIAL A4 PRINT-FRIENDLY BROCHURE', 45, 820);

// Finalize
doc.end();

writeStream.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`[OK] Master A4 Brochure PDF successfully created at: ${outputPath} (${Math.round(stats.size / 1024)} KB)`);
});
