const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');
code = code.replace(/\.print-modal-content \{/, `.print-modal-content {
    overflow: visible !important;`);
fs.writeFileSync('src/index.css', code);
