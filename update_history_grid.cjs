const fs = require('fs');
let code = fs.readFileSync('src/components/HistorySection.tsx', 'utf-8');

code = code.replace('<div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">', '<div className="grid grid-cols-2 gap-3 md:gap-4">');

fs.writeFileSync('src/components/HistorySection.tsx', code);
