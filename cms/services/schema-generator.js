/**
 * CMS MANAGEMENT v2.0 - ADVANCED SCHEMA GENERATOR
 * Generates Google-compliant JSON-LD structured data.
 * Adheres strictly to Google Search Central guidelines with zero fake ratings or reviews.
 */

function generateSchema({
  type = 'Article',
  siteUrl = 'http://localhost:3000',
  data = {}
}) {
  const baseOrg = {
    '@type': 'Organization',
    'name': 'Meenakshi Technologies',
    'url': siteUrl,
    'logo': `${siteUrl}/images/logo.png`,
    'founder': {
      '@type': 'Person',
      'name': 'Tingirikar Teja'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+91-6301593064',
      'contactType': 'customer support',
      'areaServed': 'IN'
    }
  };

  switch (type) {
    case 'Article':
    case 'BlogPosting': {
      const {
        title = 'Biometric Guide',
        headline = title,
        url = siteUrl,
        datePublished = new Date().toISOString(),
        dateModified = new Date().toISOString(),
        authorName = 'Tingirikar Teja',
        description = '',
        imageUrl = `${siteUrl}/images/logo.png`
      } = data;

      return {
        '@context': 'https://schema.org',
        '@type': type,
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': url.startsWith('http') ? url : `${siteUrl}${url}`
        },
        'headline': headline,
        'description': description,
        'image': imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
        'datePublished': datePublished,
        'dateModified': dateModified,
        'author': {
          '@type': 'Person',
          'name': authorName,
          'jobTitle': 'Founder, Meenakshi Technologies'
        },
        'publisher': baseOrg
      };
    }

    case 'Product': {
      const {
        name = 'Biometric Machine',
        model = '',
        brand = 'eSSL',
        sku = '',
        description = '',
        imageUrl = `${siteUrl}/images/logo.png`,
        price = 0,
        currency = 'INR',
        availability = 'InStock',
        url = siteUrl
      } = data;

      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': name,
        'model': model,
        'brand': {
          '@type': 'Brand',
          'name': brand
        },
        'sku': sku || undefined,
        'image': imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
        'description': description,
        'offers': {
          '@type': 'Offer',
          'url': url.startsWith('http') ? url : `${siteUrl}${url}`,
          'priceCurrency': currency,
          'price': price > 0 ? price.toFixed(2) : undefined,
          'availability': availability === 'out_of_stock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          'seller': baseOrg
        }
      };
    }

    case 'LocalBusiness': {
      const {
        name = 'Meenakshi Technologies',
        address = 'Near Gandhi Statue, 18-7-751, Outside Gowlipura, Hyderabad, Telangana 500053',
        telephone = '+91-6301593064',
        latitude = 17.3459799,
        longitude = 78.479843
      } = data;

      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': name,
        'image': `${siteUrl}/images/logo.png`,
        'telephone': telephone,
        'email': 'meenakshitechnologies65@gmail.com',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': address,
          'addressLocality': 'Hyderabad',
          'addressRegion': 'Telangana',
          'postalCode': '500053',
          'addressCountry': 'IN'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': latitude,
          'longitude': longitude
        },
        'url': siteUrl,
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            'opens': '09:00',
            'closes': '20:00'
          }
        ]
      };
    }

    case 'FAQPage': {
      const { faqs = [] } = data;
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(f => ({
          '@type': 'Question',
          'name': f.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.answer
          }
        }))
      };
    }

    default:
      return baseOrg;
  }
}

module.exports = {
  generateSchema
};

