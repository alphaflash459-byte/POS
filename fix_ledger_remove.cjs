const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

// Remove from imports
code = code.replace(/Plug,\s*Info,\s*Copy,\s*Check,/, '');

// Remove from interface
code = code.replace(/\s*sheetsWebhookUrl:\s*string;\s*onSaveSheetsUrl:\s*\(url: string\) => void;\s*onTestSheetsUrl:\s*\(\) => void;/, '');

// Remove from component props
code = code.replace(/\s*sheetsWebhookUrl,\s*onSaveSheetsUrl,\s*onTestSheetsUrl,/, '');

// Remove targetUrl, showCodeGuide, copiedCode states and codeSample
const removeStateRegex = /const \[targetUrl, setTargetUrl\] = useState\(sheetsWebhookUrl\);\s*const \[showCodeGuide, setShowCodeGuide\] = useState\(false\);\s*const \[copiedCode, setCopiedCode\] = useState\(false\);\s*const codeSample = `[\s\S]*?`;\s*const copyToClipboard = \(\) => \{[\s\S]*?^\s*\};\s*const handleSave = \(\) => \{[\s\S]*?^\s*\};/m;
code = code.replace(removeStateRegex, '');

// Remove the JSX block
const removeJsxRegex = /\{\/\* GSheets integration section \*\/\}[\s\S]*?(?=<\/div>\s*<\/section>\s*\);\s*\})/m;
code = code.replace(removeJsxRegex, '');

fs.writeFileSync('src/components/LedgerSection.tsx', code);
