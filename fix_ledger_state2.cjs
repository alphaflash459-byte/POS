const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const filterRegex = /const \[ledgerType, setLedgerType\] = useState\s*<\s*'ALL'\s*\|\s*'IN'\s*\|\s*'OUT'\s*>\s*\(\s*'ALL'\s*\);/;
code = code.replace(filterRegex, '');

// Also remove its usage in the filter
const filterUsage = /const matchesType = ledgerType === 'ALL' \|\| log\.type === ledgerType;\s*return matchesSearch && matchesType;/;
code = code.replace(filterUsage, 'return matchesSearch;');

fs.writeFileSync('src/components/LedgerSection.tsx', code);
