import { useState } from 'react';
import { FileSpreadsheet, Plug, Info, Copy, Check, CloudUpload, FileDown, Download } from 'lucide-react';

interface GoogleSheetsSetupProps {
  sheetsWebhookUrl: string;
  onSaveSheetsUrl: (url: string) => void;
  onTestSheetsUrl: () => void;
  onManualSync: () => void;
  onExportStockLogs: () => void;
  onExportCurrentStock: () => void;
}

export default function GoogleSheetsSetup({
  sheetsWebhookUrl,
  onSaveSheetsUrl,
  onTestSheetsUrl,
  onManualSync,
  onExportStockLogs,
  onExportCurrentStock,
}: GoogleSheetsSetupProps) {
  const [targetUrl, setTargetUrl] = useState(sheetsWebhookUrl);
  const [showCodeGuide, setShowCodeGuide] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const codeSample = `function doPost(e) {
  try {
    var sessionData = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (sessionData.action === "test") {
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    if (sessionData.action === "log") {
      var sheet = spreadsheet.getSheetByName("Stock Logs");
      if (!sheet) {
        sheet = spreadsheet.insertSheet("Stock Logs");
        sheet.appendRow(["កាលបរិច្ឆេទ", "កូដ/SKU", "ទំនិញ", "ប្រភេទ", "ចំនួន", "ស្តុកចុងក្រោយ", "មូលហេតុ"]);
      }
      sheet.appendRow([sessionData.date, sessionData.sku, sessionData.productName, sessionData.type, sessionData.qty, sessionData.newStock, sessionData.note]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    if (sessionData.action === "sale") {
      var sheet = spreadsheet.getSheetByName("Sales History");
      if (!sheet) {
        sheet = spreadsheet.insertSheet("Sales History");
        sheet.appendRow(["វិក្កយបត្រ", "កាលបរិច្ឆេទ", "អតិថិជន", "ទូរស័ព្ទ", "ចំនួន", "ទំនិញ", "សរុបរង", "បញ្ចុះតម្លៃ", "សរុបចុងក្រោយ", "ការទូទាត់", "ប្រាក់ទទួលបាន", "ប្រាក់អាប់"]);
      }
      sheet.appendRow([sessionData.invoiceId, sessionData.date, sessionData.customerName, sessionData.customerPhone, sessionData.totalQty, sessionData.itemsList, sessionData.subtotal, sessionData.discount, sessionData.netTotal, sessionData.paymentMethod, sessionData.cashReceived, sessionData.change]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSample);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSave = () => {
    if (targetUrl.trim() === '') {
      onSaveSheetsUrl('');
      return;
    }
    if (!targetUrl.includes('script.google.com/macros')) {
      alert('សូមបញ្ចូល Web App URL ដែលបានមកពី Google Apps Script ឲ្យបានត្រឹមត្រូវ!');
      return;
    }
    onSaveSheetsUrl(targetUrl);
  };

  return (
    <div className="border border-slate-200 rounded-3xl p-5 md:p-6 bg-white shadow-sm font-khmer mt-4">
      <h4 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2 mb-4">
        <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg text-xs md:text-sm">
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
        </span>
        <span>តភ្ជាប់ និងបញ្ជូនទៅ Google Sheets</span>
      </h4>

      <div className="space-y-1.5 mb-4">
        <label className="text-[11px] md:text-xs text-slate-500 font-bold px-1 uppercase tracking-wider font-sans">
          Google Apps Script Web App URL
        </label>
        <input
          type="text"
          placeholder="https://script.google.com/macros/s/..."
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:py-3.5 text-xs font-mono focus:ring-2 focus:ring-blue-100 outline-none text-slate-700"
        />
      </div>

      <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-xl border border-slate-100 font-sans">
        <span className="relative flex h-2.5 w-2.5 ml-2">
          {sheetsWebhookUrl ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </>
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-400"></span>
            </>
          )}
        </span>
        <span className={`text-[10px] md:text-xs font-bold font-khmer ${sheetsWebhookUrl ? 'text-emerald-600' : 'text-slate-500'}`}>
          {sheetsWebhookUrl ? 'បានភ្ជាប់ការតភ្ជាប់ជោគជ័យ (Connected)' : 'មិនទាន់មានការតភ្ជាប់ (Webhook Missing)'}
        </span>
      </div>

      <div className="flex space-x-3 mb-4">
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
      </div>

      {/* Code guide accordion */}
      <button
        type="button"
        onClick={() => setShowCodeGuide(!showCodeGuide)}
        className="w-full text-center text-xs text-blue-600 font-bold p-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl active:bg-blue-200 transition flex items-center justify-center gap-1.5"
      >
        <Info className="w-4 h-4" />
        <span>ស្វែងយល់ពីរបៀបដំឡើង Webhook លើ Google Sheets</span>
      </button>

      {showCodeGuide && (
        <div className="text-[11px] md:text-xs text-slate-600 bg-slate-800 p-4 rounded-2xl space-y-2 mt-3 text-left animate-fadeIn">
          <p className="font-bold text-white mb-1 font-khmer">ជំហានដំឡើង Code លើ Spreadsheet៖</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 ml-1 font-khmer">
            <li>បើក Google Sheet របស់អ្នក រួចចូលទៅកាន់ <b className="text-white">Extensions {`>`} Apps Script</b></li>
            <li>លុបកូដចាស់ៗចេញ រួច copy បិទកូដគំរូខាងក្រោមនេះចូល</li>
            <li>ចុច <b className="text-white">Deploy {`>`} New Deployment</b></li>
            <li>ជ្រើសរើសប្រភេទជម្រើស <b className="text-white">Web app</b> រួចកំណត់៖</li>
            <ul className="list-disc list-inside ml-6 text-slate-400">
              <li>Execute as: <span className="text-emerald-400 font-bold">Me (គណនីរបស់អ្នក)</span></li>
              <li>Who has access: <span className="text-emerald-400 font-bold">Anyone</span></li>
            </ul>
            <li>ចុច Deploy រួចចម្លង Web App URL មកដាក់ក្នុងប្រអប់ខាងលើជាការស្រេច!</li>
          </ol>
          <div className="relative mt-4">
            <pre className="text-slate-300 text-[9px] font-mono overflow-x-auto custom-scroll select-all leading-relaxed p-3 bg-slate-900 rounded-xl max-h-48">
              {codeSample}
            </pre>
            <button
              type="button"
              onClick={copyToClipboard}
              className="absolute right-2 top-2 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-[9px] font-bold active:scale-95 transition shadow-sm flex items-center gap-1"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
