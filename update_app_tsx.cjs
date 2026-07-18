const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove props from LedgerSection
code = code.replace(/\s*onManualSync=\{handleManualSyncAll\}\s*onExportStockLogs=\{handleExportStockLogs\}\s*onExportCurrentStock=\{handleExportCurrentStock\}/, '');

// Add props to GoogleSheetsSetup
const setupReplacement = `<GoogleSheetsSetup
                sheetsWebhookUrl={sheetsWebhookUrl}
                onSaveSheetsUrl={(url) => {
                  setSheetsWebhookUrl(url);
                  showToast('បានរក្សាទុក URL ជោគជ័យ!', 'success');
                }}
                onTestSheetsUrl={handleTestSheetsConnection}
                onManualSync={handleManualSyncAll}
                onExportStockLogs={handleExportStockLogs}
                onExportCurrentStock={handleExportCurrentStock}
              />`;
code = code.replace(/<GoogleSheetsSetup[\s\S]*?onTestSheetsUrl=\{handleTestSheetsConnection\}\s*\/>/, setupReplacement);

fs.writeFileSync('src/App.tsx', code);
