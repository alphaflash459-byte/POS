const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const filterUIRegex = /<div className="flex gap-1\.5 overflow-x-auto w-full sm:w-auto hide-scrollbar bg-white p-1 rounded-xl border border-slate-200">[\s\S]*?<\/div>/;
code = code.replace(filterUIRegex, '');

fs.writeFileSync('src/components/LedgerSection.tsx', code);
