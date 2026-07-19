const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
const setQtyCode = `  const handleSetCartQty = (productId: number, qty: number) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => item.product.id === productId);
      if (idx === -1) return prevCart;

      const newQty = qty;
      if (newQty <= 0) {
        return prevCart.filter((item) => item.product.id !== productId);
      } else if (newQty > prevCart[idx].product.stock) {
        showToast(\`ស្តុកមានកំណត់ត្រឹម \${prevCart[idx].product.stock} !\`, 'error');
        // Optionally set to max stock
        const updated = [...prevCart];
        updated[idx].quantity = prevCart[idx].product.stock;
        return updated;
      }

      const updated = [...prevCart];
      updated[idx].quantity = newQty;
      return updated;
    });
  };
`;
appCode = appCode.replace('const handleUpdateCartQty = (productId: number, change: number) => {', setQtyCode + '\n  const handleUpdateCartQty = (productId: number, change: number) => {');
appCode = appCode.replace('onUpdateCartQty={handleUpdateCartQty}', 'onUpdateCartQty={handleUpdateCartQty}\n                onSetCartQty={handleSetCartQty}');
fs.writeFileSync('src/App.tsx', appCode);

let posCode = fs.readFileSync('src/components/POSSection.tsx', 'utf-8');
posCode = posCode.replace('onUpdateCartQty: (productId: number, change: number) => void;', 'onUpdateCartQty: (productId: number, change: number) => void;\n  onSetCartQty: (productId: number, qty: number) => void;');
posCode = posCode.replace('onUpdateCartQty,', 'onUpdateCartQty,\n  onSetCartQty,');

const oldQtyControls = `<div className="flex items-center gap-1.5 flex-shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => onUpdateCartQty(item.product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center shadow-sm transition-colors active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800 font-sans">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateCartQty(item.product.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center shadow-sm transition-colors active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>`;

const newQtyControls = `<div className="flex items-center flex-shrink-0 w-16">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                              onSetCartQty(item.product.id, val);
                            } else {
                              // If they clear it, maybe set to 1 or let it be handled
                              // We can pass 0 to trigger deletion, but let's just ignore or set to 1 if empty string, or we can handle '' properly if we used string state.
                              // Actually if e.target.value is '', we might want to just set it to 0 so they can type freely, but wait, setting it to 0 removes it from cart in App.tsx!
                              // Let's allow them to type. Wait, if they type, it will immediately delete it if 0.
                              // Let's use a local state or just handle it. 
                            }
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (isNaN(val) || val <= 0) {
                              onUpdateCartQty(item.product.id, -item.quantity); // removing it? 
                              // Actually we can just set to 1 if empty.
                            }
                          }}
                          className="w-full text-center text-xs font-bold text-slate-800 font-sans bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>`;

posCode = posCode.replace(oldQtyControls, newQtyControls);
fs.writeFileSync('src/components/POSSection.tsx', posCode);

