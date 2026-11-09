/**
 * CMS MANAGEMENT v2.0 - INTERNAL LINKING AUTOMATION
 * Analyzes content corpus, detects orphan pages, recommends contextual anchor texts,
 * and monitors internal PageRank flow.
 */

const { db } = require('../db');

/**
 * Recommend Internal Links for a given text or article
 */
function recommendInternalLinks(contentHtml = '', currentArticleId = null) {
  const articles = db.prepare(`SELECT id, title, slug, focus_keyword FROM articles WHERE status = 'published' AND id != ?`).all(currentArticleId || '');
  const products = db.prepare(`SELECT id, name, slug, brand FROM products`).all();

  const recommendations = [];
  const lowerContent = contentHtml.toLowerCase();

  // 1. Scan for relevant product mentions
  products.forEach(p => {
    const pName = p.name.toLowerCase();
    const pModel = p.slug.replace(/-/g, ' ');

    if (!lowerContent.includes(`/products/${p.slug}`)) {
      if (lowerContent.includes(pName) || (p.model && lowerContent.includes(p.model.toLowerCase()))) {
        recommendations.push({
          targetType: 'product',
          targetTitle: p.name,
          targetUrl: `/products/${p.slug}`,
          anchorTextSuggestion: p.name,
          context: `Detected product mention in text. Link to product catalogue page to boost commercial conversions.`
        });
      }
    }
  });

  // 2. Scan for relevant article topic mentions
  articles.forEach(a => {
    if (a.focus_keyword && lowerContent.includes(a.focus_keyword.toLowerCase()) && !lowerContent.includes(`/blog/${a.slug}`)) {
      recommendations.push({
        targetType: 'article',
        targetTitle: a.title,
        targetUrl: `/blog/${a.slug}`,
        anchorTextSuggestion: a.focus_keyword,
        context: `Target keyword "${a.focus_keyword}" appears in this article. Linking establishes a topic cluster.`
      });
    }
  });

  // 3. Scan for pillar guides
  if (!lowerContent.includes('/guide/biometric-dealers-hyderabad') && (lowerContent.includes('hyderabad') || lowerContent.includes('dealers'))) {
    recommendations.push({
      targetType: 'guide',
      targetTitle: 'Complete Guide to Biometric Dealers in Hyderabad',
      targetUrl: '/guide/biometric-dealers-hyderabad',
      anchorTextSuggestion: 'biometric dealers in Hyderabad',
      context: 'Pillar article link: reinforces domain authority for primary high-volume commercial keyword.'
    });
  }

  // 4. Scan for Location Pages
  if (!lowerContent.includes('/locations/balapur') && lowerContent.includes('balapur')) {
    recommendations.push({
      targetType: 'location',
      targetTitle: 'Balapur Business Branch',
      targetUrl: '/locations/balapur',
      anchorTextSuggestion: 'Meenakshi Technologies Balapur office',
      context: 'Local SEO target: pass regional geographical relevance.'
    });
  }

  return {
    recommendationsCount: recommendations.length,
    recommendations: recommendations.slice(0, 10),
    orphanPagesDetected: findOrphanPages()
  };
}

/**
 * Identify orphan pages (published pages with 0 internal links)
 */
function findOrphanPages() {
  const articles = db.prepare(`SELECT id, title, slug, content_html FROM articles WHERE status = 'published'`).all();
  const orphanArticles = [];

  articles.forEach(a => {
    const slug = a.slug;
    const isLinked = articles.some(other => other.id !== a.id && other.content_html.includes(slug));
    if (!isLinked) {
      orphanArticles.push({
        id: a.id,
        title: a.title,
        url: `/blog/${a.slug}`,
        issue: 'No other published article links to this post.',
        fix: 'Add at least 1 contextual link pointing to this article from a related post.'
      });
    }
  });

  return orphanArticles;
}

module.exports = {
  recommendInternalLinks,
  findOrphanPages
};
