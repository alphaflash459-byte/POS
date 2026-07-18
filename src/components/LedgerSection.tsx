/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  FileSpreadsheet,
  Trash2,
  Search,
  
  AlertCircle,
} from 'lucide-react';
import { StockLog } from '../types.ts';

interface LedgerSectionProps {
  stockLogs: StockLog[];
  onClearAllLogs: () => void;
  onDeleteSingleLog: (log: StockLog) => void;
}

export default function LedgerSection({
  stockLogs,
  onClearAllLogs,
  onDeleteSingleLog,
}: LedgerSectionProps) {
  

    const [searchText, setSearchText] = useState('');
  

  const filteredLogs = stockLogs.filter((log) => {
    const matchesSearch =
      log.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      log.sku.toLowerCase().includes(searchText.toLowerCase()) ||
      log.note.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  return (
    <section id="sec-sheets" className="flex flex-col gap-4 md:gap-6 w-full font-khmer animate-fadeIn">
      <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-5 w-full relative overflow-hidden">
        <div className="absolute -left-4 -top-4 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full opacity-50 pointer-events-none"></div>

        

        {/* Ledger Filter & Search controls */}
        <div className="flex flex-row gap-3 items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 z-10">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ស្វែងរកក្នុងកំណត់ត្រា..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            />
          </div>
          <button
            type="button"
            onClick={onClearAllLogs}
            className="bg-rose-50 border border-rose-200 text-rose-600 font-bold p-2.5 rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center shadow-sm active:scale-95 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
        </div>

        {/* Dynamic logs listing */}
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 z-10 bg-white rounded-3xl">
            <AlertCircle className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-xs md:text-sm font-semibold">មិនទាន់មានការផ្លាស់ប្តូរស្តុកឡើយ</p>
          </div>
        ) : (
          <>
            {/* Unified Table View */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden w-full z-10">
              <div className="overflow-x-hidden">
                <table className="w-full text-left text-sm text-slate-600 table-fixed">
                  <colgroup>
                    <col className="w-[28%] md:w-1/4" />
                    <col className="w-[38%] md:w-auto" />
                    <col className="w-[18%] md:w-1/6" />
                    <col className="w-[16%] md:w-1/6" />
                  </colgroup>
                  <thead className="bg-slate-50 text-slate-500 text-[10px] md:text-[11px] uppercase font-black tracking-wider border-b border-slate-200 font-sans">
                    <tr>
                      <th className="px-2 py-3 md:px-5 md:py-4">កាលបរិច្ឆេទ</th>
                      <th className="px-2 py-3 md:px-5 md:py-4">ទំនិញ</th>
                      <th className="px-1 py-3 md:px-5 md:py-4 text-center">ប្រភេទ</th>
                      <th className="px-2 py-3 md:px-5 md:py-4 text-right">ចំនួន</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-sans">
                    {filteredLogs.map((log) => {
                      const isEntry = log.type === 'IN';
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-2 py-2 md:px-5 md:py-3 text-slate-500 font-bold text-[9px] md:text-xs">
                            <span className="block font-medium">{new Date(log.timestamp).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                          </td>
                          <td className="px-2 py-2 md:px-5 md:py-3 min-w-0">
                            <span className="block font-bold text-slate-800 text-[11px] md:text-sm font-khmer truncate">
                              {log.productName}
                            </span>
                            
                          </td>
                          <td className="px-1 py-2 md:px-5 md:py-3 text-center">
                            <span
                              className={`inline-block px-1.5 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-[11px] font-bold font-khmer ${
                                isEntry ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {isEntry ? 'ចូលស្តុក' : 'លក់ចេញ'}
                            </span>
                          </td>
                          <td
                            className={`px-2 py-2 md:px-5 md:py-3 text-right font-black text-[11px] md:text-sm ${
                              isEntry ? 'text-emerald-600' : 'text-rose-500'
                            }`}
                          >
                            {isEntry ? '+' : '-'}
                            {log.qty}
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
