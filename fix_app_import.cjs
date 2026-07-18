const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// import GoogleSheetsSetup
code = code.replace("import AdminPanel from './components/AdminPanel.tsx';", "import AdminPanel from './components/AdminPanel.tsx';\nimport GoogleSheetsSetup from './components/GoogleSheetsSetup.tsx';");

// Inside profile modal, after store info block
const replaceTarget = /<\/div>\s*<\/div>\s*\{\/\* Support Developer \*\/\}/;
const replacement = `</div>\n              </div>\n              {/* GSheets Setup in Profile */}\n              {userRole !== 'admin' && (\n                <GoogleSheetsSetup\n                  sheetsWebhookUrl={sheetsWebhookUrl}\n                  onSaveSheetsUrl={(url) => {\n                    setSheetsWebhookUrl(url);\n                    showToast('បានរក្សាទុក URL ជោគជ័យ!', 'success');\n                  }}\n                  onTestSheetsUrl={handleTestSheetsConnection}\n                />\n              )}\n\n              {/* Support Developer */}`;

code = code.replace(replaceTarget, replacement);

fs.writeFileSync('src/App.tsx', code);
