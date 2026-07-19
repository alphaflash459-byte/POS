const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

code = code.replace(
  'bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-2.5 h-[65px] flex items-center shrink-0 relative z-0 shadow-lg md:shadow-md',
  'bg-white border-b border-slate-200 text-slate-800 px-4 py-2.5 h-[65px] flex items-center shrink-0 relative z-0'
);

code = code.replace(
  'group-hover:ring-white/20',
  'group-hover:ring-slate-100'
);

code = code.replace(
  'bg-white/20 flex items-center justify-center border-2 border-white/30 text-xl font-bold overflow-hidden shadow-sm',
  'bg-slate-100 flex items-center justify-center border border-slate-200 text-xl font-bold overflow-hidden'
);

code = code.replace(
  '<User className="w-5 h-5 text-white" />',
  '<User className="w-5 h-5 text-slate-500" />'
);

code = code.replace(
  'border-indigo-800',
  'border-white'
);

code = code.replace(
  'text-blue-100 font-medium opacity-90',
  'text-slate-500 font-medium'
);

code = code.replace(
  'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 px-3 py-1.5 rounded-xl text-[10px] font-bold text-emerald-100',
  'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-emerald-600'
);

code = code.replace(
  'text-emerald-300',
  'text-emerald-600'
);

fs.writeFileSync('src/components/Header.tsx', code);
