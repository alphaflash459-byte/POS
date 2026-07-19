/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Eye, X } from 'lucide-react';
import { Product } from '../types.ts';

interface InventorySectionProps {
  products: Product[];
  onOpenProductForm: (p?: Product) => void;
  onOpenRestock: (p: Product) => void;
  onDeleteProduct: (p: Product) => void;
}

export default function InventorySection({
  products,
  onOpenProductForm,
  onOpenRestock,
  onDeleteProduct,
}: InventorySectionProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.category.toLowerCase().includes(searchText.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAction = (action: 'restock' | 'edit' | 'delete', product: Product) => {
    setSelectedProduct(null);
    if (action === 'restock') onOpenRestock(product);
    if (action === 'edit') onOpenProductForm(product);
    if (action === 'delete') onDeleteProduct(product);
  };

  return (
    <section id="sec-inventory" className="flex flex-col gap-4 md:gap-6 w-full font-khmer">
      {/* Top Toolbar */}
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white rounded-full opacity-50 pointer-events-none"></div>
        

        <div className="flex flex-row gap-2 md:gap-3 w-full items-center z-10">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ស្វែងរកទំនិញ ឬកូដ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] md:text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
            />
          </div>
          <button
            type="button"
            onClick={() => onOpenProductForm()}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-2.5 px-3 md:px-5 rounded-2xl text-[11px] md:text-sm shadow-sm shadow-sm transition-all flex items-center justify-center gap-1.5 md:gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 md:w-4.5 md:h-4.5" />
            <span className="whitespace-nowrap">បន្ថែមទំនិញ</span>
          </button>
        </div>
      </div>

      {/* Main Container - The List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden w-full">
        <div className="overflow-x-hidden">
          <table className="w-full text-left text-sm text-slate-600 table-fixed">
            <colgroup>
              <col className="w-[46%] md:w-auto" />
              <col className="w-[18%] md:w-1/6" />
              <col className="w-[20%] md:w-1/6" />
              <col className="w-[16%] md:w-1/6" />
            </colgroup>
            <thead className="bg-slate-50 text-slate-500 text-[10px] md:text-[11px] uppercase font-black tracking-wider border-b border-slate-200 font-sans">
              <tr>
                <th className="px-2 py-3 md:px-5 md:py-4">ទំនិញ</th>
                <th className="px-1 py-3 md:px-5 md:py-4 text-center">កូដ</th>
                <th className="px-1 py-3 md:px-5 md:py-4 text-right">តម្លៃ</th>
                <th className="px-2 py-3 md:px-5 md:py-4 text-center">ស្តុក</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer active:bg-slate-100"
                  >
                    <td className="px-2 py-2 md:px-5 md:py-3 flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0 flex items-center justify-center relative shadow-sm">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300">
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 justify-center">
                        <span className="font-bold text-slate-800 text-[11px] md:text-sm truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-1 py-2 md:px-5 md:py-3 text-center font-bold font-mono tracking-wider text-slate-500 text-[9px] md:text-xs">
                      {p.sku || '-'}
                    </td>
                    <td className="px-1 py-2 md:px-5 md:py-3 text-right font-black text-blue-600 text-[11px] md:text-sm font-sans">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-2 py-2 md:px-5 md:py-3 text-center">
                      <span
                        className={`inline-block px-1.5 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-[11px] font-black font-sans ${
                          p.stock <= 5
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400 font-medium">
                    មិនមានទិន្នន័យទំនិញទេ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Action Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedProduct(null)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 w-full max-w-sm relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-200/60 bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">ព័ត៌មានទំនិញ</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Product Details */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 flex items-center justify-center relative shadow-sm">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Eye className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-800 text-lg leading-tight">{selectedProduct.name}</h4>
                  <span className="text-sm font-bold font-mono text-slate-500 mt-1">{selectedProduct.sku}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">តម្លៃលក់</span>
                  <span className="font-black text-blue-600 font-sans text-base">${selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">បរិមាណ (ស្តុក)</span>
                  <span className={`font-black font-sans text-base ${selectedProduct.stock <= 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {selectedProduct.stock}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">តម្លៃដើម</span>
                  <span className="font-bold text-slate-600 font-sans text-base">${selectedProduct.cost.toFixed(2)}</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">ក្រុម</span>
                  <span className="font-bold text-slate-600 text-sm">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-slate-200/60 flex gap-2">
              <button
                onClick={() => handleAction('restock', selectedProduct)}
                className="flex-1 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>+ស្តុក</span>
              </button>
              <button
                onClick={() => handleAction('edit', selectedProduct)}
                className="flex-1 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4.5 h-4.5" />
                <span>កែប្រែ</span>
              </button>
              <button
                onClick={() => handleAction('delete', selectedProduct)}
                className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition active:scale-95 flex items-center justify-center"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
