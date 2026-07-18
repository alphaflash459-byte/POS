const fs = require('fs');
let code = fs.readFileSync('src/components/Modals.tsx', 'utf-8');

code = code.replace(/<div className="grid grid-cols-2 gap-3">\s*<div className="space-y-1\.5">\s*<label className="text-\[11px\] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider font-sans">\s*Retail Price \(\$\) <span className="text-rose-500">\*<\/span>\s*<\/label>\s*<input\s*type="number"\s*step="any"\s*min="0"\s*required\s*value=\{price \|\| ''\}\s*onChange=\{\(e\) => setPrice\(parseFloat\(e\.target\.value\) \|\| 0\)\}\s*placeholder="0\.00"\s*className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3\.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-black text-blue-600"\s*\/>\s*<\/div>\s*<\/div>\s*<div className="grid grid-cols-2 gap-3">\s*<div className="space-y-1\.5">\s*<label className="text-\[11px\] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">\s*ចំនួនស្តុក \(In Stock\) <span className="text-rose-500">\*<\/span>\s*<\/label>\s*<input\s*type="number"\s*min="0"\s*required\s*value=\{stock \|\| ''\}\s*onChange=\{\(e\) => setStock\(parseInt\(e\.target\.value\) \|\| 0\)\}\s*placeholder="10"\s*className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3\.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-black text-slate-800"\s*\/>\s*<\/div>\s*<\/div>/g, 
`<div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider font-sans">
                  Retail Price ($) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={price || ''}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-black text-blue-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                  ចំនួនស្តុក (In Stock) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock || ''}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  placeholder="10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-black text-slate-800"
                />
              </div>
            </div>`);

fs.writeFileSync('src/components/Modals.tsx', code);
