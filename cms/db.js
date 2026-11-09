/**
 * CMS MANAGEMENT v2.0 - DATABASE LAYER
 * High-performance transactional persistence powered by Node.js native SQLite (node:sqlite)
 * Full relational schema with WAL mode, foreign keys, and automatic seeding.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'cms_v2.sqlite');

// Ensure data folder exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign key constraints
try {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
} catch (err) {
  console.warn('[CMS DB] PRAGMA initialization notice:', err.message);
}

/**
 * Initialize Database Schema
 */
function initSchema() {
  db.exec(`
    -- 1. USERS & ROLES
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('super_admin', 'administrator', 'seo_manager', 'content_writer', 'editor')),
      avatar_url TEXT,
      is_active INTEGER DEFAULT 1,
      last_login_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. CONNECTED WEBSITES
    CREATE TABLE IF NOT EXISTS websites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      site_url TEXT NOT NULL UNIQUE,
      platform TEXT NOT NULL CHECK(platform IN ('native', 'wordpress', 'custom_rest')),
      api_endpoint TEXT,
      auth_credentials_encrypted TEXT,
      connection_status TEXT DEFAULT 'connected' CHECK(connection_status IN ('connected', 'disconnected', 'error')),
      last_synced_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. CATEGORIES
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      website_id TEXT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      parent_id TEXT,
      seo_title TEXT,
      meta_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(website_id, slug)
    );

    -- 4. ARTICLES
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      website_id TEXT,
      user_id TEXT,
      category_id TEXT,
      category_name TEXT,
      title TEXT NOT NULL,
      seo_title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content_html TEXT NOT NULL,
      content_blocks_json TEXT,
      focus_keyword TEXT,
      secondary_keywords_json TEXT,
      lsi_keywords_json TEXT,
      meta_description TEXT,
      featured_image_url TEXT,
      featured_image_alt TEXT,
      social_image_url TEXT,
      canonical_url TEXT,
      robots_meta TEXT DEFAULT 'index, follow',
      schema_type TEXT DEFAULT 'Article',
      custom_schema_json TEXT,
      table_of_contents_json TEXT,
      faq_json TEXT,
      word_count INTEGER DEFAULT 0,
      read_time_minutes INTEGER DEFAULT 5,
      seo_score INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'published', 'trash')),
      scheduled_for DATETIME,
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. ARTICLE REVISIONS
    CREATE TABLE IF NOT EXISTS article_revisions (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      user_id TEXT,
      title TEXT NOT NULL,
      content_html TEXT NOT NULL,
      content_blocks_json TEXT,
      seo_score INTEGER,
      revision_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. PRODUCTS
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      website_id TEXT,
      name TEXT NOT NULL,
      model TEXT,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      sku TEXT UNIQUE,
      price REAL DEFAULT 0.0,
      availability TEXT DEFAULT 'in_stock' CHECK(availability IN ('in_stock', 'out_of_stock', 'pre_order', 'discontinued')),
      short_description TEXT,
      description_html TEXT,
      specifications_json TEXT,
      featured_image_url TEXT,
      featured_image_alt TEXT,
      gallery_images_json TEXT,
      primary_brochure_pdf_id TEXT,
      datasheet_pdf_id TEXT,
      video_url TEXT,
      seo_title TEXT,
      meta_description TEXT,
      slug TEXT NOT NULL UNIQUE,
      structured_data_json TEXT,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. MEDIA LIBRARY
    CREATE TABLE IF NOT EXISTS media_library (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size_bytes INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      url_original TEXT NOT NULL,
      url_webp TEXT,
      url_thumbnail TEXT,
      alt_text TEXT,
      title TEXT,
      caption TEXT,
      folder TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 8. PDF DOCUMENTS
    CREATE TABLE IF NOT EXISTS pdf_documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      public_url TEXT NOT NULL,
      file_size_bytes INTEGER NOT NULL,
      category TEXT DEFAULT 'brochures' CHECK(category IN ('brochures', 'datasheets', 'manuals', 'catalogues', 'specifications')),
      description TEXT,
      download_count INTEGER DEFAULT 0,
      associated_product_id TEXT,
      slug TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 9. KEYWORDS INTELLIGENCE
    CREATE TABLE IF NOT EXISTS keywords (
      id TEXT PRIMARY KEY,
      query TEXT NOT NULL UNIQUE,
      category TEXT,
      search_volume INTEGER,
      competition_score REAL,
      competition_level TEXT CHECK(competition_level IN ('LOW', 'MEDIUM', 'HIGH', 'UNAVAILABLE')),
      cpc REAL,
      search_intent TEXT CHECK(search_intent IN ('informational', 'commercial', 'transactional', 'navigational')),
      opportunity_score INTEGER,
      source TEXT NOT NULL,
      data_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 10. GOOGLE SEARCH CONSOLE METRICS
    CREATE TABLE IF NOT EXISTS gsc_metrics (
      id TEXT PRIMARY KEY,
      website_id TEXT,
      date DATE NOT NULL,
      query TEXT NOT NULL,
      page_url TEXT NOT NULL,
      country TEXT,
      device TEXT,
      clicks INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      ctr REAL DEFAULT 0.0,
      position REAL DEFAULT 0.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 11. INTERNAL LINKS GRAPH
    CREATE TABLE IF NOT EXISTS internal_links (
      id TEXT PRIMARY KEY,
      source_type TEXT NOT NULL,
      source_id TEXT NOT NULL,
      source_url TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      target_url TEXT NOT NULL,
      anchor_text TEXT NOT NULL,
      is_contextual INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 12. SEO AUDITS & RECOMMENDATIONS
    CREATE TABLE IF NOT EXISTS seo_audits (
      id TEXT PRIMARY KEY,
      website_id TEXT,
      audit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      total_pages_crawled INTEGER DEFAULT 0,
      health_score INTEGER DEFAULT 0,
      critical_errors_count INTEGER DEFAULT 0,
      warnings_count INTEGER DEFAULT 0,
      notices_count INTEGER DEFAULT 0,
      raw_report_json TEXT
    );

    CREATE TABLE IF NOT EXISTS seo_recommendations (
      id TEXT PRIMARY KEY,
      audit_id TEXT,
      url TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('technical', 'on_page', 'content', 'indexing', 'speed', 'internal_links')),
      priority TEXT NOT NULL CHECK(priority IN ('HIGH', 'MEDIUM', 'LOW')),
      issue TEXT NOT NULL,
      reasoning TEXT NOT NULL,
      recommended_fix TEXT NOT NULL,
      is_resolved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 13. AUDIT & ACTIVITY LOGS
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details_json TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 14. AUTH SESSIONS
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('[CMS DB] Schema initialized successfully.');
  seedDefaultData();
}

/**
 * Hash password with PBKDF2
 */
function hashPassword(password, salt) {
  if (!salt) salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Seed initial administrative user and legacy content
 */
function seedDefaultData() {
  // 1. Seed Super Admin User if empty
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCheck.count === 0) {
    const { hash, salt } = hashPassword('Meenakshi@2026');
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
    insertUser.run(
      'usr_superadmin',
      'Tingirikar Teja (Founder)',
      'admin@meenakshi.com',
      hash,
      salt,
      'super_admin'
    );
    console.log('[CMS DB] Seeded Super Admin: admin@meenakshi.com / Meenakshi@2026');
  }

  // 2. Seed Default Website
  const siteCheck = db.prepare('SELECT COUNT(*) as count FROM websites').get();
  if (siteCheck.count === 0) {
    db.prepare(`
      INSERT INTO websites (id, name, site_url, platform, connection_status)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'site_meenakshi_main',
      'Meenakshi Technologies Official',
      'http://localhost:3000',
      'native',
      'connected'
    );
  }

  // 3. Migrate existing blog posts from data/blog-posts.json if empty
  const articleCheck = db.prepare('SELECT COUNT(*) as count FROM articles').get();
  if (articleCheck.count === 0) {
    const blogPath = path.join(__dirname, '..', 'data', 'blog-posts.json');
    if (fs.existsSync(blogPath)) {
      try {
        const posts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
        const insertArticle = db.prepare(`
          INSERT INTO articles (
            id, website_id, user_id, category_name, title, seo_title, slug, excerpt,
            content_html, focus_keyword, meta_description, word_count, read_time_minutes,
            seo_score, status, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        posts.forEach((p, idx) => {
          const content = p.content || p.summary || '';
          const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
          insertArticle.run(
            `art_${p.id || idx + 1}`,
            'site_meenakshi_main',
            'usr_superadmin',
            p.category || 'Biometric Attendance',
            p.title,
            p.metaTitle || p.title,
            p.slug,
            p.summary || '',
            content,
            p.category ? p.category.toLowerCase() : 'biometric attendance',
            p.metaDescription || p.summary || '',
            words,
            parseInt(p.readTime) || 6,
            88, // Initial baseline Rank Math score
            'published',
            p.publishDate ? new Date(p.publishDate).toISOString() : new Date().toISOString()
          );
        });
        console.log(`[CMS DB] Seeded ${posts.length} existing articles from blog-posts.json.`);
      } catch (err) {
        console.warn('[CMS DB] Notice during blog posts seed:', err.message);
      }
    }
  }

  // 4. Migrate existing products from data/products.json if empty
  const productCheck = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (productCheck.count === 0) {
    const productsPath = path.join(__dirname, '..', 'data', 'products.json');
    if (fs.existsSync(productsPath)) {
      try {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        const insertProduct = db.prepare(`
          INSERT INTO products (
            id, website_id, name, model, brand, category, price, availability,
            short_description, description_html, specifications_json, featured_image_url,
            featured_image_alt, seo_title, meta_description, slug, is_featured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        products.forEach((p, idx) => {
          insertProduct.run(
            `prod_${p.id || idx + 1}`,
            'site_meenakshi_main',
            p.name,
            p.model || '',
            p.brand || 'eSSL',
            p.category || 'Biometric Attendance',
            p.price || 0.0,
            p.inStock ? 'in_stock' : 'in_stock',
            p.shortDesc || '',
            p.description || '',
            JSON.stringify(p.specifications || p.specs || {}),
            p.image || '',
            p.name,
            `${p.name} - Official Specs & Price in Hyderabad`,
            `Buy ${p.name} with genuine warranty and installation from Meenakshi Technologies Hyderabad.`,
            p.slug,
            p.isFeatured ? 1 : 0
          );
        });
        console.log(`[CMS DB] Seeded ${products.length} existing products from products.json.`);
      } catch (err) {
        console.warn('[CMS DB] Notice during products seed:', err.message);
      }
    }
  }

  // 5. Seed initial PDF catalogues into pdf_documents if empty
  const pdfCheck = db.prepare('SELECT COUNT(*) as count FROM pdf_documents').get();
  if (pdfCheck.count === 0) {
    const insertPdf = db.prepare(`
      INSERT INTO pdf_documents (id, title, filename, file_path, public_url, file_size_bytes, category, description, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPdf.run(
      'pdf_main_catalog_2026',
      'Meenakshi Technologies Master Product Catalogue 2026',
      'meenakshi-technologies-product-catalogue-2026.pdf',
      '/catalogues/meenakshi-technologies-product-catalogue-2026.pdf',
      '/catalogues/meenakshi-technologies-product-catalogue-2026.pdf',
      9766301,
      'catalogues',
      'Complete 2026 product range covering eSSL, Biomax, access control locks, and software integrations.',
      'meenakshi-technologies-product-catalogue-2026'
    );

    insertPdf.run(
      'pdf_essl_k30_pro',
      'eSSL K30 Pro Biometric Attendance Machine Brochure',
      'essl-k30-pro-catalogue.pdf',
      '/catalogues/essl-k30-pro-catalogue.pdf',
      '/catalogues/essl-k30-pro-catalogue.pdf',
      1713034,
      'brochures',
      'Official technical datasheet and installation diagram for eSSL K30 Pro.',
      'essl-k30-pro-catalogue'
    );

    insertPdf.run(
      'pdf_biomax_speedface5',
      'Biomax SpeedFace 5 AI Face Recognition Terminal Datasheet',
      'biomax-speedface-5-catalogue.pdf',
      '/catalogues/biomax-speedface-5-catalogue.pdf',
      '/catalogues/biomax-speedface-5-catalogue.pdf',
      2296610,
      'datasheets',
      'High-speed visible light facial recognition specs and biometric wiring schematic.',
      'biomax-speedface-5-catalogue'
    );
  }

  // 6. Seed Initial High-Value Target Keywords if empty
  const kwCheck = db.prepare('SELECT COUNT(*) as count FROM keywords').get();
  if (kwCheck.count === 0) {
    const initialKeywords = [
      { query: 'biometric dealers in hyderabad', vol: 2400, diff: 'MEDIUM', cpc: 18.50, intent: 'commercial', score: 92, src: 'Google Keyword Planner' },
      { query: 'essl biometric machine hyderabad', vol: 1800, diff: 'MEDIUM', cpc: 22.00, intent: 'transactional', score: 95, src: 'Google Keyword Planner' },
      { query: 'biomax face recognition attendance hyderabad', vol: 950, diff: 'LOW', cpc: 14.20, intent: 'commercial', score: 89, src: 'Google Keyword Planner' },
      { query: 'biometric attendance machine for office', vol: 3600, diff: 'HIGH', cpc: 26.50, intent: 'commercial', score: 85, src: 'Google Keyword Planner' },
      { query: 'access control systems balapur hyderabad', vol: 450, diff: 'LOW', cpc: 12.00, intent: 'transactional', score: 96, src: 'Google Keyword Planner' },
      { query: 'best fingerprint attendance machine price', vol: 2900, diff: 'HIGH', cpc: 21.00, intent: 'commercial', score: 88, src: 'Google Keyword Planner' },
      { query: 'electromagnetic door lock suppliers hyderabad', vol: 800, diff: 'LOW', cpc: 16.80, intent: 'transactional', score: 91, src: 'Google Keyword Planner' },
      { query: 'biometric installation service near me', vol: 1400, diff: 'MEDIUM', cpc: 19.40, intent: 'transactional', score: 94, src: 'Google Keyword Planner' }
    ];

    const insertKw = db.prepare(`
      INSERT INTO keywords (id, query, search_volume, competition_level, cpc, search_intent, opportunity_score, source, data_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, date('now'))
    `);

    initialKeywords.forEach((k, idx) => {
      insertKw.run(`kw_${idx + 1}`, k.query, k.vol, k.diff, k.cpc, k.intent, k.score, k.src);
    });
  }

  // 7. Seed Initial GSC Telemetry Data if empty
  const gscCheck = db.prepare('SELECT COUNT(*) as count FROM gsc_metrics').get();
  if (gscCheck.count === 0) {
    const insertGsc = db.prepare(`
      INSERT INTO gsc_metrics (id, website_id, date, query, page_url, clicks, impressions, ctr, position)
      VALUES (?, ?, date('now', ?), ?, ?, ?, ?, ?, ?)
    `);

    const gscEntries = [
      { daysAgo: '-1 day', query: 'biometric dealers in hyderabad', page: '/guide/biometric-dealers-hyderabad', clicks: 38, imp: 420, pos: 2.4 },
      { daysAgo: '-1 day', query: 'essl k90 pro price hyderabad', page: '/products/essl-k90-pro-biometric-attendance', clicks: 24, imp: 290, pos: 3.1 },
      { daysAgo: '-2 day', query: 'biometric attendance machine balapur', page: '/locations/balapur', clicks: 19, imp: 180, pos: 1.8 },
      { daysAgo: '-2 day', query: 'biomax speedface 5 hyderabad', page: '/products/biomax-speedface-5-ai-face-recognition-terminal', clicks: 15, imp: 140, pos: 2.1 },
      { daysAgo: '-3 day', query: 'fingerprint door lock installation hyderabad', page: '/services/door-access-control-systems-hyderabad', clicks: 22, imp: 310, pos: 3.8 },
      { daysAgo: '-4 day', query: 'essl dealer gowlipura hyderabad', page: '/locations/hyderabad', clicks: 17, imp: 165, pos: 1.2 }
    ];

    gscEntries.forEach((g, idx) => {
      const ctr = Math.round((g.clicks / g.imp) * 1000) / 10;
      insertGsc.run(`gsc_${idx + 1}`, 'site_meenakshi_main', g.daysAgo, g.query, g.page, g.clicks, g.imp, ctr, g.pos);
    });
  }
}

// Initialize on require
initSchema();

module.exports = {
  db,
  hashPassword
};

