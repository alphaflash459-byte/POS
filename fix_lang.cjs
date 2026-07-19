const fs = require('fs');

let historyCode = fs.readFileSync('src/components/HistorySection.tsx', 'utf-8');
historyCode = historyCode.replace('វិក្កយបត្រសរុប (Total Sales)', 'វិក្កយបត្រសរុប');
historyCode = historyCode.replace('ចំណូលសរុប (Revenue)', 'ចំណូលសរុប');
historyCode = historyCode.replace('ប្រវត្តិនៃការលក់ និងវិក្កយបត្រ (Sales Order History Log)', 'ប្រវត្តិនៃការលក់ និងវិក្កយបត្រ');
fs.writeFileSync('src/components/HistorySection.tsx', historyCode);

let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebarCode = sidebarCode.replace('label: "Ledger"', 'label: "កំណត់ត្រា"');
fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace('ទាញយក Excel (Export Sales)', 'ទាញយក Excel');
appCode = appCode.replace('ចេញពី Ledger មែនទេ?', 'ចេញពី កំណត់ត្រា មែនទេ?');
fs.writeFileSync('src/App.tsx', appCode);

