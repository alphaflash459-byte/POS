/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  QrCode,
  DollarSign,
  Coffee,
  AlertTriangle,
  Printer,
  FileDown,
  Info,
  CheckCircle,
  Package,
  Boxes
} from 'lucide-react';
import { Product, Transaction, ShopSettings } from '../types.ts';
import { EXCHANGE_RATE } from '../data.ts';

// ----------------------------------------------------
// 1. PRODUCT CREATOR & EDITOR MODAL
// ----------------------------------------------------
interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (p: {
    id?: number;
    sku: string;
    name: string;
    category: string;
    cost: number;
    price: number;
    stock: number;
    color: string;
    image?: string;
  }) => void;
}

export function ProductModal({ isOpen, product, onClose, onSave }: ProductModalProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('ភេសជ្ជៈ');
  const [cost, setCost] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [color, setColor] = useState('bg-blue-100 text-blue-800');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setCategory(product.category);
      setCost(product.cost);
      setPrice(product.price);
      setStock(product.stock);
      setColor(product.color);
      setImage(product.image || '');
    } else {
      setName('');
      setSku('');
      setCategory('ភេសជ្ជៈ');
      setCost(0);
      setPrice(0);
      setStock(0);
      setColor('bg-blue-100 text-blue-800');
      setImage('');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleDeviceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max_size = 300;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setImage(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: product?.id,
      name: name.trim(),
      sku: sku.trim() || 'SKU-' + Date.now().toString().slice(-4),
      category,
      cost: Number(cost) || 0,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      color,
      image,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end md:items-center z-[60] p-0 md:p-4 font-khmer">
      <div className="bg-white w-full max-w-md md:max-w-lg rounded-t-[32px] md:rounded-[32px] p-6 pb-6 shadow-2xl relative max-h-[95vh] flex flex-col">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 md:hidden shrink-0"></div>
        
        {/* Title */}
        <div className="flex justify-between items-center pb-4 shrink-0 border-b border-slate-100 mb-4">
          <h3 className="text-lg md:text-xl font-black text-slate-800">
            {product ? 'កែប្រែព័ត៌មានទំនិញ (Edit Item)' : 'បន្ថែមទំនិញថ្មី (Add New Item)'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-200 bg-slate-100 text-slate-500 rounded-full active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto custom-scroll shrink pr-1 pb-2">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                ឈ្មោះទំនិញ (Item Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ឧ. ទឹកក្រូច កូកាកូឡា..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-bold text-slate-800"
              />
            </div>

            {/* Image Pick */}
            <div className="space-y-1.5">
              <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                រូបភាពទំនិញ (Image Asset)
              </label>
              <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative">
                  {image ? (
                    <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Upload className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-grow">
                  <input
                    type="file"
                    id="prod-image-file-input"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDeviceImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('prod-image-file-input')?.click()}
                    className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 border border-slate-200 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    <Upload className="w-4 h-4 text-blue-600" /> Upload Image
                  </button>
                  <p className="text-[10px] text-slate-400 mt-1.5 truncate max-w-[200px] font-medium font-sans">
                    {image ? 'បានរៀបចំរូបភាពរួចរាល់' : 'គាំទ្ររាល់ទម្រង់ជាប្រភេទ PNG, JPG'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                  លេខកូដ / SKU
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="ឧ. SKU001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-xs md:text-sm focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider font-sans">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-xs md:text-sm focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-bold text-slate-800 appearance-none"
                >
                  <option value="ភេសជ្ជៈ">ភេសជ្ជៈ (Drink)</option>
                  <option value="អាហារ">អាហារ (Food)</option>
                  <option value="នំចម្រុះ">នំចម្រុះ (Snack)</option>
                  <option value="គ្រឿងទេស">គ្រឿងទេស (Groceries)</option>
                  <option value="ទូទៅ">ទូទៅ (Other)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider font-sans">
                  Retail Price ($) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={price || ''}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-black text-blue-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                  ចំនួនស្តុក (In Stock) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock || ''}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  placeholder="10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-black text-slate-800"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex space-x-3 shrink-0 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 hover:bg-slate-200 bg-slate-100 text-slate-700 font-bold text-xs md:text-sm py-3.5 md:py-4 rounded-2xl active:bg-slate-200 transition"
          >
            បោះបង់ (Cancel)
          </button>
          <button
            type="submit"
            form="product-form"
            className="flex-1 hover:bg-blue-700 bg-blue-600 text-white font-bold text-xs md:text-sm py-3.5 md:py-4 rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 transition"
          >
            រក្សាទុកទំនិញ (Save Item)
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. QUICK RESTOCK MODAL
// ----------------------------------------------------
interface RestockModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (qty: number, cost: number | null, note: string) => void;
}

export function RestockModal({ isOpen, product, onClose, onSave }: RestockModalProps) {
  const [qty, setQty] = useState<number | ''>('');
  const [cost, setCost] = useState<string>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    setQty('');
    setCost('');
    setNote('');
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleExecute = () => {
    const numQty = Number(qty);
    if (!numQty || numQty <= 0) {
      alert('សូមបញ្ចូលចំនួនបន្ថែមដែលមានតម្លៃធំជាង០ ! Please specify a valid quantity.');
      return;
    }
    const finalCost = cost.trim() !== '' ? parseFloat(cost) : null;
    onSave(numQty, finalCost, note.trim() || 'បញ្ចូលស្តុកបន្ថែម (Q-Restock)');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end md:items-center z-[60] p-0 md:p-4 font-khmer animate-fadeIn">
      <div className="bg-white w-full max-w-sm md:max-w-md rounded-t-[32px] md:rounded-[32px] p-6 pb-6 shadow-2xl relative">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 md:hidden"></div>

        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-500" />
            <span>បញ្ចូលស្តុកបន្ថែម (Restock Item)</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-200 bg-slate-100 text-slate-500 rounded-full active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative text-slate-300">
              {product.image ? (
                <img src={product.image} className="w-full h-full object-cover animate-fadeIn" referrerPolicy="no-referrer" />
              ) : (
                <Package className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 font-sans">
                Item Name
              </span>
              <p className="font-black text-slate-800 text-sm md:text-base leading-tight">
                {product.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 font-sans">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-khmer">
                ស្តុកបច្ចុប្បន្ន
              </span>
              <p className="font-black text-slate-700 text-lg md:text-xl mt-1">{product.stock}</p>
            </div>
            
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
              ចំនួនបន្ថែមចូលស្តុក (Quantity) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || '')}
              placeholder="ឧ. ៥០"
              className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition outline-none font-black text-emerald-700"
            />
          </div>

          

          <div className="space-y-1.5">
            <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
              មូលហេតុបញ្ជាក់ (Memo Note)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ឧ. ទិញចូលពីក្រុមហ៊ុនលក់ដុំ..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-xs md:text-sm focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-medium text-slate-700"
            />
          </div>
        </div>

        <div className="pt-5 mt-2 flex space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 hover:bg-slate-200 bg-slate-100 text-slate-700 font-bold text-xs md:text-sm py-3.5 md:py-4 rounded-2xl active:bg-slate-200 transition"
          >
            បោះបង់
          </button>
          <button
            type="button"
            onClick={handleExecute}
            className="flex-1 hover:bg-emerald-600 bg-emerald-500 text-white font-bold text-xs md:text-sm py-3.5 md:py-4 rounded-2xl shadow-lg shadow-emerald-500/30 active:scale-95 transition"
          >
            បញ្ជាក់ការបញ្ចូល (Save)
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. SHOP CONFIGURATION SETTINGS MODAL
// ----------------------------------------------------
interface ShopSettingsModalProps {
  isOpen: boolean;
  settings: ShopSettings;
  onClose: () => void;
  onSave: (s: ShopSettings) => void;
}

export function ShopSettingsModal({ isOpen, settings, onClose, onSave }: ShopSettingsModalProps) {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    setName(settings.name);
    setSubtitle(settings.subtitle);
    setPhone(settings.phone);
    setAddress(settings.address);
    setQrImage(settings.qrImage);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleQRImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max_size = 300;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setQrImage(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      subtitle: subtitle.trim(),
      phone: phone.trim(),
      address: address.trim(),
      qrImage,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end md:items-center z-[80] p-0 md:p-4 font-khmer">
      <div className="bg-white w-full max-w-md md:max-w-lg rounded-t-[32px] md:rounded-[32px] p-6 pb-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 shrink-0 md:hidden"></div>

        <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0 mb-4">
          <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            <span>ការកំណត់ហាង (Shop Profile Tools)</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-200 bg-slate-100 text-slate-500 rounded-full active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scroll shrink pr-1 pb-2">
          <form id="shop-settings-form" onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                ឈ្មោះហាង (Shop Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-bold text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                អក្សររត់ពីក្រោម (Subtitle Header)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-xs md:text-sm focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-medium text-slate-700"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                  លេខទូរស័ព្ទ (Store Contact)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-xs md:text-sm focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-bold text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
                  អាសយដ្ឋាន (Store Location)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:py-3.5 text-xs md:text-sm focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition outline-none font-medium text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] md:text-xs font-bold text-slate-500 px-1 uppercase tracking-wider mt-1 block">
                រូបភាព QR Code (ABA/K-KHQR Scanner asset)
              </label>
              <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm p-1">
                  {qrImage ? (
                    <img src={qrImage} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <QrCode className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-grow">
                  <input
                    type="file"
                    id="setting-qr-image-input"
                    accept="image/*"
                    className="hidden"
                    onChange={handleQRImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('setting-qr-image-input')?.click()}
                    className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 border border-slate-200 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    <QrCode className="w-4 h-4 text-indigo-600" /> Upload QR Block
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="pt-4 mt-2 border-t border-slate-100 flex space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 hover:bg-slate-200 bg-slate-100 text-slate-700 font-bold text-xs md:text-sm py-3.5 md:py-4 rounded-2xl active:bg-slate-200 transition"
          >
            បោះបង់
          </button>
          <button
            type="submit"
            form="shop-settings-form"
            className="flex-1 hover:bg-blue-700 bg-blue-600 text-white font-bold text-xs md:text-sm py-3.5 md:py-4 rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 transition"
          >
            រក្សាទុកការកំណត់
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. DONATE/SUPPORT COFFEE MODAL
// ----------------------------------------------------
interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[120] p-4 font-khmer transition-opacity animate-fadeIn">
      <div className="bg-white w-full max-w-sm md:max-w-md rounded-[32px] p-6 md:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 md:w-40 h-32 md:h-40 bg-emerald-50 rounded-full opacity-60 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 md:w-40 h-32 md:h-40 bg-blue-50 rounded-full opacity-60 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mx-auto flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-emerald-100 text-emerald-600 mb-3 md:mb-4 shadow-inner">
            <Coffee className="w-7 h-7 text-emerald-700 animate-bounce" />
          </div>

          <h3 className="text-lg md:text-xl font-black text-slate-800 mb-1">ឧបត្ថម្ភការអភិវឌ្ឍន៍ (Support Dev)</h3>
          <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mb-4 md:mb-6 px-2">
            ការឧបត្ថម្ភទិញកាហ្វេរបស់អ្នក គឺជាកម្លាំងចិត្តដ៏ធំធេងក្នុងការបន្តធ្វើបច្ចុប្បន្នភាព និងថែទាំប្រព័ន្ធលក់ទំនិញនេះឲ្យកាន់តែល្អប្រសើរ!
          </p>

          <div className="bg-slate-50 p-2 md:p-3 rounded-2xl md:rounded-3xl border-2 border-dashed border-emerald-200 inline-block mb-2 md:mb-4 shadow-sm">
            <img
              src="https://images.weserv.nl/?url=drive.google.com/uc?id=1bfnPJ74GTiX9kOr14axZpHSkvO27TQvH"
              alt="Donate ABA Block"
              className="w-48 md:w-56 h-auto object-contain rounded-xl shadow-inner"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/e2e8f0/475569?text=ABA+KHQR+Scan';
              }}
            />
          </div>

          <div className="text-[10px] md:text-xs font-bold text-slate-400 mb-5 md:mb-6 tracking-widest uppercase font-sans">
            Scan QR with ABA or any Banking App
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full hover:bg-slate-700 bg-slate-800 text-white font-bold text-sm md:text-base py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-md active:scale-95 transition"
          >
            បិទផ្ទាំងនេះ (Close Support)
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. INVOICE PDF/PRINT SLIP SHEET MODAL
// ----------------------------------------------------
interface InvoiceModalProps {
  isOpen: boolean;
  txn: Transaction | null;
  shopSettings: ShopSettings;
  onClose: () => void;
  onDownloadPDF: () => void;
}

export function InvoiceModal({ isOpen, txn, shopSettings, onClose, onDownloadPDF }: InvoiceModalProps) {
  if (!isOpen || !txn) return null;

  const totalQty = txn.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4 print-hidden font-khmer">
      <div className="bg-white w-full max-w-md md:max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[95vh] shadow-2xl relative">
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-slate-100 bg-slate-50 shrink-0">
          <h3 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>វិក្កយបត្រ (Invoice Slip)</span>
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={onDownloadPDF}
              className="p-2 px-3 hover:bg-blue-100 text-blue-700 font-bold text-xs md:text-sm bg-blue-50 rounded-xl transition active:scale-95 flex items-center gap-1.5 border border-blue-100"
            >
              <FileDown className="w-4 h-4" />
              <span>វិក្កយបត្រ PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 font-bold rounded-xl text-slate-600 transition active:scale-95 flex items-center gap-1"
            >
              <Printer className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 bg-slate-100 text-slate-500 rounded-full transition active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable view sheet */}
        <div
          id="invoice-pdf-template"
          className="overflow-y-auto p-6 md:p-8 custom-scroll bg-white shrink text-slate-800"
        >
          {/* Shop Header */}
          <div className="text-center mb-5 border-b border-dashed border-slate-300 pb-4">
            <div className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-900 text-white mb-2 shadow-sm">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-sm md:text-base font-black text-slate-900 leading-snug">
              {shopSettings.name || 'ហាងលក់ភេសជ្ជៈ'}
            </h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              {shopSettings.subtitle || 'POS SYSTEM'}
            </p>
            {shopSettings.address && (
              <p className="text-[10px] text-slate-600 mt-2">
                អាសយដ្ឋាន៖ {shopSettings.address}
              </p>
            )}
            {shopSettings.phone && (
              <p className="text-[10px] text-slate-600 font-bold mt-0.5 font-sans">
                ទូរស័ព្ទ៖ {shopSettings.phone}
              </p>
            )}
          </div>

          <div className="text-center mb-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest bg-slate-100 inline-block px-3 py-1 rounded-full">
              វិក្កយបត្រលក់ (Order Receipt)
            </h3>
            <p className="text-[11px] font-bold text-slate-500 mt-1.5 font-sans">
              {txn.id}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 font-sans">
            <div className="grid grid-cols-2 gap-y-1.5 text-[10px] md:text-xs">
              <div className="text-slate-500 font-bold font-khmer">អតិថិជន៖</div>
              <div className="font-black text-right text-slate-800 font-khmer">{txn.customerName}</div>

              <div className="text-slate-500 font-bold font-khmer">ទូរស័ព្ទ៖</div>
              <div className="font-black text-right text-slate-800">{txn.customerPhone}</div>

              <div className="text-slate-500 font-bold font-khmer">កាលបរិច្ឆេទ៖</div>
              <div className="font-bold text-right text-slate-800 font-khmer">{txn.date}</div>

              <div className="text-slate-500 font-bold font-khmer">ការទូទាត់៖</div>
              <div className="font-bold text-right text-slate-800 font-khmer">
                {txn.paymentMethod === 'QR' ? 'QR Core Scan' : 'សាច់ប្រាក់ (Cash)'}
              </div>
            </div>
          </div>

          {/* Table Items */}
          <table className="w-full text-[10px] md:text-[11px] text-left mb-4 font-sans">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-700 font-black uppercase tracking-wider pb-1">
                <th className="pb-2 font-khmer">ទំនិញ (Item)</th>
                <th className="pb-2 text-center">ចំនួន (Qty)</th>
                <th className="pb-2 text-right">តម្លៃ (Price)</th>
                <th className="pb-2 text-right">សរុប (Total)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {txn.items.map((i, idx) => (
                <tr key={idx} className="border-b border-slate-100/50">
                  <td className="py-2 text-slate-800 font-khmer font-bold">{i.product.name}</td>
                  <td className="py-2 text-center text-slate-600 font-sans">{i.quantity}</td>
                  <td className="py-2 text-right text-slate-600 font-sans">${i.product.price.toFixed(2)}</td>
                  <td className="py-2 text-right font-black text-slate-900 font-sans">
                    ${(i.product.price * i.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="border-t border-slate-300 pt-3 space-y-1.5 text-[10px] md:text-xs">
            <div className="flex justify-between text-slate-600 font-bold font-sans">
              <span className="font-khmer">សរុបរង (Subtotal)៖</span>
              <span className="font-black text-slate-800">${txn.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-bold font-sans">
              <span className="font-khmer font-bold">បញ្ចុះតម្លៃ (Discount)៖</span>
              <span className="font-black text-rose-500">{txn.discount}%</span>
            </div>
            <div className="flex justify-between items-center border-t-2 border-slate-800 pt-2 mt-2 pb-2 border-b border-dashed border-slate-300 font-sans">
              <span className="font-black text-[11px] md:text-sm text-slate-900 font-khmer">
                សរុបចុងក្រោយ (NET TOTAL)៖
              </span>
              <span className="font-black text-sm md:text-lg text-slate-900">
                ${txn.netTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[9px] md:text-[10px] text-slate-500 font-bold font-sans">
              <span className="font-khmer">គិតជាប្រាក់រៀល (KHR)៖</span>
              <span className="font-black text-slate-700">
                {Math.round(txn.netTotal * EXCHANGE_RATE).toLocaleString()} ៛
              </span>
            </div>
          </div>

          {/* Cash Details or QR scan */}
          {txn.paymentMethod === 'CASH' ? (
            <div className="mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-sans">
              <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-600 mb-1">
                <span className="font-khmer">ប្រាក់ទទួលបាន (Received)៖</span>
                <span className="text-slate-800 font-black">${txn.cashReceived.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-600">
                <span className="font-khmer">ប្រាក់អាប់ជូនវិញ (Change)៖</span>
                <span className="text-slate-800 font-black">
                  ${txn.changeDollar.toFixed(2)} / {txn.changeRiel.toLocaleString()} ៛
                </span>
              </div>
            </div>
          ) : (
            shopSettings.qrImage && (
              <div className="mt-4 flex flex-col items-center justify-center animate-fadeIn">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-sans">
                  ទូទាត់រហ័សតាម QR Scan (Scan to Pay)
                </p>
                <div className="w-24 h-24 p-1.5 border-2 border-dashed border-slate-300 rounded-xl bg-white flex items-center justify-center">
                  <img
                    src={shopSettings.qrImage}
                    alt="KHQR Scan block"
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )
          )}

          <div className="text-center mt-8 text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <p className="mb-0.5 text-slate-500">សូមអរគុណសម្រាប់ការគាំទ្រ!</p>
            <p>សូមអរគុណ!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. CONFISCATED DELETION DIALOGS
// ----------------------------------------------------
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning';
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'លុបចេញ (Delete)',
  cancelLabel = 'បោះបង់ (Cancel)',
  type = 'danger',
  onConfirm,
  onClose,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[110] p-4 transition-opacity font-khmer animate-fadeIn">
      <div className="bg-white w-full max-w-xs md:max-w-sm rounded-[32px] p-6 md:p-8 text-center space-y-4 shadow-2xl">
        <div
          className={`mx-auto flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full mb-2 ${
            type === 'danger' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'
          }`}
        >
          <AlertTriangle className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-800">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed px-2">
          {message}
        </p>
        <div className="flex space-x-3 mt-4 pt-2 md:pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 hover:bg-slate-200 bg-slate-100 text-slate-700 font-bold text-sm md:text-base py-3.5 md:py-4 rounded-xl md:rounded-2xl active:bg-slate-200 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 text-white font-bold text-sm md:text-base py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-md active:scale-95 transition ${
              type === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
