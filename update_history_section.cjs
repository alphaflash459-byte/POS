const fs = require('fs');
let code = fs.readFileSync('src/components/HistorySection.tsx', 'utf-8');

// The original div:
// <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-4 md:p-6 shadow-md text-white flex flex-col justify-center items-center text-center">
//   <p className="text-xs md:text-sm font-medium opacity-80 mb-3">
//     នាំចេញទិន្នន័យការលក់ទាំងអស់ជា Excel (Download Excel Report)
//   </p>
//   <button
//     type="button"
//     onClick={onExportSalesHistory}
//     className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/20"
//   >
//     <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
//     <span>ទាញយក Excel (Export Sales)</span>
//   </button>
// </div>

const regex = /<div className="col-span-2 md:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-4 md:p-6 shadow-md text-white flex flex-col justify-center items-center text-center">[\s\S]*?<\/button>\s*<\/div>/;

code = code.replace(regex, '');

// Also remove `FileSpreadsheet` import if it is now unused
// And remove `onExportSalesHistory` from the props interface if we want, but it's safe to just let it be. Let's remove from props anyway for cleanliness.

code = code.replace(/\s*onExportSalesHistory: \(\) => void;/g, '');
code = code.replace(/\s*onExportSalesHistory,/g, '');

fs.writeFileSync('src/components/HistorySection.tsx', code);
