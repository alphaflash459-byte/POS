const fs = require('fs');
let code = fs.readFileSync('src/components/HistorySection.tsx', 'utf-8');

const replaceTarget = /\{\/\* Desktop grid layout \*\/\}.*?(?=\{\/\* Mobile table card list \*\/\})/s;
const removeTarget = /\{\/\* Mobile table card list \*\/\}.*?(?=\s*<\/>\s*\)\s*\}\s*<\/div>\s*<\/section>)/s;

let tableReplacement = `{/* Unified Table View */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden w-full">
              <div className="overflow-x-auto custom-scroll">
                <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] md:text-[11px] uppercase font-black tracking-wider border-b border-slate-200 font-sans">
                    <tr>
                      <th className="px-4 py-3 md:px-5 md:py-4">វិក្កយបត្រ (Invoice)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4">កាលបរិច្ឆេទ (Date)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4">អតិថិជន (Customer)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4 text-center">ចំនួន (Qty)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4 text-right">បញ្ចុះតម្លៃ</th>
                      <th className="px-4 py-3 md:px-5 md:py-4 text-right">សរុប (Total)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-sans">
                    {salesHistory.map((txn) => {
                      const totalQty = txn.items.reduce((s, i) => s + i.quantity, 0);
                      return (
                        <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-2 md:px-5 md:py-3 font-bold text-blue-700 text-[11px] md:text-sm">
                            {txn.id}
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3 text-[10px] md:text-xs text-slate-500 font-medium">
                            {txn.date}
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3">
                            <span className="font-bold text-slate-800 font-khmer text-[11px] md:text-sm block">
                              {txn.customerName}
                            </span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 font-bold block mt-0.5">
                              {txn.customerPhone}
                            </span>
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3 text-center font-black text-slate-700 text-[11px] md:text-sm">
                            {totalQty}
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3 text-right text-[10px] md:text-xs font-black text-rose-500">
                            {txn.discount}%
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3 text-right text-[11px] md:text-sm font-black text-slate-800">
                            ${"$"}{txn.netTotal.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => onReprint(txn)}
                                className="p-1.5 md:p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg md:rounded-xl transition active:scale-95"
                                title="Reprint Invoice"
                              >
                                <Printer className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-blue-700" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteInvoice(txn)}
                                className="p-1.5 md:p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg md:rounded-xl transition active:scale-95"
                                title="Delete Transaction"
                              >
                                <Trash2 className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-rose-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>`;

code = code.replace(replaceTarget, tableReplacement);
code = code.replace(removeTarget, '');

// also remove `<div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 w-full animate-fadeIn">` because we are creating our own wrapper in tableReplacement.
// wait, the outer div in HistorySection has `<h2 ...>ប្រវត្តិនៃការលក់...</h2>` so we should keep it, but just remove its bg/paddings if we want it identical to inventory?
// Let's just leave the outer div as it was but change its padding to match or just leave it.

fs.writeFileSync('src/components/HistorySection.tsx', code);
