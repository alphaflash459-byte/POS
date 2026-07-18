/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileSpreadsheet, Receipt, Printer, Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { Transaction } from '../types.ts';

interface HistorySectionProps {
  salesHistory: Transaction[];
  onReprint: (t: Transaction) => void;
  onDeleteInvoice: (t: Transaction) => void;
  onExportSalesHistory: () => void;
}

export default function HistorySection({
  salesHistory,
  onReprint,
  onDeleteInvoice,
  onExportSalesHistory,
}: HistorySectionProps) {
  // Aggregate stats
  const invoiceCount = salesHistory.length;
  const totalRevenue = salesHistory.reduce((sum, t) => sum + t.netTotal, 0);

  return (
    <section id="sec-history" className="flex flex-col gap-4 md:gap-6 w-full font-khmer animate-fadeIn">
      {/* Top Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {/* Total Invoices count card */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
              <Receipt className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider block">
              វិក្កយបត្រសរុប (Total Sales)
            </span>
          </div>
          <span className="text-2xl md:text-4xl font-black text-slate-800 pl-1 font-sans">
            {invoiceCount}
          </span>
        </div>

        {/* Revenue aggregate sum card */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50"></div>
          <div className="flex items-center gap-3 mb-2 z-10">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider block">
              ចំណូលសរុប (Revenue)
            </span>
          </div>
          <span className="text-2xl md:text-4xl font-black text-emerald-600 pl-1 z-10 font-sans">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>

        {/* Export and download toolbar card */}
        <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-4 md:p-6 shadow-md text-white flex flex-col justify-center items-center text-center">
          <p className="text-xs md:text-sm font-medium opacity-80 mb-3">
            នាំចេញទិន្នន័យការលក់ទាំងអស់ជា Excel (Download Excel Report)
          </p>
          <button
            type="button"
            onClick={onExportSalesHistory}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/20"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>ទាញយក Excel (Export Sales)</span>
          </button>
        </div>
      </div>

      {/* History table view log */}
      <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 w-full animate-fadeIn">
        <h2 className="text-base md:text-lg font-black text-slate-800 mb-4 md:mb-6">
          ប្រវត្តិនៃការលក់ និងវិក្កយបត្រ (Sales Order History Log)
        </h2>

        {salesHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50 rounded-3xl">
            <Receipt className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-xs md:text-sm font-semibold">មិនទាន់មានការលក់នៅឡើយទេ</p>
          </div>
        ) : (
          <>
            {/* Unified Table View */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden w-full">
              <div className="overflow-x-hidden">
                <table className="w-full text-left text-sm text-slate-600 table-fixed">
                  <colgroup>
                    <col className="w-[30%] md:w-1/4" />
                    <col className="w-[30%] md:w-auto" />
                    <col className="w-[20%] md:w-1/6" />
                    <col className="w-[20%] md:w-1/6" />
                  </colgroup>
                  <thead className="bg-slate-50 text-slate-500 text-[10px] md:text-[11px] uppercase font-black tracking-wider border-b border-slate-200 font-sans">
                    <tr>
                      <th className="px-2 py-3 md:px-5 md:py-4">វិក្កយបត្រ</th>
                      <th className="px-2 py-3 md:px-5 md:py-4">អតិថិជន</th>
                      <th className="px-2 py-3 md:px-5 md:py-4 text-right">សរុប</th>
                      <th className="px-2 py-3 md:px-5 md:py-4 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-sans">
                    {salesHistory.map((txn) => {
                      const totalQty = txn.items.reduce((s, i) => s + i.quantity, 0);
                      return (
                        <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-2 py-2 md:px-5 md:py-3 min-w-0">
                            <span className="font-bold text-blue-700 text-[11px] md:text-sm block truncate">{txn.id}</span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 font-medium block mt-0.5 truncate">{txn.date}</span>
                          </td>
                          <td className="px-2 py-2 md:px-5 md:py-3 min-w-0">
                            <span className="font-bold text-slate-800 font-khmer text-[11px] md:text-sm block truncate">
                              {txn.customerName}
                            </span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 font-bold block mt-0.5 truncate">
                              {txn.customerPhone}
                            </span>
                          </td>
                          <td className="px-2 py-2 md:px-5 md:py-3 text-right">
                            <span className="block text-[11px] md:text-sm font-black text-slate-800 truncate">${txn.netTotal.toFixed(2)}</span>
                            <span className="block text-[9px] md:text-[10px] text-slate-400 mt-0.5">
                              {totalQty} មុខ
                            </span>
                          </td>
                          <td className="px-2 py-2 md:px-5 md:py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 md:gap-2">
                              <button
                                type="button"
                                onClick={() => onReprint(txn)}
                                className="p-1.5 md:p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg md:rounded-xl transition active:scale-95"
                                title="Reprint Invoice"
                              >
                                <Printer className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-blue-700" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteInvoice(txn)}
                                className="p-1.5 md:p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg md:rounded-xl transition active:scale-95"
                                title="Delete Transaction"
                              >
                                <Trash2 className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-rose-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
