const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

// Remove from top
const oldLocation = /<div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">\s*<button\s*type="button"\s*onClick=\{onClearAllLogs\}[\s\S]*?<\/button>\s*<\/div>/;
code = code.replace(oldLocation, '');

// Insert into search box area
const searchBox = /<div className="relative w-full sm:w-64">\s*<Search className="absolute left-3\.5 top-1\/2 -translate-y-1\/2 text-slate-400 w-4 h-4" \/>\s*<input\s*type="text"\s*placeholder="ស្វែងរកក្នុងកំណត់ត្រា..."\s*value=\{searchText\}\s*onChange=\{\(e\) => setSearchText\(e\.target\.value\)\}\s*className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"\s*\/>\s*<\/div>/;

const newSearchBox = `<div className="relative w-full sm:flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ស្វែងរកក្នុងកំណត់ត្រា..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            />
          </div>
          <button
            type="button"
            onClick={onClearAllLogs}
            className="bg-rose-50 border border-rose-200 text-rose-600 font-bold py-2.5 px-4 rounded-xl text-[10px] md:text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 w-full sm:w-auto shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>លុបទាំងអស់</span>
          </button>`;

code = code.replace(searchBox, newSearchBox);

fs.writeFileSync('src/components/LedgerSection.tsx', code);
