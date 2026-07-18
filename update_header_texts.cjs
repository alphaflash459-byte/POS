const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

code = code.replace(/សួស្តី, ភ្ញៀវ \(Guest\) !/g, 'សួស្តី, ភ្ញៀវ!');
code = code.replace(/ប្រព័ន្ធគ្រប់គ្រង \(Admin\)/g, 'អ្នកគ្រប់គ្រងប្រព័ន្ធ');

fs.writeFileSync('src/components/Header.tsx', code);
