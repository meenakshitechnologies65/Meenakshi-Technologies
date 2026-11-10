const fs = require('fs');
const path = require('path');

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        scan(full);
      }
    } else if (entry.isFile() && (full.endsWith('.ejs') || full.endsWith('.js') || full.endsWith('.html'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('"Product"') || content.includes("'Product'")) {
        console.log('Product schema match in:', full);
      }
    }
  }
}

scan('.');

