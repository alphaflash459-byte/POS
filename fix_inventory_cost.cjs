const fs = require('fs');

let code = fs.readFileSync('src/components/InventorySection.tsx', 'utf-8');

const strToReplace = `<div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">តម្លៃដើម</span>
                  <span className="font-black text-slate-700 font-sans text-base">\\\${selectedProduct.cost.toFixed(2)}</span>
                </div>`;

code = code.replace(/<div className="flex flex-col">\s*<span className="text-\[11px\] font-bold text-slate-400 uppercase tracking-wider mb-1">តម្លៃដើម<\/span>\s*<span className="font-black text-slate-700 font-sans text-base">\$[^<]*<\/span>\s*<\/div>/, '');

fs.writeFileSync('src/components/InventorySection.tsx', code);
