const fs = require('fs');

let adminCode = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');
adminCode = adminCode.replace('មុខងារចូលមើលហាងត្រូវបានបិទសម្រាប់ Dashboard រួម', 'មុខងារចូលមើលហាងត្រូវបានបិទសម្រាប់ទិដ្ឋភាពរួម');
fs.writeFileSync('src/components/AdminPanel.tsx', adminCode);

