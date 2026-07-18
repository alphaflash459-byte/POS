const fs = require('fs');
let code = fs.readFileSync('src/components/GoogleSheetsSetup.tsx', 'utf-8');

// Add imports
code = code.replace("import { FileSpreadsheet, Plug, Info, Copy, Check } from 'lucide-react';", "import { FileSpreadsheet, Plug, Info, Copy, Check, CloudUpload, FileDown, Download } from 'lucide-react';");

// Update interface
const newInterface = `interface GoogleSheetsSetupProps {
  sheetsWebhookUrl: string;
  onSaveSheetsUrl: (url: string) => void;
  onTestSheetsUrl: () => void;
  onManualSync: () => void;
  onExportStockLogs: () => void;
  onExportCurrentStock: () => void;
}`;
code = code.replace(/interface GoogleSheetsSetupProps \{[\s\S]*?\}/, newInterface);

// Update component declaration
const newCompDecl = `export default function GoogleSheetsSetup({
  sheetsWebhookUrl,
  onSaveSheetsUrl,
  onTestSheetsUrl,
  onManualSync,
  onExportStockLogs,
  onExportCurrentStock,
}: GoogleSheetsSetupProps) {`;
code = code.replace(/export default function GoogleSheetsSetup\(\{[\s\S]*?\}\:\ GoogleSheetsSetupProps\)\ \{/, newCompDecl);

// Add the buttons
const newButtons = `<div className="flex space-x-3 mb-4">
        <button
          onClick={handleSave}
          className="flex-1 hover:bg-slate-200 bg-slate-100 text-slate-700 text-xs md:text-sm font-bold py-3 md:py-3.5 rounded-xl active:bg-slate-200 transition border border-slate-200"
        >
          រក្សាទុក (Save)
        </button>
        <button
          onClick={onTestSheetsUrl}
          className="flex-1 hover:bg-emerald-600 bg-emerald-500 text-white text-xs md:text-sm font-bold py-3 md:py-3.5 rounded-xl shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
        >
          <Plug className="w-3.5 h-3.5" />
          <span>សាកល្បង (Test Connection)</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={onManualSync}
          className="bg-blue-50 border border-blue-200 text-blue-700 font-bold py-2 px-3 rounded-xl text-[10px] md:text-xs hover:bg-blue-100 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 flex-1 justify-center"
        >
          <CloudUpload className="w-3.5 h-3.5" />
          <span>Sync ទិន្នន័យ</span>
        </button>
        <button
          type="button"
          onClick={onExportCurrentStock}
          className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold py-2 px-3 rounded-xl text-[10px] md:text-xs hover:bg-emerald-100 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 flex-1 justify-center"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>ស្តុក Excel</span>
        </button>
        <button
          type="button"
          onClick={onExportStockLogs}
          className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold py-2 px-3 rounded-xl text-[10px] md:text-xs hover:bg-indigo-100 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 flex-1 justify-center"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ប្រវត្តិ Excel</span>
        </button>
      </div>`;

code = code.replace(/<div className="flex space-x-3 mb-4">[\s\S]*?<\/div>/, newButtons);

fs.writeFileSync('src/components/GoogleSheetsSetup.tsx', code);
