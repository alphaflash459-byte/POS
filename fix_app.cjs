const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove onExportSalesHistory prop from HistorySection
code = code.replace(/\s*onExportSalesHistory=\{handleExportSalesHistory\}/g, '');

// Import FileSpreadsheet correctly
// Let's check imports
const lucideMatch = code.match(/import\s+\{[^}]+\}\s+from\s+'lucide-react';/);
if (lucideMatch) {
  let imp = lucideMatch[0];
  if (!imp.includes('FileSpreadsheet')) {
    imp = imp.replace('}', ', FileSpreadsheet }');
    code = code.replace(lucideMatch[0], imp);
  }
}

fs.writeFileSync('src/App.tsx', code);
