const fs = require('fs');

let modalsCode = fs.readFileSync('src/components/Modals.tsx', 'utf-8');
modalsCode = modalsCode.replace(
  'w-24 h-24 p-1.5 border-2 border-dashed border-slate-300 rounded-xl bg-white flex items-center justify-center',
  'w-[90%] max-w-[280px] aspect-square mx-auto p-2 border-2 border-dashed border-slate-300 rounded-2xl bg-white flex items-center justify-center'
);

modalsCode = modalsCode.replace(
  '<p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-sans">',
  '<p className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-widest mb-3 font-sans">'
);

fs.writeFileSync('src/components/Modals.tsx', modalsCode);
