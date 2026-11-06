/**
 * MEENAKSHI TECHNOLOGIES - PRODUCTION WEB SERVER
 * Biometric Attendance, Access Control & Business Software
 * Hyderabad, Telangana, India
 */

const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression for Core Web Vitals
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
}));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Set up EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Utility helper to load JSON data
function loadData(file) {
  try {
    const filePath = path.join(__dirname, 'data', file);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Error loading data/${file}:`, err.message);
    return [];
  }
}

// Utility helper to save JSON data
function saveData(file, data) {
  try {
    const filePath = path.join(__dirname, 'data', file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error saving data/${file}:`, err.message);
    return false;
  }
}

// Global Template Middleware
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.siteUrl = 'https://www.meenakshitechnologies.org';
  res.locals.companyPhone = '+91 6301593064';
  res.locals.companyEmail = 'meenakshitechnologies65@gmail.com';
  res.locals.founderName = 'Tingirikar Teja';
  next();
});

/* ==========================================================================
   PUBLIC ROUTES
   ========================================================================== */

// 1. Homepage
app.get('/', (req, res) => {
  const products = loadData('products.json');
  const solutions = loadData('solutions.json');
  const industries = loadData('industries.json');
  const locations = loadData('locations.json');
  const faqs = loadData('faqs.json');

  res.render('index', {
    products,
    solutions,
    industries,
    verifiedLocations: locations.verifiedLocations || [],
    hyderabadAreas: locations.hyderabadAreas || [],
    faqs
  });
});

// 2. About Us & Founder Profile
app.get('/about', (req, res) => {
  res.render('about');
});

// 3. Products Catalog
app.get('/products', (req, res) => {
  const products = loadData('products.json');
  res.render('products', { products });
});

// 4. Product Detail Page
app.get('/products/:slug', (req, res) => {
  const products = loadData('products.json');
  const product = products.find(p => p.slug === req.params.slug || p.id === req.params.slug);

  if (!product) {
    return res.status(404).render('404');
  }

  res.render('product-detail', { product });
});

// 5. Main Solutions / Services
app.get('/services', (req, res) => {
  const solutions = loadData('solutions.json');
  res.render('services', { solutions });
});

// 6. Service Detail Page
app.get('/services/:slug', (req, res) => {
  const solutions = loadData('solutions.json');
  const solution = solutions.find(s => s.slug === req.params.slug || s.id === req.params.slug);

  if (!solution) {
    return res.status(404).render('404');
  }

  res.render('service-detail', { solution });
});

// 7. Industries We Serve
app.get('/industries', (req, res) => {
  const industries = loadData('industries.json');
  res.render('industries', { industries });
});

// 8. Industry Detail Page
app.get('/industries/:slug', (req, res) => {
  const industries = loadData('industries.json');
  const industry = industries.find(i => i.slug === req.params.slug || i.id === req.params.slug);

  if (!industry) {
    return res.status(404).render('404');
  }

  res.render('industry-detail', { industry });
});

// 9. Verified Locations & Service Areas
app.get('/locations', (req, res) => {
  const locations = loadData('locations.json');
  res.render('locations', {
    verifiedLocations: locations.verifiedLocations || [],
    hyderabadAreas: locations.hyderabadAreas || [],
    telanganaDistricts: locations.telanganaDistricts || []
  });
});

// 10. Hyderabad Central Location
app.get('/locations/hyderabad', (req, res) => {
  const locations = loadData('locations.json');
  const location = locations.verifiedLocations.find(l => l.slug === 'hyderabad');
  res.render('location-detail', { location });
});

// 11. Balapur Branch Location
app.get('/locations/balapur', (req, res) => {
  const locations = loadData('locations.json');
  const location = locations.verifiedLocations.find(l => l.slug === 'balapur');
  res.render('location-detail', { location });
});

// 12. Hyderabad & Telangana Service Areas
app.get('/service-areas', (req, res) => {
  const locations = loadData('locations.json');
  res.render('service-areas', {
    hyderabadAreas: locations.hyderabadAreas || [],
    telanganaDistricts: locations.telanganaDistricts || []
  });
});

// 13. 3,000-Word In-Depth SEO Pillar Guide
app.get('/guide/biometric-dealers-hyderabad', (req, res) => {
  const posts = loadData('blog-posts.json');
  const pillar = posts.find(p => p.isPillar || p.slug === 'best-biometric-dealers-hyderabad-guide') || posts[0];
  res.render('pillar-guide', { post: pillar });
});

// 14. Blog Directory
app.get('/blog', (req, res) => {
  const posts = loadData('blog-posts.json');
  res.render('blog', { posts });
});

// 15. Blog Post Detail
app.get('/blog/:slug', (req, res) => {
  const posts = loadData('blog-posts.json');
  const post = posts.find(p => p.slug === req.params.slug || p.id === req.params.slug);

  if (!post) {
    return res.status(404).render('404');
  }

  if (post.isPillar) {
    return res.render('pillar-guide', { post });
  }

  res.render('blog-detail', { post });
});

// 16. Contact Page
app.get('/contact', (req, res) => {
  const locations = loadData('locations.json');
  res.render('contact', {
    verifiedLocations: locations.verifiedLocations || []
  });
});

// 17. Legal Pages
app.get('/privacy-policy', (req, res) => res.render('privacy-policy'));
app.get('/terms-and-conditions', (req, res) => res.render('terms-and-conditions'));

// 18. CMS Administration Dashboard
app.get(['/admin', '/cms'], (req, res) => {
  const leads = loadData('leads.json');
  const posts = loadData('blog-posts.json');
  const products = loadData('products.json');
  res.render('admin', { leads, posts, products });
});

/* ==========================================================================
   API ENDPOINTS
   ========================================================================== */

// Lead / Contact Form Submission
app.post('/api/enquiry', (req, res) => {
  try {
    const {
      fullName,
      companyName,
      email,
      mobileNumber,
      location,
      productOrService,
      employeeCount,
      message,
      website_source
    } = req.body;

    // Honeypot check
    if (website_source && website_source.trim() !== '') {
      return res.status(400).json({ success: false, message: 'Bot detected.' });
    }

    if (!fullName || !mobileNumber) {
      return res.status(400).json({ success: false, message: 'Full name and mobile number are required.' });
    }

    const leads = loadData('leads.json');
    const newLead = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      fullName,
      companyName: companyName || '',
      email: email || '',
      mobileNumber,
      location: location || 'Hyderabad',
      productOrService: productOrService || 'General Consultation',
      employeeCount: employeeCount || 'Not Specified',
      message: message || '',
      status: 'new'
    };

    leads.unshift(newLead);
    saveData('leads.json', leads);

    console.log(`[Lead Captured] #${newLead.id} from ${fullName} (${mobileNumber}) for ${newLead.productOrService}`);

    return res.json({
      success: true,
      leadId: newLead.id,
      message: 'Enquiry received successfully.'
    });
  } catch (err) {
    console.error('Error submitting enquiry:', err);
    return res.status(500).json({ success: false, message: 'Server error processing enquiry.' });
  }
});

// Update Lead Status (CMS)
app.patch('/api/cms/leads/:id', (req, res) => {
  try {
    const { status } = req.body;
    const leads = loadData('leads.json');
    const lead = leads.find(l => l.id === req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    lead.status = status || lead.status;
    saveData('leads.json', leads);

    return res.json({ success: true, lead });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Publish New Post (CMS)
app.post('/api/cms/posts', (req, res) => {
  try {
    const {
      title,
      category,
      author,
      readTime,
      summary,
      metaTitle,
      metaDescription,
      content
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content required.' });
    }

    const posts = loadData('blog-posts.json');
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newPost = {
      id: slug,
      slug,
      title,
      category: category || 'Biometric Attendance',
      author: author || 'Tingirikar Teja',
      designation: 'Founder, Meenakshi Technologies',
      date: new Date().toISOString().split('T')[0],
      readTime: readTime || '5 min read',
      wordCount: content.split(/\s+/).length,
      summary: summary || title,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || summary,
      isPillar: false,
      content
    };

    posts.unshift(newPost);
    saveData('blog-posts.json', posts);

    return res.json({ success: true, post: newPost });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ==========================================================================
   TECHNICAL SEO: SITEMAP & ROBOTS
   ========================================================================== */

// XML Sitemap
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://www.meenakshitechnologies.org';
  const products = loadData('products.json');
  const solutions = loadData('solutions.json');
  const industries = loadData('industries.json');
  const posts = loadData('blog-posts.json');

  let urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/products`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/services`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/industries`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/locations`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/locations/hyderabad`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/balapur`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${baseUrl}/service-areas`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/guide/biometric-dealers-hyderabad`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/blog`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/contact`, priority: '0.9', changefreq: 'monthly' }
  ];

  // Dynamic Product URLs
  products.forEach(p => {
    urls.push({ loc: `${baseUrl}/products/${p.slug}`, priority: '0.85', changefreq: 'monthly' });
  });

  // Dynamic Solution URLs
  solutions.forEach(s => {
    urls.push({ loc: `${baseUrl}/services/${s.slug}`, priority: '0.85', changefreq: 'monthly' });
  });

  // Dynamic Industry URLs
  industries.forEach(i => {
    urls.push({ loc: `${baseUrl}/industries/${i.slug}`, priority: '0.80', changefreq: 'monthly' });
  });

  // Dynamic Blog URLs
  posts.forEach(b => {
    urls.push({ loc: `${baseUrl}/blog/${b.slug}`, priority: '0.85', changefreq: 'monthly' });
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach(u => {
    xml += `  <url>\n`;
    xml += `    <loc>${u.loc}</loc>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// 404 Catch-All Handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`MEENAKSHI TECHNOLOGIES WEB PLATFORM RUNNING`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`CMS Portal: http://localhost:${PORT}/admin`);
  console.log(`Pillar Article: http://localhost:${PORT}/guide/biometric-dealers-hyderabad`);
  console.log(`Locations: http://localhost:${PORT}/locations`);
  console.log(`=======================================================`);
});

