const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const replacement = `  const [searchText, setSearchText] = useState('');
  const [ledgerType, setLedgerType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const filteredLogs = stockLogs.filter((log) => {`;

code = code.replace(/const filteredLogs = stockLogs.filter\(\(log\) => \{/, replacement);

fs.writeFileSync('src/components/LedgerSection.tsx', code);
