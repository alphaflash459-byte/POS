/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types.ts';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: 'DRK001',
    name: 'កូកាកូឡា កំប៉ុង (Coca-Cola)',
    category: 'ភេសជ្ជៈ',
    cost: 0.35,
    price: 0.60,
    stock: 45,
    color: 'bg-rose-100 text-rose-800',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop'
  },
  {
    id: 2,
    sku: 'DRK002',
    name: 'ទឹកបរិសុទ្ធ វីតាល់ 500ml',
    category: 'ភេសជ្ជៈ',
    cost: 0.12,
    price: 0.25,
    stock: 120,
    color: 'bg-blue-100 text-blue-800',
    image: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=300&h=300&fit=crop'
  },
  {
    id: 3,
    sku: 'SNK001',
    name: `នំដំឡូងបារាំង Lay's Classic`,
    category: 'នំចម្រុះ',
    cost: 0.70,
    price: 1.20,
    stock: 35,
    color: 'bg-amber-100 text-amber-800',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop'
  },
  {
    id: 4,
    sku: 'FOD001',
    name: 'មីម៉ាម៉ា រសជាតិសាច់ជ្រូកចិញ្ច្រាំ',
    category: 'អាហារ',
    cost: 0.18,
    price: 0.35,
    stock: 80,
    color: 'bg-emerald-100 text-emerald-800',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop'
  },
  {
    id: 5,
    sku: 'GRO001',
    name: 'ទឹកស៊ីអ៊ីវ ម៉ាកសញ្ញាផ្កាឈូក',
    category: 'គ្រឿងទេស',
    cost: 0.95,
    price: 1.50,
    stock: 24,
    color: 'bg-purple-100 text-purple-800',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=300&h=300&fit=crop'
  },
  {
    id: 6,
    sku: 'DRK003',
    name: 'កាហ្វេ កំប៉ុង Birdy ឡាតេ',
    category: 'ភេសជ្ជៈ',
    cost: 0.45,
    price: 0.75,
    stock: 50,
    color: 'bg-amber-100 text-amber-800',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop'
  }
];

export const CATEGORIES = ['ទាំងអស់', 'ភេសជ្ជៈ', 'អាហារ', 'នំចម្រុះ', 'គ្រឿងទេស', 'ទូទៅ'];

export const EXCHANGE_RATE = 4100;
