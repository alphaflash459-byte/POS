const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

const oldButton = /<button\s*type="button"\s*onClick=\{onClearAllLogs\}\s*className="bg-rose-50 border border-rose-200 text-rose-600 font-bold py-2\.5 px-4 rounded-xl text-\[10px\] md:text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-1\.5 shadow-sm active:scale-95 w-full sm:w-auto shrink-0"\s*>\s*<Trash2 className="w-3\.5 h-3\.5" \/>\s*<span>លុបទាំងអស់<\/span>\s*<\/button>/;

const newButton = `<button
            type="button"
            onClick={onClearAllLogs}
            className="bg-rose-50 border border-rose-200 text-rose-600 font-bold p-2.5 rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center shadow-sm active:scale-95 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>`;

code = code.replace(oldButton, newButton);

// Let's also adjust the layout to make sure they are in the same row on mobile too.
// "flex flex-col sm:flex-row gap-3" -> "flex flex-row gap-3"
const searchLayout = /<div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 z-10">/;
const newSearchLayout = '<div className="flex flex-row gap-3 items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 z-10">';
code = code.replace(searchLayout, newSearchLayout);

// And "relative w-full sm:flex-1 max-w-sm" -> "relative flex-1"
const searchBox = /<div className="relative w-full sm:flex-1 max-w-sm">/;
const newSearchBox = '<div className="relative flex-1 max-w-sm">';
code = code.replace(searchBox, newSearchBox);

fs.writeFileSync('src/components/LedgerSection.tsx', code);
