const fs = require('fs');
const path = require('path');

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
  
  // A much simpler regex: replace ": Type;" with ": Relation<Type>;" if preceded by a relation decorator somewhere before it.
  // Actually, let's just replace all entity references. We know what they are.
  const entities = ['User', 'Customer', 'Address', 'Category', 'Collection', 'Product', 'ProductImage', 'Inventory', 'InventoryHistory', 'Order', 'OrderItem', 'Payment', 'Shipment', 'Review', 'ActivityLog'];
  
  for (const entity of entities) {
    // replace `name: Entity;` with `name: Relation<Entity>;`
    const regex1 = new RegExp(`:\\s*${entity}\\s*;`, 'g');
    content = content.replace(regex1, `: Relation<${entity}>;`);
    
    // replace `name: Entity[];` with `name: Relation<Entity>[];`
    const regex2 = new RegExp(`:\\s*${entity}\\[\\]\\s*;`, 'g');
    content = content.replace(regex2, `: Relation<${entity}>[];`);
  }
  
  fs.writeFileSync(file, content);
});
