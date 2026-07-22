const fs = require('fs');
let code = fs.readFileSync('src/components/Modals.tsx', 'utf-8');
code = code.replace('setប្រភេទទំនិញ', 'setCategory');
fs.writeFileSync('src/components/Modals.tsx', code);
