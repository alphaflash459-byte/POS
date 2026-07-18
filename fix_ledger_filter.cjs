const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const filterBlock = /<div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto custom-scroll w-full sm:w-auto">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Dynamic logs listing \*\/\}/;

code = code.replace(filterBlock, `</div>\n\n        {/* Dynamic logs listing */}`);

fs.writeFileSync('src/components/LedgerSection.tsx', code);
