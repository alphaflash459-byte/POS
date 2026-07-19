/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ArrowLeft, ShoppingCart, Trash2, Minus, Plus, Banknote, QrCode, FileSpreadsheet, Package } from 'lucide-react';
import { Product, CartItem, ShopSettings } from '../types.ts';
import { CATEGORIES, EXCHANGE_RATE } from '../data.ts';

interface POSSectionProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (p: Product) => void;
  onUpdateCartQty: (productId: number, change: number) => void;
  onSetCartQty: (productId: number, qty: number) => void;
  onClearCart: () => void;
  onCheckout: (
    customerName: string,
    customerPhone: string,
    discount: number,
    paymentMethod: 'CASH' | 'QR',
    cashReceived: number
  ) => void;
  shopSettings: ShopSettings;
}

function CartQtyInput({ item, onSetQty, onRemove }: { item: CartItem, onSetQty: (id: number, qty: number) => void, onRemove: (id: number) => void }) {
  const [localVal, setLocalVal] = useState<string>(item.quantity.toString());

  useEffect(() => {
    if (parseInt(localVal) !== item.quantity) {
      setLocalVal(item.quantity.toString());
    }
  }, [item.quantity]);

  return (
    <input
      type="number"
      min="1"
      value={localVal}
      onChange={(e) => {
        setLocalVal(e.target.value);
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val > 0) {
          onSetQty(item.product.id, val);
        }
      }}
      onBlur={() => {
        const val = parseInt(localVal);
        if (isNaN(val) || val <= 0) {
          onRemove(item.product.id);
        }
      }}
      className="w-full text-center text-xs font-bold text-slate-800 font-sans bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
    />
  );
}

export default function POSSection({
  products,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onSetCartQty,
  onClearCart,
  onCheckout,
  shopSettings,
}: POSSectionProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCat, setSelectedCat] = useState('ទាំងអស់');
  const [posMobileView, setPosMobileView] = useState<'products' | 'cart'>('products');
  const [customerName, setCustomerName] = useState('អតិថិជនទូទៅ');
  const [customerPhone, setCustomerPhone] = useState('099 999 999');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QR'>('CASH');
  const [cashReceived, setCashReceived] = useState<string>('');

  // Cart math
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = cartSubtotal * (discount / 100);
  const netTotal = cartSubtotal - discountAmount;
  const netTotalRiel = Math.round(netTotal * EXCHANGE_RATE);

  const numCashReceived = parseFloat(cashReceived) || 0;
  const changeValue = netTotal > 0 && numCashReceived >= netTotal ? numCashReceived - netTotal : 0;
  const changeValueRiel = Math.round(changeValue * EXCHANGE_RATE);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === 'ទាំងអស់' || p.category === selectedCat;
    const matchesSearch =
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchText.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'CASH') {
      if (numCashReceived < netTotal) {
        alert('ប្រាក់ទទួលបានមិនគ្រាន់ទេ! Please enter a valid Cash Received value.');
        return;
      }
    }
    onCheckout(
      customerName,
      customerPhone,
      discount,
      paymentMethod,
      paymentMethod === 'QR' ? netTotal : numCashReceived
    );
    // Reset secondary POS form values on successful checkout
    setCashReceived('');
    setDiscount(0);
  };

  const totalCartQty = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <section id="sec-pos" className="block w-full">


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Panel: Products Grid List (Visible either on screen size or if mobile toggle is 'products') */}
        <div
          className={`lg:col-span-7 xl:col-span-8 flex flex-col gap-4 ${
            posMobileView === 'products' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Search, Filter Category */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex gap-3 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white rounded-full opacity-50 pointer-events-none"></div>

            <div className="relative flex-1 z-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ស្វែងរកទំនិញ ឬលេខកូដ..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs md:text-sm font-medium"
              />
            </div>

            {/* Categories Dropdown */}
            <div className="relative w-[110px] md:w-48 z-10 shrink-0">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full pl-3 md:pl-4 pr-8 md:pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-[11px] md:text-sm font-bold text-slate-700 appearance-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Catalog Selection */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/60 flex-grow min-h-[350px]">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Trash2 className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-xs md:text-sm font-semibold">មិនមានទំនិញក្នុងស្តុកឡើយ</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-h-[550px] overflow-y-auto custom-scroll pr-1">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  return (
                    <div
                      key={p.id}
                      onClick={() => !isOutOfStock && onAddToCart(p)}
                      className={`group relative flex flex-col justify-between p-3 rounded-2xl border transition-all duration-200 transform active:scale-[0.96] ${
                        isOutOfStock
                          ? 'border-slate-200 bg-slate-50 opacity-65 cursor-not-allowed'
                          : 'border-slate-200/60 hover:border-blue-400 bg-white shadow-sm hover:shadow-sm cursor-pointer'
                      }`}
                    >
                      <div className="h-24 sm:h-28 w-full rounded-2xl overflow-hidden mb-3 relative bg-slate-100 shadow-sm">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className={`absolute inset-0 ${p.color || 'bg-slate-100 text-slate-800'} flex flex-col justify-center items-center`}>
                            <Package className="w-6 h-6 opacity-60 mb-1" />
                          </div>
                        )}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-rose-600/70 backdrop-blur-sm flex items-center justify-center text-white font-bold text-[9px] uppercase tracking-wide">
                            អស់ពីស្តុក
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight mb-1">
                          {p.name}
                        </h4>
                        <span className="block text-[9px] text-slate-400 font-bold tracking-wide">
                          {p.sku || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/60 border-dashed font-sans">
                        <span className="text-sm font-black text-blue-600">${p.price.toFixed(2)}</span>
                        <span
                          className={`text-[9px] font-bold ${
                            p.stock <= 5 ? 'text-rose-600 bg-rose-50' : 'text-slate-500 bg-slate-100'
                          } px-2 py-0.5 rounded-lg`}
                        >
                          📦 {p.stock}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Checkout Panel (Visible on screen size or if mobile toggle is 'cart') */}
        <div
          className={`lg:col-span-5 xl:col-span-4 lg:flex flex-col gap-4 ${
            posMobileView === 'cart' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-sm shadow-sm border border-slate-200/60 flex flex-col h-full min-h-[500px] overflow-hidden">
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPosMobileView('products')}
                  className="lg:hidden mr-2 p-2 rounded-xl bg-slate-200/50 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                  <ShoppingCart className="w-4 h-4 text-blue-700" />
                </div>
                <span className="font-black text-slate-800 text-sm md:text-base">កន្ត្រកទំនិញ</span>
              </div>
              <button
                type="button"
                onClick={onClearCart}
                className="text-[11px] text-rose-500 hover:text-rose-600 font-bold transition-colors flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-100 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>សម្អាត</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="p-4 md:p-5 bg-slate-50/40 border-b border-slate-200/60 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wider">
                  ឈ្មោះអតិថិជន
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold text-slate-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wider">
                  លេខទូរស័ព្ទ
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold text-slate-700"
                />
              </div>
            </div>

            {/* Cart item listing */}
            <div className="flex-grow overflow-y-auto max-h-[250px] custom-scroll p-4 md:p-5 divide-y divide-slate-100">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 h-full">
                  <ShoppingCart className="w-10 h-10 text-slate-200 mb-3 animate-pulse" />
                  <p className="text-xs font-semibold">មិនទាន់មានទំនិញឡើយ</p>
                </div>
              ) : (
                cart.map((item) => {
                  const subTotal = item.product.price * item.quantity;
                  return (
                    <div key={item.product.id} className="flex justify-between items-center py-3 gap-3">
                      <div className="flex-grow min-w-0 font-sans">
                        <span className="block text-xs font-bold text-slate-800 truncate font-khmer">
                          {item.product.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block">
                          ${item.product.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center flex-shrink-0 w-16">
                        <CartQtyInput 
                          item={item} 
                          onSetQty={onSetCartQty} 
                          onRemove={(id) => onUpdateCartQty(id, -item.quantity)} 
                        />
                      </div>

                      <div className="w-16 text-right flex-shrink-0">
                        <span className="text-sm font-black text-blue-600 font-sans">
                          ${subTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Calculations and payment */}
            <div className="p-4 md:p-5 border-t border-slate-200/60 bg-slate-50/80 font-sans mt-auto">
              <div className="space-y-2.5 text-xs md:text-sm mb-4">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span className="font-khmer font-bold">សរុបរង៖</span>
                  <span className="font-bold text-slate-800 block">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 items-center font-medium">
                  <span className="font-khmer font-bold">បញ្ចុះតម្លៃ (Discount %)៖</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount || ''}
                    onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
                <div className="flex justify-between text-blue-900 font-black text-sm md:text-base pt-3 border-t border-slate-200">
                  <span className="font-khmer font-medium text-slate-800">សរុបចុងក្រោយ៖</span>
                  <span className="text-blue-600 font-black">${netTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-4">
                <label className="block text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider font-khmer">
                  ការទូទាត់ប្រាក់
                </label>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <label
                    className={`flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-white transition-all bg-white shadow-sm ${
                      paymentMethod === 'CASH'
                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-100'
                        : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method-selector"
                      checked={paymentMethod === 'CASH'}
                      onChange={() => setPaymentMethod('CASH')}
                      className="hidden"
                    />
                    <Banknote className="w-4.5 h-4.5 text-emerald-500" />
                    <span className="text-[11px] md:text-xs font-bold text-slate-700">សាច់ប្រាក់ (Cash)</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-white transition-all bg-white shadow-sm ${
                      paymentMethod === 'QR'
                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-100'
                        : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method-selector"
                      checked={paymentMethod === 'QR'}
                      onChange={() => setPaymentMethod('QR')}
                      className="hidden"
                    />
                    <QrCode className="w-4.5 h-4.5 text-indigo-500" />
                    <span className="text-[11px] md:text-xs font-bold text-slate-700">ស្កេន QR</span>
                  </label>
                </div>
              </div>

              {/* Cash Section */}
              {paymentMethod === 'CASH' && (
                <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-200 mb-4 space-y-3 shadow-sm font-sans">
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-slate-600 font-bold font-khmer">ប្រាក់ទទួលបាន ($)៖</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      className="w-24 md:w-28 px-3 py-2 text-right bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm font-black text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 font-bold font-khmer">ប្រាក់អាប់ជូនវិញ៖</span>
                    <span
                      className={`font-black text-sm block ${
                        netTotal > 0 && numCashReceived < netTotal
                          ? 'text-rose-500 text-xs'
                          : 'text-emerald-600'
                      }`}
                    >
                      {netTotal === 0 ? (
                        '$0.00 / 0 ៛'
                      ) : numCashReceived < netTotal ? (
                        'មិនគ្រប់គ្រាន់'
                      ) : (
                        `$${changeValue.toFixed(2)} / ${changeValueRiel.toLocaleString()} ៛`
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Pay trigger */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                disabled={cart.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl shadow-sm shadow-sm transition-all transform active:scale-95 flex justify-center items-center gap-2 text-xs md:text-sm"
              >
                <FileSpreadsheet className="w-4.5 h-4.5" />
                <span>ទូទាត់ប្រាក់</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Cart Button (Mobile) */}
      {posMobileView === 'products' && (
        <button
          type="button"
          onClick={() => setPosMobileView('cart')}
          className="lg:hidden fixed bottom-[90px] right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(37,99,235,0.4)] transition-transform active:scale-90 flex items-center justify-center"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalCartQty > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
              {totalCartQty}
            </span>
          )}
        </button>
      )}
    </section>
  );
}
