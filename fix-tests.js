const fs = require('fs');

const files = [
  'tests/api/products.test.ts',
  'tests/api/inventory.test.ts',
  'tests/lib/analytics.test.ts',
  'tests/api/categories.test.ts'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/images: \["img\.jpg"\]/g, 'images: ["http://example.com/img.jpg"], description: "This is a valid test description"');
    
    // Some payloads use { name: "Prod", price: 10, category: categoryId } without images
    content = content.replace(/const payload = {([\s\S]*?)name: "New Prod"([\s\S]*?)};/g, 
      'const payload = {$1name: "New Prod"$2, description: "This is a valid test description", images: ["http://example.com/img.jpg"]};');
    
    // Also fix the 400 cases where price <= 0 etc.
    content = content.replace(/price: 0/g, 'price: 0, description: "This is a valid test description", images: ["http://example.com/img.jpg"]');
    content = content.replace(/images: \["1", "2", "3", "4", "5"\]/g, 'images: ["http://ex.com/1", "http://ex.com/2", "http://ex.com/3", "http://ex.com/4", "http://ex.com/5"], description: "This is a valid test description"');
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
