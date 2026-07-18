const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const regex = /<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 z-10">[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(regex, '');

fs.writeFileSync('src/components/LedgerSection.tsx', code);
