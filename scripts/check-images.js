const fs = require('fs');
const path = require('path');
const products = require('../data/products.json');

console.log(`Checking ${products.length} products in data/products.json:\n`);

let missingCount = 0;
let existingCount = 0;

products.forEach((p, idx) => {
  const relPath = p.image.replace(/^\//, '');
  const fullPath = path.join(__dirname, '..', 'public', relPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  
  if (exists) {
    existingCount++;
    console.log(`${idx + 1}. [EXISTS] [${p.brand}] ${p.model || p.name} -> ${p.image} (${(size / 1024).toFixed(1)} KB)`);
  } else {
    missingCount++;
    console.log(`${idx + 1}. [MISSING] [${p.brand}] ${p.model || p.name} -> ${p.image}`);
  }
});

console.log(`\nExisting: ${existingCount}, Missing: ${missingCount}`);
