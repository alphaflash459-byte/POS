const fs = require('fs');

function extractText(file) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(/>[^<]*[\u1780-\u17FF][^<]*</g);
  if (matches) {
    console.log(`\n--- ${file} ---`);
    matches.forEach(m => console.log(m.replace(/^>|<\/$/g, '').trim()));
  }
}

['src/App.tsx', 'src/components/Header.tsx', 'src/components/Sidebar.tsx', 'src/components/POSSection.tsx', 'src/components/InventorySection.tsx', 'src/components/HistorySection.tsx', 'src/components/LedgerSection.tsx', 'src/components/Modals.tsx', 'src/components/LoginScreen.tsx'].forEach(extractText);
