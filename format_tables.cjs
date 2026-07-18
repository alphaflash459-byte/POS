const fs = require('fs');

// 1. LedgerSection
let ledgerCode = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const ledgerTableReplacement = `<table className="w-full text-left text-sm text-slate-600 table-fixed">
                  <colgroup>
                    <col className="w-[28%] md:w-1/4" />
                    <col className="w-[38%] md:w-auto" />
                    <col className="w-[18%] md:w-1/6" />
                    <col className="w-[16%] md:w-1/6" />
                  </colgroup>
                  <thead className="bg-slate-50 text-slate-500 text-[10px] md:text-[11px] uppercase font-black tracking-wider border-b border-slate-200 font-sans">
                    <tr>
                      <th className="px-2 py-3 md:px-5 md:py-4">កាលបរិច្ឆេទ</th>
                      <th className="px-2 py-3 md:px-5 md:py-4">ទំនិញ</th>
                      <th className="px-1 py-3 md:px-5 md:py-4 text-center">ប្រភេទ</th>
                      <th className="px-2 py-3 md:px-5 md:py-4 text-right">ចំនួន</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-sans">
                    {filteredLogs.map((log) => {
                      const isEntry = log.type === 'IN';
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-2 py-2 md:px-5 md:py-3 text-slate-500 font-bold text-[9px] md:text-xs">
                            <span className="block">{new Date(log.timestamp).toLocaleString('km-KH', { dateStyle: 'short' })}</span>
                            <span className="block text-[8px] md:text-[10px] font-mono">{new Date(log.timestamp).toLocaleString('km-KH', { timeStyle: 'short' })}</span>
                          </td>
                          <td className="px-2 py-2 md:px-5 md:py-3 min-w-0">
                            <span className="block font-bold text-slate-800 text-[11px] md:text-sm font-khmer truncate">
                              {log.productName}
                            </span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 font-bold font-mono block mt-0.5 truncate">
                              {log.sku || '-'}
                            </span>
                          </td>
                          <td className="px-1 py-2 md:px-5 md:py-3 text-center">
                            <span
                              className={\`inline-block px-1.5 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-[11px] font-bold font-khmer \${
                                isEntry ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }\`}
                            >
                              {isEntry ? 'ចូលស្តុក' : 'លក់ចេញ'}
                            </span>
                          </td>
                          <td
                            className={\`px-2 py-2 md:px-5 md:py-3 text-right font-black text-[11px] md:text-sm \${
                              isEntry ? 'text-emerald-600' : 'text-rose-500'
                            }\`}
                          >
                            {isEntry ? '+' : '-'}
                            {log.qty}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>`;

ledgerCode = ledgerCode.replace(/<table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">[\s\S]*?<\/table>/, ledgerTableReplacement);
// Remove overflow-x-auto custom-scroll wrapper to match Inventory exactly
ledgerCode = ledgerCode.replace(/<div className="overflow-x-auto custom-scroll">\s*(<table[\s\S]*?<\/table>)\s*<\/div>/, '<div className="overflow-x-hidden">\n                $1\n              </div>');

fs.writeFileSync('src/components/LedgerSection.tsx', ledgerCode);

