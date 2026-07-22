const fs = require('fs');

// 1. Update index.css
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/@media print \{/, `@media print {
  .print-app-container {
    position: static !important;
    height: auto !important;
    overflow: visible !important;
    display: block !important;
  }
`);
fs.writeFileSync('src/index.css', css);

// 2. Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  '<div className="fixed inset-0 flex flex-col md:flex-row w-full font-sans bg-white">',
  '<div className="fixed inset-0 flex flex-col md:flex-row w-full font-sans bg-white print-app-container">'
);
fs.writeFileSync('src/App.tsx', app);
