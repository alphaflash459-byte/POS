const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const regex = /<button[\s\S]*?onClick=\{onManualSync\}[\s\S]*?<\/button>\s*<button[\s\S]*?onClick=\{onExportCurrentStock\}[\s\S]*?<\/button>\s*<button[\s\S]*?onClick=\{onExportStockLogs\}[\s\S]*?<\/button>/m;

code = code.replace(regex, '');

// Also remove from props
code = code.replace(/\s*onManualSync:\s*\(\) => void;\s*onExportStockLogs:\s*\(\) => void;\s*onExportCurrentStock:\s*\(\) => void;/m, '');
code = code.replace(/\s*onManualSync,\s*onExportStockLogs,\s*onExportCurrentStock,/m, '');

fs.writeFileSync('src/components/LedgerSection.tsx', code);
