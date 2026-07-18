const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

const replacement = `        {/* Right: Controls */}
        <div className="flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-3">
          {/* Donate Trigger (Mobile Only) */}
          <button
            type="button"
            onClick={onOpenDonate}
            className="md:hidden bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 px-3 py-1.5 rounded-xl text-[10px] font-bold text-emerald-100 flex items-center space-x-1.5 backdrop-blur-sm transition active:scale-95 shadow-sm"
          >
            <Coffee className="w-3.5 h-3.5 text-emerald-300" />
            <span>ឧបត្ថម្ភ</span>
          </button>
        </div>`;

code = code.replace(/        \{\/\* Right: Controls \*\/\}\n        <div className="flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-3">[\s\S]*?<span>ឧបត្ថម្ភ<\/span>\n          <\/button>\n        <\/div>/, replacement);

fs.writeFileSync('src/components/Header.tsx', code);
