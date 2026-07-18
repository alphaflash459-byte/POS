const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

code = code.replace(/\s*CloudUpload,\s*Download,/, '');
code = code.replace(/\s*FileDown/, '');

fs.writeFileSync('src/components/LedgerSection.tsx', code);
