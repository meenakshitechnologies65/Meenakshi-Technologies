/**
 * ADMIN CONTROLLER
 * Business logic for the protected Admin Dashboard:
 * Overview metrics, Product management, Customer leads, SEO settings, Videos, and Audit logs.
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');
const { db } = require('../database/db');

// Helper to load JSON
function loadData(file) {
  try {
    const filePath = path.join(config.paths.data, file);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`[Admin] Error reading ${file}:`, err.message);
    return [];
  }
}

// Helper to save JSON
function saveData(file, data) {
  try {
    const filePath = path.join(config.paths.data, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`[Admin] Error writing ${file}:`, err.message);
    return false;
  }
}

/**
 * Render the Super Admin Dashboard
 */
function renderDashboard(req, res) {
  const leads = loadData('leads.json');
  const posts = loadData('blog-posts.json');
  const products = loadData('products.json');
  const videos = loadData('videos.json');
  const solutions = loadData('solutions.json');
  const industries = loadData('industries.json');

  // Fetch recent security audit logs from SQLite
  let auditLogs = [];
  try {
    auditLogs = db.prepare(`
      SELECT id, email, action, status, ip_address, details, created_at
      FROM auth_audit_logs
      ORDER BY id DESC
      LIMIT 50
    `).all();
  } catch (err) {
    console.warn('[Admin] Failed to load audit logs:', err.message);
  }

  res.render('dashboard', {
    adminUser: req.adminUser,
    leads,
    posts,
    products,
    videos,
    solutions,
    industries,
    auditLogs,
    currentYear: new Date().getFullYear()
  });
}

/**
 * Get Security Audit Logs API
 */
function getAuditLogs(req, res) {
  try {
    const logs = db.prepare(`
      SELECT id, email, action, status, ip_address, details, created_at
      FROM auth_audit_logs
      ORDER BY id DESC
      LIMIT 100
    `).all();
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Create New Product
 */
function createProduct(req, res) {
  try {
    const { name, brand, model, category, tagline, shortDesc, features, capacity, specs } = req.body;
    if (!name || !brand) {
      return res.status(400).json({ success: false, error: 'Product name and brand are required.' });
    }

    const products = loadData('products.json');
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const newProduct = {
      id: `prod_${Date.now()}`,
      name,
      slug,
      brand,
      model: model || brand,
      category: category || 'Biometric Fingerprint Attendance Machines',
      image: req.body.image || '/images/products/essl-k90-pro.png',
      tagline: tagline || '',
      shortDesc: shortDesc || tagline || name,
      price: 0,
      inStock: true,
      isFeatured: false,
      cataloguePdf: '/catalogues/meenakshi-technologies-product-catalogue-2026.pdf',
      capacity: capacity || { fingerprints: '2,000 Templates', cards: '2,000 Cards', transactions: '100,000 Logs' },
      specs: specs || {},
      features: Array.isArray(features) ? features : (features ? [features] : [])
    };

    products.unshift(newProduct);
    saveData('products.json', products);

    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Update Product
 */
function updateProduct(req, res) {
  try {
    const { slug } = req.params;
    const products = loadData('products.json');
    const index = products.findIndex(p => p.slug === slug || p.id === slug);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    products[index] = { ...products[index], ...req.body, slug: products[index].slug };
    saveData('products.json', products);

    res.json({ success: true, product: products[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Delete Product
 */
function deleteProduct(req, res) {
  try {
    const { slug } = req.params;
    const products = loadData('products.json');
    const filtered = products.filter(p => p.slug !== slug && p.id !== slug);

    if (filtered.length === products.length) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    saveData('products.json', filtered);
    res.json({ success: true, message: 'Product successfully removed from catalog.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Update Customer Lead Status
 */
function updateLeadStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const leads = loadData('leads.json');
    const lead = leads.find(l => l.id === id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found.' });
    }

    lead.status = status || lead.status;
    saveData('leads.json', leads);

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Add YouTube Video
 */
function addVideo(req, res) {
  try {
    const { id, title, category, location, hardware } = req.body;
    if (!id || !title) {
      return res.status(400).json({ success: false, error: 'YouTube video ID and title required.' });
    }

    const videos = loadData('videos.json');
    const cleanId = id.trim().replace(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|shorts\/)?/, '');

    const newVideo = {
      id: cleanId,
      title,
      category: category || 'Biometric Installation',
      location: location || 'Hyderabad',
      hardware: hardware || 'eSSL Biometric Attendance',
      embedUrl: `https://www.youtube-nocookie.com/embed/${cleanId}`,
      youtubeUrl: `https://www.youtube.com/shorts/${cleanId}`
    };

    videos.unshift(newVideo);
    saveData('videos.json', videos);

    res.json({ success: true, video: newVideo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Delete YouTube Video
 */
function deleteVideo(req, res) {
  try {
    const { id } = req.params;
    const videos = loadData('videos.json');
    const filtered = videos.filter(v => v.id !== id);

    saveData('videos.json', filtered);
    res.json({ success: true, message: 'Video removed.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  renderDashboard,
  getAuditLogs,
  createProduct,
  updateProduct,
  deleteProduct,
  updateLeadStatus,
  addVideo,
  deleteVideo
};
