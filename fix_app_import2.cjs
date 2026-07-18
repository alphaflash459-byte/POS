const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const profileModalEnd = /<div className="font-bold text-right text-slate-800 max-w-\[200px\] truncate">\{shopSettings\.address \|\| '-'}<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;

const profileReplacement = `<div className="font-bold text-right text-slate-800 max-w-[200px] truncate">{shopSettings.address || '-'}</div>
                </div>
              </div>

              {/* GSheets Setup in Profile */}
              {userRole !== 'admin' && (
                <GoogleSheetsSetup
                  sheetsWebhookUrl={sheetsWebhookUrl}
                  onSaveSheetsUrl={(url) => {
                    setSheetsWebhookUrl(url);
                    showToast('បានរក្សាទុក URL ជោគជ័យ!', 'success');
                  }}
                  onTestSheetsUrl={handleTestSheetsConnection}
                />
              )}
            </div>
          </div>
        </div>
      )}`;

code = code.replace(profileModalEnd, profileReplacement);

fs.writeFileSync('src/App.tsx', code);
