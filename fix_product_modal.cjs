const fs = require('fs');

let code = fs.readFileSync('src/components/InventorySection.tsx', 'utf-8');

const regex = /<div className="bg-white rounded-2xl shadow-2xl border border-slate-200\/60 w-full max-w-sm relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">[\s\S]*?<\/div>\n        <\/div>\n      \)}\n    <\/section>/;

const newModal = `<div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-sm relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-2.5 bg-slate-100/80 hover:bg-slate-200 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 transition active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero Image Section */}
            <div className="relative pt-8 pb-6 px-6 bg-slate-50/50 flex flex-col items-center border-b border-slate-100">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-[24px] overflow-hidden border-4 border-white bg-slate-100 shadow-sm mb-4 relative">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Eye className="w-8 h-8 text-slate-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              <h3 className="font-black text-slate-800 text-xl md:text-2xl text-center leading-tight mb-2 px-2 line-clamp-2">
                {selectedProduct.name}
              </h3>
              <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-200/50 text-slate-500 rounded-xl text-xs font-bold font-mono tracking-wide">
                {selectedProduct.sku}
              </span>
            </div>

            {/* Details Grid */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">តម្លៃលក់</span>
                  <span className="font-black text-blue-600 font-sans text-xl md:text-2xl">\${selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">បរិមាណ (ស្តុក)</span>
                  <span className={\`font-black font-sans text-xl md:text-2xl \${selectedProduct.stock <= 5 ? 'text-rose-500' : 'text-emerald-500'}\`}>
                    {selectedProduct.stock} <span className="text-sm font-medium opacity-70">ឯកតា</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">តម្លៃដើម</span>
                  <span className="font-black text-slate-700 font-sans text-base">\${selectedProduct.cost.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">ប្រភេទទំនិញ</span>
                  <span className="font-bold text-slate-700 text-sm py-1 px-3 bg-slate-100 rounded-lg inline-flex w-max">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5">
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction('restock', selectedProduct)}
                  className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold transition shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>បន្ថែមស្តុក</span>
                </button>
                <button
                  onClick={() => handleAction('edit', selectedProduct)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4.5 h-4.5" />
                  <span>កែប្រែ</span>
                </button>
                <button
                  onClick={() => handleAction('delete', selectedProduct)}
                  className="p-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition active:scale-95 flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>`;

code = code.replace(regex, newModal);
fs.writeFileSync('src/components/InventorySection.tsx', code);
