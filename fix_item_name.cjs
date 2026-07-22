const fs = require('fs');

let modalsCode = fs.readFileSync('src/components/Modals.tsx', 'utf-8');

modalsCode = modalsCode.replace(
  'Item Name',
  'ឈ្មោះទំនិញ'
);

fs.writeFileSync('src/components/Modals.tsx', modalsCode);
