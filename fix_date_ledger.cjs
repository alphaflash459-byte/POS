const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const oldRegex = /<span className="block">\{new Date\(log\.timestamp\)\.toLocaleString\('en-GB', \{ day: '2-digit', month: '2-digit', year: 'numeric' \}\)\}<\/span>\s*<span className="block text-\[8px\] md:text-\[10px\] font-mono mt-0\.5">\{new Date\(log\.timestamp\)\.toLocaleString\('en-US', \{ hour: 'numeric', minute: '2-digit', hour12: true \}\)\}<\/span>/g;
const newStr = `<span className="block font-medium">{new Date(log.timestamp).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>`;

code = code.replace(oldRegex, newStr);

fs.writeFileSync('src/components/LedgerSection.tsx', code);
