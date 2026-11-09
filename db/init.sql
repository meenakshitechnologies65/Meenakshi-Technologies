-- ==============================================================================
-- MEENAKSHI TECHNOLOGIES - RELATIONAL DATABASE INITIALIZATION SCHEMA
-- CMS MANAGEMENT v2.0 - ENTERPRISE DATA ARCHITECTURE (PostgreSQL)
-- ==============================================================================

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK(role IN ('super_admin', 'administrator', 'seo_manager', 'content_writer', 'editor')),
    avatar_url TEXT,
    is_active INTEGER DEFAULT 1,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CONNECTED WEBSITES
CREATE TABLE IF NOT EXISTS websites (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    site_url VARCHAR(255) NOT NULL UNIQUE,
    platform VARCHAR(32) NOT NULL CHECK(platform IN ('native', 'wordpress', 'custom_rest')),
    api_endpoint TEXT,
    auth_credentials_encrypted TEXT,
    connection_status VARCHAR(32) DEFAULT 'connected' CHECK(connection_status IN ('connected', 'disconnected', 'error')),
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    website_id VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id VARCHAR(64),
    seo_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_site_slug UNIQUE(website_id, slug)
);

-- 4. ARTICLES & SEO CONTENT
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(64) PRIMARY KEY,
    website_id VARCHAR(64),
    user_id VARCHAR(64),
    category_id VARCHAR(64),
    category_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    seo_title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content_html TEXT NOT NULL,
    content_blocks_json JSONB,
    focus_keyword VARCHAR(255),
    secondary_keywords_json JSONB,
    lsi_keywords_json JSONB,
    meta_description TEXT,
    featured_image_url TEXT,
    featured_image_alt VARCHAR(255),
    social_image_url TEXT,
    canonical_url TEXT,
    robots_meta VARCHAR(64) DEFAULT 'index, follow',
    schema_type VARCHAR(64) DEFAULT 'Article',
    custom_schema_json JSONB,
    table_of_contents_json JSONB,
    faq_json JSONB,
    word_count INTEGER DEFAULT 0,
    read_time_minutes INTEGER DEFAULT 5,
    seo_score INTEGER DEFAULT 0,
    status VARCHAR(32) DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'published', 'trash')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ARTICLE REVISIONS
CREATE TABLE IF NOT EXISTS article_revisions (
    id VARCHAR(64) PRIMARY KEY,
    article_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    content_html TEXT NOT NULL,
    content_blocks_json JSONB,
    seo_score INTEGER,
    revision_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PRODUCTS CATALOGUE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    website_id VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    model VARCHAR(128),
    brand VARCHAR(128) NOT NULL,
    category VARCHAR(128) NOT NULL,
    sku VARCHAR(128) UNIQUE,
    price NUMERIC(10, 2) DEFAULT 0.0,
    availability VARCHAR(32) DEFAULT 'in_stock' CHECK(availability IN ('in_stock', 'out_of_stock', 'pre_order', 'discontinued')),
    short_description TEXT,
    description_html TEXT,
    specifications_json JSONB,
    featured_image_url TEXT,
    featured_image_alt VARCHAR(255),
    gallery_images_json JSONB,
    primary_brochure_pdf_id VARCHAR(64),
    datasheet_pdf_id VARCHAR(64),
    video_url TEXT,
    seo_title VARCHAR(255),
    meta_description TEXT,
    slug VARCHAR(255) NOT NULL UNIQUE,
    structured_data_json JSONB,
    is_featured INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS media_library (
    id VARCHAR(64) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(128) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    url_original TEXT NOT NULL,
    url_webp TEXT,
    url_thumbnail TEXT,
    alt_text VARCHAR(255),
    title VARCHAR(255),
    caption TEXT,
    folder VARCHAR(64) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PDF DOCUMENTS & DATASHEETS
CREATE TABLE IF NOT EXISTS pdf_documents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    category VARCHAR(64) DEFAULT 'brochures' CHECK(category IN ('brochures', 'datasheets', 'manuals', 'catalogues', 'specifications')),
    description TEXT,
    download_count INTEGER DEFAULT 0,
    associated_product_id VARCHAR(64),
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. KEYWORDS INTELLIGENCE
CREATE TABLE IF NOT EXISTS keywords (
    id VARCHAR(64) PRIMARY KEY,
    query VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(128),
    search_volume INTEGER,
    competition_score NUMERIC(5, 2),
    competition_level VARCHAR(32) CHECK(competition_level IN ('LOW', 'MEDIUM', 'HIGH', 'UNAVAILABLE')),
    cpc NUMERIC(8, 2),
    search_intent VARCHAR(32) CHECK(search_intent IN ('informational', 'commercial', 'transactional', 'navigational')),
    opportunity_score INTEGER,
    source VARCHAR(64) NOT NULL,
    data_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. GOOGLE SEARCH CONSOLE METRICS
CREATE TABLE IF NOT EXISTS gsc_metrics (
    id VARCHAR(64) PRIMARY KEY,
    website_id VARCHAR(64),
    date DATE NOT NULL,
    query VARCHAR(255) NOT NULL,
    page_url TEXT NOT NULL,
    country VARCHAR(16),
    device VARCHAR(32),
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    ctr NUMERIC(6, 4) DEFAULT 0.0,
    position NUMERIC(5, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. INTERNAL LINKS GRAPH
CREATE TABLE IF NOT EXISTS internal_links (
    id VARCHAR(64) PRIMARY KEY,
    source_type VARCHAR(64) NOT NULL,
    source_id VARCHAR(64) NOT NULL,
    source_url TEXT NOT NULL,
    target_type VARCHAR(64) NOT NULL,
    target_id VARCHAR(64),
    target_url TEXT NOT NULL,
    anchor_text VARCHAR(255) NOT NULL,
    is_contextual INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. SEO AUDITS & RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS seo_audits (
    id VARCHAR(64) PRIMARY KEY,
    website_id VARCHAR(64),
    audit_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_pages_crawled INTEGER DEFAULT 0,
    health_score INTEGER DEFAULT 0,
    critical_errors_count INTEGER DEFAULT 0,
    warnings_count INTEGER DEFAULT 0,
    notices_count INTEGER DEFAULT 0,
    raw_report_json JSONB
);

CREATE TABLE IF NOT EXISTS seo_recommendations (
    id VARCHAR(64) PRIMARY KEY,
    audit_id VARCHAR(64),
    url TEXT NOT NULL,
    category VARCHAR(64) NOT NULL CHECK(category IN ('technical', 'on_page', 'content', 'indexing', 'speed', 'internal_links')),
    priority VARCHAR(16) NOT NULL CHECK(priority IN ('HIGH', 'MEDIUM', 'LOW')),
    issue TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    recommended_fix TEXT NOT NULL,
    is_resolved INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. AUDIT & ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    user_name VARCHAR(255),
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    details_json JSONB,
    ip_address VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. AUTH SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
    token VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. LEADS AND ENQUIRIES
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    organization VARCHAR(255),
    product_interest VARCHAR(255),
    requirement_details TEXT,
    location VARCHAR(128),
    ip_address VARCHAR(64),
    source_page TEXT,
    status VARCHAR(32) DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'quoted', 'installed', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDICES FOR HIGH PERFORMANCE QUERYING
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_keywords_query ON keywords(query);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- SEED INITIAL SUPER ADMIN USER (Meenakshi@2026)
INSERT INTO users (id, name, email, password_hash, salt, role, is_active)
VALUES (
    'usr_superadmin',
    'Tingirikar Teja (Founder)',
    'admin@meenakshi.com',
    'c25e4c6c9a9d20c576594d9bfeff1c360811b7df02f06822fcbca36fec690ee853c0612c6a461e7e727e433435c2901db4b254a6db33320f2c4179373cf58bb0',
    '8c946e5eb1e92d8329b35bc451bdf849',
    'super_admin',
    1
) ON CONFLICT (email) DO NOTHING;

-- SEED DEFAULT CONNECTED WEBSITE
INSERT INTO websites (id, name, site_url, platform, connection_status)
VALUES (
    'site_meenakshi_main',
    'Meenakshi Technologies Official',
    'https://www.meenakshitechnologies.org',
    'native',
    'connected'
) ON CONFLICT (site_url) DO NOTHING;
