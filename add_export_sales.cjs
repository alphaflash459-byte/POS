const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /<button\s*type="button"\s*onClick=\{\(\) => \{\s*handleLogout\(\);\s*setIsProfileOpen\(false\);\s*\}\}\s*className="bg-rose-100 hover:bg-rose-200 text-rose-600 font-bold py-2\.5 px-6 rounded-xl text-xs md:text-sm active:scale-95 transition shadow-sm w-full flex items-center justify-center gap-2"/;

const newButton = `<button
                      type="button"
                      onClick={handleExportSalesHistory}
                      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-2.5 px-6 rounded-xl text-xs md:text-sm active:scale-95 transition shadow-sm w-full flex items-center justify-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      ទាញយក Excel (Export Sales)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-600 font-bold py-2.5 px-6 rounded-xl text-xs md:text-sm active:scale-95 transition shadow-sm w-full flex items-center justify-center gap-2"`;

code = code.replace(regex, newButton);

// We should also make sure `FileSpreadsheet` is imported in `App.tsx`
if (!code.includes('FileSpreadsheet')) {
  // It probably is, but let's check
  const lucideImports = code.match(/import \{([^}]+)\} from 'lucide-react';/);
  if (lucideImports) {
    let imports = lucideImports[1];
    if (!imports.includes('FileSpreadsheet')) {
      code = code.replace(lucideImports[0], `import {${imports}, FileSpreadsheet } from 'lucide-react';`);
    }
  }
}

fs.writeFileSync('src/App.tsx', code);
