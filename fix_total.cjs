const fs = require('fs');

let modalsCode = fs.readFileSync('src/components/Modals.tsx', 'utf-8');
modalsCode = modalsCode.replace('សរុប (Total)', 'សរុប');
fs.writeFileSync('src/components/Modals.tsx', modalsCode);

let posCode = fs.readFileSync('src/components/POSSection.tsx', 'utf-8');
posCode = posCode.replace('សរុបចុងក្រោយ (Net Total)៖', 'សរុបចុងក្រោយ៖');
fs.writeFileSync('src/components/POSSection.tsx', posCode);

