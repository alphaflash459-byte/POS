const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');
code = code.replace(/@media print \{[\s\S]*\}\}/, `@media print {
  .print-hidden, .print\\\\:hidden {
    display: none !important;
  }
  
  body, html {
    background-color: white !important;
    height: auto !important;
    overflow: visible !important;
  }

  .print-modal-root {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    background: transparent !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    padding: 0 !important;
  }
  
  .print-modal-content {
    box-shadow: none !important;
    max-height: none !important;
    border: none !important;
    border-radius: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  
  #invoice-pdf-template {
    overflow: visible !important;
    max-height: none !important;
    height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}`);
fs.writeFileSync('src/index.css', code);
