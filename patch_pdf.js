const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /if \(typeof html2pdf !== 'undefined'\) {/,
  "if (html2pdf) {"
);
fs.writeFileSync('src/App.tsx', code);
