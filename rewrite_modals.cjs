const fs = require('fs');
let code = fs.readFileSync('src/components/Modals.tsx', 'utf-8');

// Replace the Cost Price and Theme Tag Color sections
code = code.replace(/<div className="space-y-1\.5">\s*<label className="text-\[11px\] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider font-sans">\s*Cost Price \(\$\) <span className="text-rose-500">\*<\/span>\s*<\/label>\s*<input\s*type="number"[\s\S]*?onChange=\{\(e\) => setCost\(parseFloat\(e\.target\.value\) \|\| 0\)\}[\s\S]*?className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-black text-slate-600"\s*\/>\s*<\/div>/g, '');

code = code.replace(/<div className="space-y-1\.5">\s*<label className="text-\[11px\] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider font-sans">\s*Theme Tag Color\s*<\/label>\s*<select\s*value=\{color\}[\s\S]*?onChange=\{\(e\) => setColor\(e\.target\.value\)\}[\s\S]*?<\/select>\s*<\/div>/g, '');

fs.writeFileSync('src/components/Modals.tsx', code);
