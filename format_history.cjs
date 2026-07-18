const fs = require('fs');

let historyCode = fs.readFileSync('src/components/HistorySection.tsx', 'utf-8');

const historyTableReplacement = `<table className="w-full text-left text-sm text-slate-600 table-fixed">
                  <colgroup>
                    <col className="w-[30%] md:w-1/4" />
                    <col className="w-[30%] md:w-auto" />
                    <col className="w-[20%] md:w-1/6" />
                    <col className="w-[20%] md:w-1/6" />
                  </colgroup>
                  <thead className="bg-slate-50 text-slate-500 text-[10px] md:text-[11px] uppercase font-black tracking-wider border-b border-slate-200 font-sans">
                    <tr>
                      <th className="px-2 py-3 md:px-5 md:py-4">វិក្កយបត្រ</th>
                      <th className="px-2 py-3 md:px-5 md:py-4">អតិថិជន</th>
                      <th className="px-2 py-3 md:px-5 md:py-4 text-right">សរុប</th>
                      <th className="px-2 py-3 md:px-5 md:py-4 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-sans">
                    {salesHistory.map((txn) => {
                      const totalQty = txn.items.reduce((s, i) => s + i.quantity, 0);
                      return (
                        <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-2 py-2 md:px-5 md:py-3 min-w-0">
                            <span className="font-bold text-blue-700 text-[11px] md:text-sm block truncate">{txn.id}</span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 font-medium block mt-0.5 truncate">{txn.date}</span>
                          </td>
                          <td className="px-2 py-2 md:px-5 md:py-3 min-w-0">
                            <span className="font-bold text-slate-800 font-khmer text-[11px] md:text-sm block truncate">
                              {txn.customerName}
                            </span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 font-bold block mt-0.5 truncate">
                              {txn.customerPhone}
                            </span>
                          </td>
                          <td className="px-2 py-2 md:px-5 md:py-3 text-right">
                            <span className="block text-[11px] md:text-sm font-black text-slate-800 truncate">\${txn.netTotal.toFixed(2)}</span>
                            <span className="block text-[9px] md:text-[10px] text-slate-400 mt-0.5">
                              {totalQty} មុខ
                            </span>
                          </td>
                          <td className="px-2 py-2 md:px-5 md:py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 md:gap-2">
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
                </table>`;

historyCode = historyCode.replace(/<table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">[\s\S]*?<\/table>/, historyTableReplacement);
historyCode = historyCode.replace(/<div className="overflow-x-auto custom-scroll">\s*(<table[\s\S]*?<\/table>)\s*<\/div>/, '<div className="overflow-x-hidden">\n                $1\n              </div>');

fs.writeFileSync('src/components/HistorySection.tsx', historyCode);

