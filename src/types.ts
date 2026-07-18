/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  password?: string;
  role: string;
  createdAt?: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  color: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  timestamp: string;
  customerName: string;
  customerPhone: string;
  items: {
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      sku: string;
    };
  }[];
  subtotal: number;
  discount: number;
  netTotal: number;
  paymentMethod: 'CASH' | 'QR';
  cashReceived: number;
  changeDollar: number;
  changeRiel: number;
}

export interface StockLog {
  id: string;
  timestamp: string;
  sku: string;
  productName: string;
  type: 'IN' | 'OUT';
  qty: number;
  prevStock: number;
  newStock: number;
  note: string;
}

export interface ShopSettings {
  name: string;
  subtitle: string;
  address: string;
  phone: string;
  qrImage: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
