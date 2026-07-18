const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const profileModalGSheets = /\{\/\* GSheets Setup in Profile \*\/\}\s*\{userRole !== 'admin' && \(\s*<GoogleSheetsSetup\s*sheetsWebhookUrl=\{sheetsWebhookUrl\}\s*onSaveSheetsUrl=\{\(url\) => \{\s*setSheetsWebhookUrl\(url\);\s*showToast\('បានរក្សាទុក URL ជោគជ័យ!', 'success'\);\s*\}\}\s*onTestSheetsUrl=\{handleTestSheetsConnection\}\s*\/>\s*\)\}/;

const replacement = `{/* GSheets Setup in Profile */}
              <GoogleSheetsSetup
                sheetsWebhookUrl={sheetsWebhookUrl}
                onSaveSheetsUrl={(url) => {
                  setSheetsWebhookUrl(url);
                  showToast('បានរក្សាទុក URL ជោគជ័យ!', 'success');
                }}
                onTestSheetsUrl={handleTestSheetsConnection}
              />`;

code = code.replace(profileModalGSheets, replacement);

fs.writeFileSync('src/App.tsx', code);
