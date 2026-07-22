const fs = require('fs');
let code = fs.readFileSync('src/components/Modals.tsx', 'utf-8');
code = code.replace('Upload QR Block', 'បញ្ចូលរូប QR');
fs.writeFileSync('src/components/Modals.tsx', code);
