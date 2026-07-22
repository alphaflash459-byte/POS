const fs = require('fs');

let modalsCode = fs.readFileSync('src/components/Modals.tsx', 'utf-8');

modalsCode = modalsCode.replace(
  '<Upload className="w-4 h-4 text-blue-600" /> Upload Image',
  '<Upload className="w-4 h-4 text-blue-600" /> បញ្ចូលរូបភាព'
);

modalsCode = modalsCode.replace(
  '> Category',
  '> ប្រភេទទំនិញ'
);

modalsCode = modalsCode.replace(
  '> Retail Price ($)',
  '> តម្លៃលក់ ($)'
);

fs.writeFileSync('src/components/Modals.tsx', modalsCode);
