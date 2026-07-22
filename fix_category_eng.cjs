const fs = require('fs');
let code = fs.readFileSync('src/components/Modals.tsx', 'utf-8');

code = code.replace(
  '<label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider font-sans">\n                  Category\n                </label>',
  '<label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider font-sans">\n                  ប្រភេទទំនិញ\n                </label>'
);

fs.writeFileSync('src/components/Modals.tsx', code);
