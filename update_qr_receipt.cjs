const fs = require('fs');

let modalsCode = fs.readFileSync('src/components/Modals.tsx', 'utf-8');
modalsCode = modalsCode.replace(
  'w-[90%] max-w-[280px] aspect-square mx-auto p-2 border-2 border-dashed border-slate-300 rounded-2xl bg-white flex items-center justify-center',
  'w-full max-w-[350px] aspect-square mx-auto flex items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-2'
);

modalsCode = modalsCode.replace('ទំនិញ (Item)', 'ទំនិញ');
modalsCode = modalsCode.replace('ចំនួន (Qty)', 'ចំនួន');
modalsCode = modalsCode.replace('តម្លៃ (Price)', 'តម្លៃ');
modalsCode = modalsCode.replace('សាច់ប្រាក់ (Cash)', 'សាច់ប្រាក់');
modalsCode = modalsCode.replace('QR Core Scan', 'ស្កេន QR');

fs.writeFileSync('src/components/Modals.tsx', modalsCode);
