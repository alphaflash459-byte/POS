const fs = require('fs');

let posCode = fs.readFileSync('src/components/POSSection.tsx', 'utf-8');

const regex = /<input[\s\S]*?className="w-full text-center text-xs font-bold text-slate-800 font-sans bg-slate-50 border border-slate-200\/60 p-1\.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"\s*\/>/;

const betterInput = `<input
                          type="number"
                          min="1"
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                            if (!isNaN(val)) {
                               if (val === 0) {
                                  // Just a visual clear for typing, let's implement a small trick:
                                  // Actually, since state is in App, setting to 0 deletes it.
                                  // So let's NOT set to 0. 
                               } else {
                                  onSetCartQty(item.product.id, val);
                               }
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '' || e.target.value === '0') {
                              onSetCartQty(item.product.id, 1);
                            }
                          }}
                          onKeyDown={(e) => {
                             if (e.key === 'Backspace' && item.quantity.toString().length === 1) {
                                // let them clear it visually but don't delete immediately?
                                // Actually, if we don't update state, the input won't clear.
                                // Let's let them delete it by making onSetCartQty not delete on 0, but delete on blur if still 0.
                             }
                          }}
                          className="w-full text-center text-xs font-bold text-slate-800 font-sans bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />`;

// Wait, the easiest way to handle input for qty without deleting on clear is to just use a local state component, or since it's a simple React app, we can just allow them to type and if they clear, we can set state to empty string.
