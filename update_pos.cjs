const fs = require('fs');
let code = fs.readFileSync('src/components/POSSection.tsx', 'utf-8');

// 1. Remove Mobile Screen Switcher
code = code.replace(/      \{\/\* Mobile Screen Switcher \*\/\}\n      <div className="lg:hidden flex bg-white p-1 rounded-2xl gap-1 border border-slate-100 shadow-sm mb-4">[\s\S]*?<\/button>\n      <\/div>/, '');

// 2. Add Back Button and styling to cart header
const cartHeader = `            <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPosMobileView('products')}
                  className="lg:hidden mr-2 p-2 rounded-xl bg-slate-200/50 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                  <ShoppingCart className="w-4 h-4 text-blue-700" />
                </div>
                <span className="font-black text-slate-800 text-sm md:text-base">កន្ត្រកទំនិញ</span>
              </div>
              <button
                type="button"
                onClick={onClearCart}
                className="text-[11px] text-rose-500 hover:text-rose-600 font-bold transition-colors flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-100 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>សម្អាត</span>
              </button>
            </div>`;

code = code.replace(/            \{\/\* Header \*\/\}\n            <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50\/50">[\s\S]*?<span>សម្អាត<\/span>\n              <\/button>\n            <\/div>/, `            {/* Header */}\n${cartHeader}`);

// 3. Add Floating Cart Button
const floatingCart = `      {/* Floating Cart Button (Mobile) */}
      {posMobileView === 'products' && (
        <button
          type="button"
          onClick={() => setPosMobileView('cart')}
          className="lg:hidden fixed bottom-[90px] right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(37,99,235,0.4)] transition-transform active:scale-90 flex items-center justify-center"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalCartQty > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
              {totalCartQty}
            </span>
          )}
        </button>
      )}`;

// insert at the end of the component, just before `</section>`
code = code.replace(/    <\/section>\n  \);\n\}/, `${floatingCart}\n    </section>\n  );\n}`);

fs.writeFileSync('src/components/POSSection.tsx', code);
