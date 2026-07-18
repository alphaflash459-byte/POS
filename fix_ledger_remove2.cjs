const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

// The regex I used earlier failed to match properly because of the \n vs whitespace differences.
const removeTarget = /const \[targetUrl, setTargetUrl\] = useState\(sheetsWebhookUrl\);[\s\S]*?const copyToClipboard = \(\) => \{[\s\S]*?\};/m;
code = code.replace(removeTarget, '');

fs.writeFileSync('src/components/LedgerSection.tsx', code);
