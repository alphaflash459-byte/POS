const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/<div className="flex flex-col md:flex-row w-full h-screen font-sans">/g, '<div className="fixed inset-0 flex flex-col md:flex-row font-sans">');
code = code.replace(/<div className="flex-1 flex flex-col h-screen overflow-hidden bg-\\[#f1f5f9\\] md:order-2 relative print-hidden">/g, '<div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f1f5f9] md:order-2 relative print-hidden">');
fs.writeFileSync('src/App.tsx', code);
