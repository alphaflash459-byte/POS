const fs = require('fs');
let code = fs.readFileSync('src/components/Modals.tsx', 'utf-8');

// Remove Old Cost display
code = code.replace(/<div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">\s*<span className="block text-\[10px\] font-bold text-slate-400 uppercase tracking-wider font-khmer">\s*តម្លៃដើមចាស់\s*<\/span>\s*<p className="font-black text-slate-700 text-lg md:text-xl mt-1">\$\{product.cost\.toFixed\(2\)\}<\/p>\s*<\/div>/g, '');

// Change grid-cols-2 to grid-cols-1 for that block
code = code.replace(/<div className="grid grid-cols-2 gap-3 font-sans">/g, '<div className="grid grid-cols-1 gap-3 font-sans">');

// Remove New Cost input
code = code.replace(/<div className="space-y-1\.5">\s*<label className="text-\[11px\] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">\s*តម្លៃដើមថ្មី \(\$\)[\s\S]*?className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-bold text-slate-800"\s*\/>\s*<\/div>/g, '');

fs.writeFileSync('src/components/Modals.tsx', code);
