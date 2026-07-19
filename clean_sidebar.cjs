const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

code = code.replace('"ប្រព័ន្ធគ្រប់គ្រង (Admin)"', '"ប្រព័ន្ធគ្រប់គ្រង"');
code = code.replace('"Admin Dashboard"', '"អ្នកគ្រប់គ្រង"');
code = code.replace('"POS SYSTEM"', '"ប្រព័ន្ធលក់ទំនិញ"');

fs.writeFileSync('src/components/Sidebar.tsx', code);
