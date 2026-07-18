const fs = require('fs');
let code = fs.readFileSync('src/components/POSSection.tsx', 'utf-8');

const replacement = `<div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-3 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full opacity-50 pointer-events-none"></div>

            <div className="relative flex-1 z-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ស្វែងរកទំនិញ ឬលេខកូដ..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs md:text-sm font-medium"
              />
            </div>

            {/* Categories Dropdown */}
            <div className="relative w-[110px] md:w-48 z-10 shrink-0">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full pl-3 md:pl-4 pr-8 md:pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-[11px] md:text-sm font-bold text-slate-700 appearance-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>`;

code = code.replace(/<div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 justify-between items-center relative overflow-hidden">[\s\S]*?<\/div>\n          <\/div>/, replacement);

fs.writeFileSync('src/components/POSSection.tsx', code);
