/**
 * MEENAKSHI TECHNOLOGIES - DEEP SEO & CONTENT AUDIT TOOL
 * Crawls and validates all website routes, metadata, headings, schema, word counts, images, and internal links.
 */

const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

function fetchPage(path) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, statusCode: res.statusCode, html: data, headers: res.headers }));
    }).on('error', (err) => resolve({ path, statusCode: 500, error: err.message, html: '' }));
  });
}

function extractMetadata(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const description = metaDescMatch ? metaDescMatch[1].trim() : '';

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  const h3Matches = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];

  // Plain text word count (strip scripts, styles, tags)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : html;
  const cleanText = bodyContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;

  // Images
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  let imagesWithoutAlt = 0;
  imgMatches.forEach(img => {
    if (!/alt=["'][^"']*["']/i.test(img) || /alt=["']\s*["']/i.test(img)) {
      imagesWithoutAlt++;
    }
  });

  // Schema types
  const schemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const schemaTypes = [];
  schemaMatches.forEach(s => {
    const jsonText = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed['@graph']) {
        parsed['@graph'].forEach(g => schemaTypes.push(g['@type']));
      } else if (parsed['@type']) {
        schemaTypes.push(parsed['@type']);
      }
    } catch (e) {
      schemaTypes.push('INVALID_JSON');
    }
  });

  // Commercial CTAs
  const hasPhoneCta = /tel:\+916301593064/i.test(html);
  const hasWhatsAppCta = /wa\.me/i.test(html);
  const hasEnquiryForm = /enquiry-form/i.test(html) || /id=["']enquiryForm["']/i.test(html);

  return {
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    canonical,
    h1Count: h1Matches.length,
    h1Text: h1Matches.map(h => h.replace(/<[^>]+>/g, '').trim()),
    h2Count: h2Matches.length,
    h3Count: h3Matches.length,
    wordCount,
    totalImages: imgMatches.length,
    imagesWithoutAlt,
    schemaTypes: [...new Set(schemaTypes)],
    hasPhoneCta,
    hasWhatsAppCta,
    hasEnquiryForm
  };
}

async function runAudit() {
  console.log('Fetching sitemap.xml...');
  const sitemapRes = await fetchPage('/sitemap.xml');
  const urlsInSitemap = [];
  const locMatches = sitemapRes.html.match(/<loc>([^<]+)<\/loc>/g) || [];
  locMatches.forEach(m => {
    const raw = m.replace(/<loc>/, '').replace(/<\/loc>/, '').trim();
    const urlObj = new URL(raw);
    urlsInSitemap.push(urlObj.pathname);
  });

  console.log(`Discovered ${urlsInSitemap.length} URLs in sitemap.`);

  const auditResults = [];

  for (const path of urlsInSitemap) {
    const page = await fetchPage(path);
    const meta = extractMetadata(page.html);
    auditResults.push({
      path,
      statusCode: page.statusCode,
      ...meta
    });
    console.log(`[${page.statusCode}] ${path} | Words: ${meta.wordCount} | H1s: ${meta.h1Count} | Schema: ${meta.schemaTypes.join(', ')}`);
  }

  // Summary analysis
  const issues = [];
  auditResults.forEach(r => {
    if (r.statusCode !== 200) {
      issues.push({ path: r.path, issue: `Non-200 HTTP Status: ${r.statusCode}`, severity: 'CRITICAL' });
    }
    if (r.h1Count === 0) {
      issues.push({ path: r.path, issue: 'Missing H1 heading', severity: 'HIGH' });
    } else if (r.h1Count > 1) {
      issues.push({ path: r.path, issue: `Multiple H1 headings (${r.h1Count})`, severity: 'MEDIUM' });
    }
    if (!r.title || r.titleLength < 30 || r.titleLength > 70) {
      issues.push({ path: r.path, issue: `Suboptimal Title Length: ${r.titleLength} chars ("${r.title}")`, severity: 'MEDIUM' });
    }
    if (!r.description || r.descriptionLength < 80 || r.descriptionLength > 170) {
      issues.push({ path: r.path, issue: `Suboptimal Description Length: ${r.descriptionLength} chars`, severity: 'MEDIUM' });
    }
    if (!r.canonical.startsWith('https://meenakshitechnologies.org')) {
      issues.push({ path: r.path, issue: `Incorrect Canonical URL: ${r.canonical}`, severity: 'HIGH' });
    }
    if (r.imagesWithoutAlt > 0) {
      issues.push({ path: r.path, issue: `${r.imagesWithoutAlt} image(s) missing alt text`, severity: 'MEDIUM' });
    }
    if (r.wordCount < 400 && !r.path.includes('404')) {
      issues.push({ path: r.path, issue: `Thin Content: only ${r.wordCount} words`, severity: 'HIGH' });
    }
  });

  const output = {
    totalUrls: auditResults.length,
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issuesSummary: issues,
    pages: auditResults
  };

  fs.writeFileSync('data/seo-audit-results.json', JSON.stringify(output, null, 2));
  console.log(`\nAudit Complete! Found ${issues.length} potential issues across ${auditResults.length} pages.`);
  console.log('Results saved to data/seo-audit-results.json');
}

runAudit();
