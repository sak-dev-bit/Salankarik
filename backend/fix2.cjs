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
  
  content = content.replace(/, Relation/g, '');
  if (!content.includes('import type { Relation }')) {
    content = "import type { Relation } from 'typeorm';\n" + content;
  }
  
  // also change imports of other entities to "import type" if they are only used as relations!
  // Wait, if they are used in `() => Entity`, they might need to be value imports! But wait, `() => Entity` works with `import type` if TypeScript doesn't erase it? No, TS erases `import type`, so `() => Entity` will fail at runtime: "Entity is not defined"!
  // BUT TypeORM allows passing a string `() => 'Entity'`!
  // So I can replace `() => Entity` with `() => 'Entity'`!
  
  content = content.replace(/\(\) => ([A-Z][a-zA-Z0-9_]+)/g, "() => '$1'");
  
  fs.writeFileSync(file, content);
});
