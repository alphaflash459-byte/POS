const fs = require('fs');

let code = fs.readFileSync('src/components/InventorySection.tsx', 'utf-8');

const regex = /\{\/\* Details Grid \*\/\}.*?\{\/\* Actions \*\/\}/s;

const newDetails = `{/* Details Grid */}
            <div className="px-5 py-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col bg-slate-50 border border-slate-100 p-4 rounded-[20px]">
                  <span className="text-[11px] font-bold text-slate-400 font-khmer uppercase tracking-wider mb-1">តម្លៃលក់</span>
                  <span className="font-black text-blue-600 font-sans text-xl md:text-2xl">\\\${selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex flex-col bg-slate-50 border border-slate-100 p-4 rounded-[20px]">
                  <span className="text-[11px] font-bold text-slate-400 font-khmer uppercase tracking-wider mb-1">បរិមាណ (ស្តុក)</span>
                  <span className={\`font-black font-sans text-xl md:text-2xl \${selectedProduct.stock <= 5 ? 'text-rose-500' : 'text-emerald-500'}\`}>
                    {selectedProduct.stock} <span className="text-sm font-medium opacity-70 font-khmer">ឯកតា</span>
                  </span>
                </div>
                
                <div className="flex flex-col bg-slate-50 border border-slate-100 p-4 rounded-[20px] col-span-2 flex-row items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 font-khmer uppercase tracking-wider">ប្រភេទទំនិញ</span>
                  <span className="font-bold text-slate-700 text-sm py-1.5 px-4 bg-white border border-slate-200 shadow-sm rounded-xl inline-flex w-max font-khmer">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}`;

code = code.replace(regex, newDetails);

// Let's also update the "កែប្រែ" button text color to blue like the screenshot
code = code.replace(
  /className="flex-1 py-3\.5 bg-slate-100 hover:bg-slate-200 text-slate-700/g,
  'className="flex-1 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
);

fs.writeFileSync('src/components/InventorySection.tsx', code);
