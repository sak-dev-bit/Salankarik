const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.entity.ts')) {
      results.push(file);
    }
  });
  return results;
}

walk('src').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const entities = ['User', 'Customer', 'Address', 'Category', 'Collection', 'Product', 'ProductImage', 'Inventory', 'InventoryHistory', 'Order', 'OrderItem', 'Payment', 'Shipment', 'Review', 'ActivityLog'];
  
  for (const entity of entities) {
    // If the file exports the entity, skip converting it
    if (content.includes(`export class ${entity}`)) continue;
    
    // Convert import { Entity } to import type { Entity }
    const regex = new RegExp(`import\\s+\\{[^}]*\\b${entity}\\b[^}]*\\}\\s+from\\s+['"][^'"]+['"];`, 'g');
    content = content.replace(regex, (match) => {
      if (match.includes('import type')) return match;
      return match.replace('import {', 'import type {');
    });
  }
  
  fs.writeFileSync(file, content);
});
