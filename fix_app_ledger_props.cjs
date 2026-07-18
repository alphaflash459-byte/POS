const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/<LedgerSection\s*stockLogs=\{stockLogs\}\s*sheetsWebhookUrl=\{sheetsWebhookUrl\}\s*onSaveSheetsUrl=\{[\s\S]*?\}\s*onTestSheetsUrl=\{handleTestSheetsConnection\}/m, `<LedgerSection\n                stockLogs={stockLogs}`);

fs.writeFileSync('src/App.tsx', code);
