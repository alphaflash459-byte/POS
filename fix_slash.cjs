const fs = require('fs');
let code = fs.readFileSync('src/components/InventorySection.tsx', 'utf-8');
code = code.replace('\\${selectedProduct.price.toFixed(2)}', '${selectedProduct.price.toFixed(2)}');
fs.writeFileSync('src/components/InventorySection.tsx', code);
