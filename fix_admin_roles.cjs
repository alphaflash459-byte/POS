const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(/{u\.role === 'admin' \? 'Admin' : 'User'}/g, "{u.role === 'admin' ? 'អ្នកគ្រប់គ្រង' : 'អ្នកប្រើប្រាស់'}");
code = code.replace(/{u\.username \? u\.username\[0\]\.toUpperCase\(\) : 'U'}/g, "{u.username ? u.username[0].toUpperCase() : 'អ'}");

fs.writeFileSync('src/components/AdminPanel.tsx', code);
