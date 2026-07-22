const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');
code = code.replace(/\.print-modal-root \{[\s\S]*?\}/, `.print-modal-root {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    background: transparent !important;
    display: block !important;
    padding: 0 !important;
    width: 100% !important;
    height: auto !important;
  }`);
fs.writeFileSync('src/index.css', code);
