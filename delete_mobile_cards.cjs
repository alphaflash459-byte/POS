const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const removeTarget = /\{\/\* Mobile Cards View \*\/\}.*?(?=\s*<\/>\s*\)\s*\}\s*<\/div>\s*<\/section>)/s;
code = code.replace(removeTarget, '');

fs.writeFileSync('src/components/LedgerSection.tsx', code);
