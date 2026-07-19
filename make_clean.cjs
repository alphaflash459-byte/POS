const fs = require('fs');

function simplifyClasses(file) {
  let content = fs.readFileSync(file, 'utf-8');
  // Remove background gradients that make it look complex
  content = content.replace(/bg-gradient-to-br from-[a-z]+-\d+ to-[a-z]+-\d+/g, 'bg-white');
  content = content.replace(/shadow-[a-z]+(-\d+\/\d+)?/g, 'shadow-sm');
  content = content.replace(/border-slate-100/g, 'border-slate-200/60');
  content = content.replace(/rounded-3xl/g, 'rounded-2xl');
  content = content.replace(/text-2xl md:text-4xl/g, 'text-2xl md:text-3xl');
  fs.writeFileSync(file, content);
}

['src/components/HistorySection.tsx', 'src/components/InventorySection.tsx', 'src/components/LedgerSection.tsx', 'src/components/POSSection.tsx'].forEach(simplifyClasses);

