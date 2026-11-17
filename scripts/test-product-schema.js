/**
 * Google Search Console & Schema.org Product Structured Data Test Suite
 * Meenakshi Technologies - Production Verification
 */

const http = require('http');
const products = require('../data/products.json');

const BASE_URL = 'http://localhost:3000';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

function extractJsonLd(html) {
  const regex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(match[1].trim()));
    } catch (e) {
      blocks.push({ __parseError: e.message, raw: match[1] });
    }
  }
  return blocks;
}

async function runTests() {
  console.log('================================================================');
  console.log('   MEENAKSHI TECHNOLOGIES - PRODUCT SCHEMA VALIDATION SUITE    ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;
  const errors = [];

  // 1. Verify Catalog Page ItemList Schema
  console.log('--- 1. Testing Catalog Listing Page (/products) ---');
  try {
    const catalogRes = await get(`${BASE_URL}/products`);
    if (catalogRes.status !== 200) {
      throw new Error(`/products returned status ${catalogRes.status}`);
    }

    const jsonLds = extractJsonLd(catalogRes.body);
    const itemList = jsonLds.find(j => j['@type'] === 'ItemList');

    if (!itemList) {
      throw new Error('ItemList schema missing on /products');
    }
    if (itemList.numberOfItems !== products.length) {
      throw new Error(`ItemList numberOfItems mismatch: expected ${products.length}, got ${itemList.numberOfItems}`);
    }

    // Verify no incomplete Product objects are embedded in ItemList (which triggers GSC errors)
    const hasEmbeddedIncompleteProducts = itemList.itemListElement.some(item => 
      item.item && item.item['@type'] === 'Product' && !item.item.offers
    );

    if (hasEmbeddedIncompleteProducts) {
      throw new Error('ItemList contains incomplete Product objects without offers!');
    }

    console.log(`✓ /products: ItemList schema valid (${itemList.numberOfItems} items, zero invalid nested Product entities)`);
    passed++;
  } catch (err) {
    console.error(`✗ /products FAILED: ${err.message}`);
    failed++;
    errors.push(`/products: ${err.message}`);
  }

  // 2. Verify all 27 Product Detail Pages
  console.log('\n--- 2. Testing All 27 Product Detail Pages ---');
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const url = `${BASE_URL}/products/${p.slug}`;
    try {
      const res = await get(url);
      if (res.status !== 200) {
        throw new Error(`HTTP ${res.status}`);
      }

      const jsonLds = extractJsonLd(res.body);

      // Check for JSON parse errors
      const parseError = jsonLds.find(j => j.__parseError);
      if (parseError) {
        throw new Error(`JSON-LD parse syntax error: ${parseError.__parseError}`);
      }

      // Check Product schema
      const prodSchema = jsonLds.find(j => j['@type'] === 'Product');
      if (!prodSchema) {
        throw new Error('Missing @type: Product schema');
      }

      // Validate core required fields
      if (!prodSchema.name || prodSchema.name.trim() === '') {
        throw new Error('Product schema missing name');
      }
      if (!prodSchema.description || prodSchema.description.trim() === '') {
        throw new Error('Product schema missing description');
      }
      if (!prodSchema.image || !Array.isArray(prodSchema.image) || prodSchema.image.length === 0) {
        throw new Error('Product schema missing image array');
      }
      if (!prodSchema.image[0].startsWith('https://meenakshitechnologies.org')) {
        throw new Error(`Product image URL is not canonical: ${prodSchema.image[0]}`);
      }
      if (!prodSchema.url || !prodSchema.url.startsWith('https://meenakshitechnologies.org/products/')) {
        throw new Error(`Product canonical URL invalid: ${prodSchema.url}`);
      }
      if (!prodSchema.sku || prodSchema.sku.trim() === '') {
        throw new Error('Product schema missing SKU');
      }
      if (!prodSchema.brand || prodSchema.brand['@type'] !== 'Brand' || !prodSchema.brand.name) {
        throw new Error('Product schema missing valid Brand entity');
      }
      if (!prodSchema.category) {
        throw new Error('Product schema missing category');
      }

      // Verify Offer logic
      if (prodSchema.offers) {
        if (!prodSchema.offers.price || isNaN(Number(prodSchema.offers.price))) {
          throw new Error(`Offer missing valid numeric price: ${prodSchema.offers.price}`);
        }
        if (Number(prodSchema.offers.price) <= 0) {
          throw new Error('Offer has invalid price <= 0');
        }
        if (prodSchema.offers.priceCurrency !== 'INR') {
          throw new Error(`Offer priceCurrency invalid: ${prodSchema.offers.priceCurrency}`);
        }
        if (!prodSchema.offers.availability) {
          throw new Error('Offer missing availability');
        }
        if (!prodSchema.offers.itemCondition) {
          throw new Error('Offer missing itemCondition');
        }
      }

      // Ensure NO broken AggregateOffer exists
      if (prodSchema.offers && prodSchema.offers['@type'] === 'AggregateOffer') {
        throw new Error('AggregateOffer detected without lowPrice/highPrice');
      }

      // Check BreadcrumbList schema
      const breadcrumbSchema = jsonLds.find(j => j['@type'] === 'BreadcrumbList');
      if (!breadcrumbSchema) {
        throw new Error('Missing BreadcrumbList schema');
      }
      if (!Array.isArray(breadcrumbSchema.itemListElement) || breadcrumbSchema.itemListElement.length !== 3) {
        throw new Error(`BreadcrumbList items count mismatch: ${breadcrumbSchema.itemListElement?.length}`);
      }

      console.log(`✓ [${i + 1}/${products.length}] ${p.slug} | SKU: ${prodSchema.sku} | Offer: ${prodSchema.offers ? '₹' + prodSchema.offers.price : 'Enquiry (Clean)'}`);
      passed++;
    } catch (err) {
      console.error(`✗ [${i + 1}/${products.length}] ${p.slug} FAILED: ${err.message}`);
      failed++;
      errors.push(`${p.slug}: ${err.message}`);
    }
  }

  // 3. Test Dynamic Product Schema API (/api/products/:slug/schema)
  console.log('\n--- 3. Testing Dynamic Schema API Endpoint ---');
  try {
    const apiRes = await get(`${BASE_URL}/api/products/essl-k90-pro-biometric-attendance/schema`);
    if (apiRes.status !== 200) {
      throw new Error(`API returned status ${apiRes.status}`);
    }
    const apiData = JSON.parse(apiRes.body);
    if (!apiData.product || apiData.product['@type'] !== 'Product') {
      throw new Error('API failed to return valid Product schema');
    }
    console.log(`✓ /api/products/:slug/schema: Dynamic generator verified successfully (SKU: ${apiData.product.sku})`);
    passed++;
  } catch (err) {
    console.error(`✗ API test FAILED: ${err.message}`);
    failed++;
    errors.push(`API test: ${err.message}`);
  }

  console.log('\n================================================================');
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED (TOTAL CHECKS: ${passed + failed})`);
  console.log('================================================================');

  if (failed > 0) {
    console.error('\nFailures summary:');
    errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
  } else {
    console.log('\n>>> ALL PRODUCT STRUCTURED DATA TESTS PASSED WITH 100% SUCCESS <<<\n');
  }
}

runTests();

