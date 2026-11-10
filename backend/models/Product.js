/**
 * PRODUCT MODEL
 * Manages biometric hardware, access control systems, specifications, and datasheets.
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');

class Product {
  static getAll() {
    try {
      const filePath = path.join(config.paths.data, 'products.json');
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error('[Product Model] Read error:', err.message);
      return [];
    }
  }

  static getBySlug(slug) {
    const products = this.getAll();
    return products.find(p => p.slug === slug || p.id === slug) || null;
  }

  static saveAll(products) {
    try {
      const filePath = path.join(config.paths.data, 'products.json');
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('[Product Model] Write error:', err.message);
      return false;
    }
  }
}

module.exports = Product;

