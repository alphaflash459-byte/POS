const fs = require('fs');

let modalsCode = fs.readFileSync('src/components/Modals.tsx', 'utf-8');

modalsCode = modalsCode.replace(
  'Retail Price ($)',
  'តម្លៃលក់ ($)'
);
modalsCode = modalsCode.replace(
  'Category',
  'ប្រភេទទំនិញ'
);

// We should also check for the RestockModal. Did it have cost?
const restockCostRegex = /<div className="space-y-1.5">\s*<label[^>]*>\s*តម្លៃដើម[^<]*<\/label>\s*<input[^>]*value=\{cost[^>]*onChange=\{[^>]*setCost[^>]*\/>\s*<\/div>/;

modalsCode = modalsCode.replace(restockCostRegex, '');
fs.writeFileSync('src/components/Modals.tsx', modalsCode);
