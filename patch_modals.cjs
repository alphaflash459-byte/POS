const fs = require('fs');
let code = fs.readFileSync('src/components/Modals.tsx', 'utf8');

code = code.replace(
  '<div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4 print-hidden font-khmer">',
  '<div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4 font-khmer print-modal-root">'
);

code = code.replace(
  '<div className="bg-white w-full max-w-md md:max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[95vh] shadow-2xl relative">',
  '<div className="bg-white w-full max-w-md md:max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[95vh] shadow-2xl relative print-modal-content">'
);

code = code.replace(
  '<div className="flex justify-between items-center p-4 md:p-5 border-b border-slate-100 bg-slate-50 shrink-0">',
  '<div className="flex justify-between items-center p-4 md:p-5 border-b border-slate-100 bg-slate-50 shrink-0 print-hidden">'
);

fs.writeFileSync('src/components/Modals.tsx', code);
