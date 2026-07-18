const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

// The headers
const theadRegex = /<th className="px-4 py-3 md:px-5 md:py-4 text-center">ស្តុកចុងក្រោយ \(Stock\)<\/th>\s*<th className="px-4 py-3 md:px-5 md:py-4">មូលហេតុ \(Note\)<\/th>\s*<th className="px-4 py-3 md:px-5 md:py-4 text-center">សកម្មភាព<\/th>/g;
code = code.replace(theadRegex, '');

// The body
const tbodyRegex = /<td className="px-4 py-2 md:px-5 md:py-3 text-center text-\[11px\] md:text-sm font-black text-slate-700">\s*\{log\.newStock\}\s*<\/td>\s*<td className="px-4 py-2 md:px-5 md:py-3 text-\[10px\] md:text-xs font-medium text-slate-500 max-w-\[150px\] md:max-w-\[200px\] truncate font-khmer">\s*\{log\.note \|\| '-'\}\s*<\/td>\s*<td className="px-4 py-2 md:px-5 md:py-3 text-center">\s*<button\s*type="button"\s*onClick=\{\(\) => onDeleteSingleLog\(log\)\}\s*className="p-1\.5 md:p-2 text-rose-500 hover:bg-rose-100 bg-rose-50 rounded-lg md:rounded-xl transition active:scale-95"\s*>\s*<Trash2 className="w-3\.5 h-3\.5 md:w-4 h-4" \/>\s*<\/button>\s*<\/td>/g;
code = code.replace(tbodyRegex, '');

fs.writeFileSync('src/components/LedgerSection.tsx', code);
