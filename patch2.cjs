const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const search = '<div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f1f5f9] md:order-2 relative print-hidden">';
const replace = '<div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f1f5f9] order-1 md:order-2 relative print-hidden">';
code = code.replace(search, replace);
fs.writeFileSync('src/App.tsx', code);
