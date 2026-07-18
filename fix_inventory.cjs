const fs = require('fs');
let code = fs.readFileSync('src/components/InventorySection.tsx', 'utf-8');

const regex = /<div className="z-10">\s*<h2 className="text-base md:text-lg font-black text-slate-800">បញ្ជីទំនិញក្នុងស្តុក<\/h2>\s*<\/div>/;
code = code.replace(regex, '');

// Also change the search bar container to full width on desktop too
const searchContainer = /<div className="flex flex-row gap-2 md:gap-3 w-full md:w-auto items-center z-10">/;
code = code.replace(searchContainer, '<div className="flex flex-row gap-2 md:gap-3 w-full items-center z-10">');

fs.writeFileSync('src/components/InventorySection.tsx', code);
