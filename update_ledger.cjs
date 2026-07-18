const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const replaceTarget = /\{\/\* Desktop Table View \*\/\}.*?(?=\{\/\* Mobile Cards View \*\/\})/s;
const removeTarget = /\{\/\* Mobile Cards View \*\/\}.*?(?=\s*<\/>\s*\)\s*\}\s*<\/div>\s*<\/section>)/s;

let tableReplacement = `{/* Unified Table View */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden w-full z-10">
              <div className="overflow-x-auto custom-scroll">
                <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] md:text-[11px] uppercase font-black tracking-wider border-b border-slate-200 font-sans">
                    <tr>
                      <th className="px-4 py-3 md:px-5 md:py-4">កាលបរិច្ឆេទ (Date)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4">ទំនិញ (Item)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4 text-center">ប្រភេទ (Type)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4 text-right">ចំនួន (Amount)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4 text-center">ស្តុកចុងក្រោយ (Stock)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4">មូលហេតុ (Note)</th>
                      <th className="px-4 py-3 md:px-5 md:py-4 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-sans">
                    {filteredLogs.map((log) => {
                      const isEntry = log.type === 'IN';
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-2 md:px-5 md:py-3 text-slate-500 font-bold text-[10px] md:text-xs">
                            {new Date(log.timestamp).toLocaleString('km-KH', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3">
                            <span className="block font-bold text-slate-800 text-[11px] md:text-sm font-khmer">
                              {log.productName}
                            </span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 font-bold font-mono block mt-0.5">
                              {log.sku || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3 text-center">
                            <span
                              className={\`inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-bold font-khmer \${
                                isEntry ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }\`}
                            >
                              {isEntry ? 'ចូលស្តុក' : 'លក់ចេញ'}
                            </span>
                          </td>
                          <td
                            className={\`px-4 py-2 md:px-5 md:py-3 text-right font-black text-[11px] md:text-sm \${
                              isEntry ? 'text-emerald-600' : 'text-rose-500'
                            }\`}
                          >
                            {isEntry ? '+' : '-'}
                            {log.qty}
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3 text-center text-[11px] md:text-sm font-black text-slate-700">
                            {log.newStock}
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3 text-[10px] md:text-xs font-medium text-slate-500 max-w-[150px] md:max-w-[200px] truncate font-khmer">
                            {log.note || '-'}
                          </td>
                          <td className="px-4 py-2 md:px-5 md:py-3 text-center">
                            <button
                              type="button"
                              onClick={() => onDeleteSingleLog(log)}
                              className="p-1.5 md:p-2 text-rose-500 hover:bg-rose-100 bg-rose-50 rounded-lg md:rounded-xl transition active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5 md:w-4 h-4" />
                            </button>
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

fs.writeFileSync('src/components/LedgerSection.tsx', code);
