/**
 * LEAD MODEL
 * Manages customer enquiries, quotation requests, and lead statuses.
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');

class Lead {
  static getAll() {
    try {
      const filePath = path.join(config.paths.data, 'leads.json');
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error('[Lead Model] Read error:', err.message);
      return [];
    }
  }

  static getById(id) {
    const leads = this.getAll();
    return leads.find(l => l.id === id) || null;
  }

  static add(leadData) {
    const leads = this.getAll();
    leads.unshift(leadData);
    return this.saveAll(leads);
  }

  static saveAll(leads) {
    try {
      const filePath = path.join(config.paths.data, 'leads.json');
      fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('[Lead Model] Write error:', err.message);
      return false;
    }
  }
}

module.exports = Lead;

