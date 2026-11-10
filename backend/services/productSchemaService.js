/**
 * Centralized Product Schema Generator Service
 * Meenakshi Technologies - Hyderabad
 *
 * Implements Google Search Console & Schema.org compliant structured data.
 * Zero fabricated reviews, ratings, or prices.
 */

const CANONICAL_BASE_URL = 'https://meenakshitechnologies.in';

/**
 * Generate canonical Product JSON-LD structured data.
 * @param {Object} product - Product data object
 * @param {string} [baseUrl] - Canonical website domain URL
 * @returns {Object} Schema.org Product object
 */
function generateProductSchema(product, baseUrl = CANONICAL_BASE_URL) {
  if (!product) return null;

  const productUrl = `${baseUrl}/products/${product.slug}`;
  const imageUrl = product.image
    ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
    : `${baseUrl}/images/products/essl-k90-pro.png`;

  // Compute clean, authentic SKU if not explicitly saved
  const sku = product.sku || (product.model 
    ? `${(product.brand || 'MT').toUpperCase()}-${product.model.replace(/[^a-zA-Z0-9]+/g, '-')}`
    : (product.id ? product.id.toUpperCase() : `MT-${product.slug}`));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.shortDesc || product.tagline || product.name,
    'image': [ imageUrl ],
    'url': productUrl,
    'sku': sku,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'Meenakshi Technologies'
    },
    'category': product.category || 'Biometric Attendance & Access Control Systems'
  };

  if (product.model) {
    schema.model = product.model;
  }

  // Handle Offer generation strictly adhering to Google Search Console guidelines
  const numericPrice = product.price ? Number(product.price) : 0;
  if (numericPrice > 0) {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    schema.offers = {
      '@type': 'Offer',
      'url': productUrl,
      'priceCurrency': product.currency || 'INR',
      'price': numericPrice.toFixed(2),
      'availability': (product.inStock === false || product.availability === 'out_of_stock')
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      'itemCondition': product.condition === 'UsedCondition'
        ? 'https://schema.org/UsedCondition'
        : 'https://schema.org/NewCondition',
      'priceValidUntil': nextYear.toISOString().split('T')[0],
      'seller': {
        '@type': 'Organization',
        'name': 'Meenakshi Technologies',
        'url': baseUrl
      }
    };
  }

  // Genuine customer reviews (only when authentic, never fabricated)
  if (product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0) {
    schema.review = product.reviews.map(r => ({
      '@type': 'Review',
      'author': {
        '@type': 'Person',
        'name': r.author
      },
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': r.rating,
        'bestRating': '5'
      },
      'reviewBody': r.comment
    }));
  }

  // Genuine aggregate ratings (only when authentic, never manufactured)
  if (product.aggregateRating && product.aggregateRating.ratingValue && product.aggregateRating.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': product.aggregateRating.ratingValue,
      'reviewCount': product.aggregateRating.reviewCount,
      'bestRating': '5',
      'worstRating': '1'
    };
  }

  return schema;
}

/**
 * Generate separate BreadcrumbList structured data for a product.
 * @param {Object} product - Product data object
 * @param {string} [baseUrl] - Canonical website domain URL
 * @returns {Object} Schema.org BreadcrumbList object
 */
function generateProductBreadcrumbs(product, baseUrl = CANONICAL_BASE_URL) {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${baseUrl}/`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Products',
        'item': `${baseUrl}/products`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': product.name,
        'item': `${baseUrl}/products/${product.slug}`
      }
    ]
  };
}

/**
 * Generate standard, Google-compliant ItemList schema for catalog pages.
 * Eliminates duplicate/incomplete nested Product entities from listing pages.
 * @param {Array} products - Array of product objects
 * @param {string} [baseUrl] - Canonical website domain URL
 * @returns {Object} Schema.org ItemList object
 */
function generateCatalogItemList(products = [], baseUrl = CANONICAL_BASE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Meenakshi Technologies Biometric & Access Control Catalog 2026',
    'description': 'Verified manufacturer specifications for genuine eSSL and BioMax biometric attendance machines, AI face recognition terminals, and door access controllers in Hyderabad.',
    'numberOfItems': products.length,
    'itemListElement': products.map((prod, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': prod.name,
      'url': `${baseUrl}/products/${prod.slug}`
    }))
  };
}

module.exports = {
  CANONICAL_BASE_URL,
  generateProductSchema,
  generateProductBreadcrumbs,
  generateCatalogItemList
};
