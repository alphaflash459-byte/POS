/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  User as UserIcon,
  Coffee,
  Cloud,
  Users,
  Settings,
  FileSpreadsheet,
  Shield,
  Key,
  Lock,
  LogOut,
  Store,
  Database
} from 'lucide-react';
import { User } from './types';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase.ts';

export const APP_ID = 'a1ea9197-82a2-4aa9-90e8-83d92913d4d5';

import { Product, CartItem, Transaction, StockLog, ShopSettings, ToastMessage } from './types.ts';
import { DEFAULT_PRODUCTS, EXCHANGE_RATE } from './data.ts';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import POSSection from './components/POSSection.tsx';
import InventorySection from './components/InventorySection.tsx';
import LedgerSection from './components/LedgerSection.tsx';
import HistorySection from './components/HistorySection.tsx';
import LoginScreen from './components/LoginScreen.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import GoogleSheetsSetup from './components/GoogleSheetsSetup.tsx';
import {
  ProductModal,
  RestockModal,
  ShopSettingsModal,
  DonateModal,
  InvoiceModal,
  ConfirmationModal
} from './components/Modals.tsx';

import SubscriptionScreen from './components/SubscriptionScreen.tsx';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'pos' | 'inventory' | 'sheets' | 'history' | 'admin'>('pos');

  // Core database states
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<Transaction[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState('');
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [shopSettings, setShopSettings] = useState<ShopSettings>({
    name: 'ហាងលក់ភេសជ្ជៈ',
    subtitle: 'POS SYSTEM',
    address: 'ផ្លូវលំ ផ្ទះលេខ៤២ ស្រុកបរសេដ្ឋ ខេត្តកំពង់ស្ពឺ',
    phone: '016 603 398 / 096 72 46 727',
    qrImage: 'https://placehold.co/150x150/f1f5f9/94a3b8?text=QR'
  });

  // User Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals controllers
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState<Product | null>(null);

  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedRestockProduct, setSelectedEditRestockProduct] = useState<Product | null>(null);

  const [isShopSettingsOpen, setIsShopSettingsOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState<'profile' | 'shop' | 'sync'>('profile');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Transaction | null>(null);

  // Confirmation Alert Dialogs Context
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isDeleteLogOpen, setIsDeleteLogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<StockLog | null>(null);

  const [isDeleteInvoiceOpen, setIsDeleteInvoiceOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Transaction | null>(null);

  const [isClearLogsOpen, setIsClearAllLogsOpen] = useState(false);

  // Firestore DB helper writers for cloud operations
  const saveProductToFirestore = async (p: Product) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', APP_ID, 'users', user.id, 'products', String(p.id));
      await setDoc(docRef, {
        sku: p.sku || '',
        name: p.name || '',
        category: p.category || '',
        cost: Number(p.cost) || 0,
        price: Number(p.price) || 0,
        stock: Number(p.stock) || 0,
        color: p.color || '',
        image: p.image || ''
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `products/${user.id}/${p.id}`);
    }
  };

  const deleteProductFromFirestore = async (productId: number) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', APP_ID, 'users', user.id, 'products', String(productId));
      await deleteDoc(docRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `products/${user.id}/${productId}`);
    }
  };

  const saveSaleToFirestore = async (txn: Transaction) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', APP_ID, 'users', user.id, 'sales', txn.id);
      await setDoc(docRef, txn);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `sales/${user.id}/${txn.id}`);
    }
  };

  const deleteSaleFromFirestore = async (txnId: string) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', APP_ID, 'users', user.id, 'sales', txnId);
      await deleteDoc(docRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `sales/${user.id}/${txnId}`);
    }
  };

  const saveLogToFirestore = async (log: StockLog) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', APP_ID, 'users', user.id, 'stock_logs', log.id);
      await setDoc(docRef, log);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `stock_logs/${user.id}/${log.id}`);
    }
  };

  const deleteLogFromFirestore = async (logId: string) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', APP_ID, 'users', user.id, 'stock_logs', logId);
      await deleteDoc(docRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `stock_logs/${user.id}/${logId}`);
    }
  };

  const saveShopSettingsToFirestore = async (settings: ShopSettings) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', APP_ID, 'users', user.id, 'settings', 'shop');
      await setDoc(docRef, settings);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `settings/${user.id}/shop`);
    }
  };

  const saveWebappUrlToFirestore = async (url: string, autoSync: boolean) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', APP_ID, 'users', user.id, 'settings', 'config');
      await setDoc(docRef, { sheetsWebhookUrl: url, isAutoSyncEnabled: autoSync });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `settings/${user.id}/config`);
    }
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      setUserRole(null);
      setActiveUserId(null);
      setProducts([]);
      setSalesHistory([]);
      setStockLogs([]);
      showToast('បានចាកចេញពីគណនី!', 'info');
    } catch (e) {
      showToast('ការចាកចេញបានបរាជ័យ', 'error');
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setUserRole(loggedInUser.role as 'admin' | 'user');
    setActiveUserId(loggedInUser.id);
    if (loggedInUser.role === 'admin') {
      setCurrentTab('admin_dashboard');
    } else {
      setCurrentTab('pos');
    }
    showToast(`ស្វាគមន៍ ${loggedInUser.username}!`, 'success');
  };
  const handleRegister = async (username: string, password: string) => {
    try {
      const newUserId = 'user_' + Date.now();
      const newUser = {
        username: username,
        password: password,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'artifacts', APP_ID, 'app_users', newUserId), newUser);
      showToast('គណនីថ្មីត្រូវបានបង្កើតដោយជោគជ័យ!', 'success');
      
      const loggedInUser = { id: newUserId, ...newUser } as User;
      setUser(loggedInUser);
      setUserRole('user');
      setActiveUserId(newUserId);
      setCurrentTab('pos');
    } catch (e) {
      console.error(e);
      showToast('បរាជ័យក្នុងការបង្កើតគណនី!', 'error');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('មិនទាន់បានចូលគណនី!', 'error');
      return;
    }
    
    // Check if current password matches
    if (currentPassword !== user.password) {
      showToast('លេខសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវទេ!', 'error');
      return;
    }

    if (newPassword.length < 4) {
      showToast('លេខសម្ងាត់ថ្មីត្រូវតែមានយ៉ាងហោចណាស់ ៤ ខ្ទង់!', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('លេខសម្ងាត់ថ្មី និងការបញ្ជាក់មិនត្រូវគ្នាទេ!', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await setDoc(doc(db, 'artifacts', APP_ID, 'app_users', user.id), {
        ...user,
        password: newPassword
      });
      showToast('ផ្លាស់ប្ដូរលេខសម្ងាត់ជោគជ័យ!', 'success');
      // Reset state
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (err) {
      console.error(err);
      showToast('មានបញ្ហាក្នុងការប្តូរលេខសម្ងាត់!', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };



  // Listen to users from Firestore directly
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'artifacts', APP_ID, 'app_users'), (snapshot) => {
      const list: User[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({ 
          id: d.id, 
          username: data.displayName || data.username || d.id, 
          password: data.password || '12345678',
          role: data.role || 'user',
          subscriptionEnd: data.subscriptionEnd,
          subscriptionPlan: data.subscriptionPlan,
          ...data
        } as User);
      });
      
      if (list.length === 0) {
        const createAdmin = async () => {
          await setDoc(doc(db, 'artifacts', APP_ID, 'app_users', 'admin'), {
            username: 'Admin',
            displayName: 'Admin',
            role: 'admin',
            password: '12345678',
            createdAt: new Date().toISOString()
          });
        };
        createAdmin();
      } else {
        setUsers(list);
        setIsInitializing(false);
        // If a user is currently logged in, update their local state too
        if (activeUserId) {
          const updatedActiveUser = list.find(u => u.id === activeUserId);
          if (updatedActiveUser) {
            setUser(updatedActiveUser);
          }
        }
      }
    }, (error) => {
      console.error("Error fetching users", error);
      setIsInitializing(false);
    });
    return () => unsub();
  }, [activeUserId]);

  // Data Sync Listener based on activeUserId
  useEffect(() => {
    if (!activeUserId) return;
    
    const userId = activeUserId;
    
    const productsRef = collection(db, 'artifacts', APP_ID, 'users', userId, 'products');
    const salesRef = collection(db, 'artifacts', APP_ID, 'users', userId, 'sales');
    const stockLogsRef = collection(db, 'artifacts', APP_ID, 'users', userId, 'stock_logs');
    const shopSettingsRef = doc(db, 'artifacts', APP_ID, 'users', userId, 'settings', 'shop');
    const configRef = doc(db, 'artifacts', APP_ID, 'users', userId, 'settings', 'config');

    // Products Realtime Listeners
    const unsubProducts = onSnapshot(productsRef, (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((d) => {
        const item = d.data();
        list.push({
          id: Number(d.id),
          sku: item.sku || '',
          name: item.name || '',
          category: item.category || '',
          cost: Number(item.cost) || 0,
          price: Number(item.price) || 0,
          stock: Number(item.stock) || 0,
          color: item.color || '',
          image: item.image || ''
        });
      });
      setProducts(list);
    }, (error) => {
      console.warn("Could not fetch products:", error);
    });

    // Sales History Realtime Listeners
    const unsubSales = onSnapshot(salesRef, (snapshot) => {
      const list: Transaction[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Transaction);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setSalesHistory(list);
    }, (error) => {
      console.warn("Could not fetch sales:", error);
    });

    // Stock Logs Realtime Listeners
    const unsubLogs = onSnapshot(stockLogsRef, (snapshot) => {
      const list: StockLog[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as StockLog);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setStockLogs(list);
    }, (error) => {
      console.warn("Could not fetch logs:", error);
    });

    // Shop Settings Doc Listener
    const unsubShop = onSnapshot(shopSettingsRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setShopSettings(docSnapshot.data() as ShopSettings);
      }
    });

    // Webhook URL Doc Listener
    const unsubConfig = onSnapshot(configRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data) {
          if (data.sheetsWebhookUrl !== undefined) {
            setSheetsWebhookUrl(data.sheetsWebhookUrl);
          }
          if (data.isAutoSyncEnabled !== undefined) {
            setIsAutoSyncEnabled(data.isAutoSyncEnabled);
          }
        }
      }
    });

    return () => {
      unsubProducts();
      unsubSales();
      unsubLogs();
      unsubShop();
      unsubConfig();
    };
  }, [activeUserId]);

  // Inject html2pdf dynamically for PDF exporting download
  useEffect(() => {
    if (!document.getElementById('html2pdf-cdn')) {
      const s = document.createElement('script');
      s.id = 'html2pdf-cdn';
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  // Toast notifier
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // ----------------------------------------------------
  // GOOGLE SHEETS API HANDLERS
  // ----------------------------------------------------
  const triggerGoogleSheetsLog = async (log: StockLog) => {
    if (!sheetsWebhookUrl || !isAutoSyncEnabled) return;
    const payload = {
      action: 'log',
      date: new Date(log.timestamp).toLocaleString('km-KH'),
      sku: log.sku,
      productName: log.productName,
      type: log.type === 'IN' ? 'ចូលស្តុក' : 'ចេញស្តុក',
      qty: log.qty,
      newStock: log.newStock,
      note: log.note
    };
    try {
      await fetch(sheetsWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {}
  };

  const triggerGoogleSheetsSale = async (txn: Transaction) => {
    if (!sheetsWebhookUrl || !isAutoSyncEnabled) return;
    const totalQty = txn.items.reduce((sum, item) => sum + item.quantity, 0);
    const itemsList = txn.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ');
    const payload = {
      action: 'sale',
      invoiceId: txn.id,
      date: txn.date,
      customerName: txn.customerName,
      customerPhone: txn.customerPhone,
      totalQty: totalQty,
      itemsList: itemsList,
      subtotal: txn.subtotal,
      discount: txn.discount,
      netTotal: txn.netTotal,
      paymentMethod: txn.paymentMethod === 'QR' ? 'QR Code Scanned' : 'Cash Paid',
      cashReceived: txn.cashReceived,
      change: txn.changeDollar
    };
    try {
      await fetch(sheetsWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {}
  };

  const handleToggleAutoSync = async () => {
    const nextVal = !isAutoSyncEnabled;
    setIsAutoSyncEnabled(nextVal);
    await saveWebappUrlToFirestore(sheetsWebhookUrl, nextVal);
    showToast(nextVal ? 'បានបើកមុខងារបញ្ជូនស្វ័យប្រវត្ត!' : 'បានបិទមុខងារបញ្ជូនស្វ័យប្រវត្ត!', 'info');
  };

  const handleTestSheetsConnection = async () => {
    if (!sheetsWebhookUrl.trim()) {
      showToast('សូមបញ្ចូល Web App URL មុននឹងធ្វើការសាកល្បង!', 'error');
      return;
    }
    showToast('កំពុងតភ្ជាប់ទៅកាន់ Google Sheet...', 'info');
    try {
      await fetch(sheetsWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' })
      });
      showToast('ការតភ្ជាប់ដំណើរការបានយ៉ាងល្អប្រសើរ!', 'success');
    } catch (e) {
      showToast('ការតភ្ជាប់ទៅកាន់ Google Sheet បរាជ័យ!', 'error');
    }
  };

  const handleManualSyncAll = async () => {
    if (!sheetsWebhookUrl.trim()) {
      showToast('សូមកំណត់ Google Sheets Webhook URL ជាមុនសិន!', 'error');
      return;
    }
    showToast('កំពុងបញ្ជូនទិន្នន័យ (Bulk Synchronization)...', 'info');
    const logsPayload = stockLogs.map((log) => ({
      date: new Date(log.timestamp).toLocaleString('km-KH'),
      sku: log.sku || '-',
      productName: log.productName,
      type: log.type === 'IN' ? 'ចូលស្តុក' : 'ចេញស្តុក',
      qty: log.qty,
      newStock: log.newStock,
      note: log.note
    }));
    const salesPayload = salesHistory.map((txn) => {
      const qtySum = txn.items.reduce((s, i) => s + i.quantity, 0);
      return {
        invoiceId: txn.id,
        date: txn.date,
        customerName: txn.customerName,
        customerPhone: txn.customerPhone,
        totalQty: qtySum,
        itemsList: txn.items.map((i) => `${i.product.name}(x${i.quantity})`).join(', '),
        subtotal: txn.subtotal,
        discount: txn.discount,
        netTotal: txn.netTotal,
        paymentMethod: txn.paymentMethod === 'QR' ? 'QR Code Scanned' : 'Cash Paid',
        cashReceived: txn.cashReceived,
        change: txn.changeDollar
      };
    });

    try {
      await fetch(sheetsWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_bulk',
          logs: logsPayload,
          sales: salesPayload
        })
      });
      showToast('ធ្វើសមកាលកម្មទិន្នន័យទូទៅជោគជ័យ!', 'success');
    } catch (e) {
      showToast('សមកាលកម្មទិន្នន័យបរាជ័យ!', 'error');
    }
  };

  // ----------------------------------------------------
  // CART ACTIONS
  // ----------------------------------------------------
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        if (prevCart[idx].quantity >= product.stock) {
          showToast(`មិនអាចបន្ថែមបានទៀតទេ ស្តុកមានត្រឹម ${product.stock} !`, 'error');
          return prevCart;
        }
        const updated = [...prevCart];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      } else {
        if (product.stock <= 0) {
          showToast(`ទំនិញអស់ពីស្តុកហើយ!`, 'error');
          return prevCart;
        }
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

    const handleSetCartQty = (productId: number, qty: number) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => item.product.id === productId);
      if (idx === -1) return prevCart;

      const newQty = qty;
      if (newQty <= 0) {
        return prevCart.filter((item) => item.product.id !== productId);
      } else if (newQty > prevCart[idx].product.stock) {
        showToast(`ស្តុកមានកំណត់ត្រឹម ${prevCart[idx].product.stock} !`, 'error');
        // Optionally set to max stock
        const updated = [...prevCart];
        updated[idx].quantity = prevCart[idx].product.stock;
        return updated;
      }

      const updated = [...prevCart];
      updated[idx].quantity = newQty;
      return updated;
    });
  };

  const handleUpdateCartQty = (productId: number, change: number) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => item.product.id === productId);
      if (idx === -1) return prevCart;

      const newQty = prevCart[idx].quantity + change;
      if (newQty <= 0) {
        return prevCart.filter((item) => item.product.id !== productId);
      } else if (newQty > prevCart[idx].product.stock) {
        showToast(`ស្តុកមានកំណត់ត្រឹម ${prevCart[idx].product.stock} !`, 'error');
        return prevCart;
      } else {
        const updated = [...prevCart];
        updated[idx] = { ...updated[idx], quantity: newQty };
        return updated;
      }
    });
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    showToast('បានសម្អាតកន្ត្រកទំនិញ!', 'info');
  };

  const handleCheckout = (
    customerName: string,
    customerPhone: string,
    discount: number,
    paymentMethod: 'CASH' | 'QR',
    cashReceived: number
  ) => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountAmount = subtotal * (discount / 100);
    const netTotal = subtotal - discountAmount;
    const changeDollar = paymentMethod === 'CASH' ? cashReceived - netTotal : 0;
    const changeRiel = Math.round(changeDollar * EXCHANGE_RATE);

    const invoiceId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleString('km-KH', { hour12: true });

    const newTransaction: Transaction = {
      id: invoiceId,
      date: currentDate,
      timestamp: new Date().toISOString(),
      customerName,
      customerPhone,
      items: cart.map((i) => ({
        quantity: i.quantity,
        product: {
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          sku: i.product.sku
        }
      })),
      subtotal,
      discount,
      netTotal,
      paymentMethod,
      cashReceived,
      changeDollar,
      changeRiel
    };

    // Deduct stock levels and add ledger events
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((i) => i.product.id === prod.id);
      if (cartItem) {
        const nStock = Math.max(0, prod.stock - cartItem.quantity);
        return { ...prod, stock: nStock };
      }
      return prod;
    });

    const newLogs: StockLog[] = [];
    cart.forEach((item) => {
      const prodInDatabase = products.find((p) => p.id === item.product.id);
      if (prodInDatabase) {
        const nStock = Math.max(0, prodInDatabase.stock - item.quantity);
        const l: StockLog = {
          id: 'LOG-' + Date.now() + '-' + Math.random().toString().slice(-4),
          timestamp: new Date().toISOString(),
          sku: prodInDatabase.sku,
          productName: prodInDatabase.name,
          type: 'OUT',
          qty: item.quantity,
          prevStock: prodInDatabase.stock,
          newStock: nStock,
          note: `លក់ (វិក្កយបត្រ៖ ${invoiceId})`
        };
        newLogs.push(l);
        triggerGoogleSheetsLog(l);
      }
    });

    setProducts(updatedProducts);
    setStockLogs([...newLogs, ...stockLogs]);
    setSalesHistory([newTransaction, ...salesHistory]);

    if (user) {
      saveSaleToFirestore(newTransaction);
      for (const log of newLogs) {
        saveLogToFirestore(log);
      }
      for (const p of updatedProducts) {
        // Only write updated products that were in the cart
        const inCart = cart.some((item) => item.product.id === p.id);
        if (inCart) {
          saveProductToFirestore(p);
        }
      }
    }

    triggerGoogleSheetsSale(newTransaction);
    setActiveInvoice(newTransaction);
    setCart([]);
    showToast('ការលក់ទូទាត់ជោគជ័យ!', 'success');
  };

  // ----------------------------------------------------
  // PRODUCT & GENERAL LEDGER MANIPULATIONS
  // ----------------------------------------------------
  const handleProductSave = (payload: {
    id?: number;
    sku: string;
    name: string;
    category: string;
    cost: number;
    price: number;
    stock: number;
    color: string;
    image?: string;
  }) => {
    let updatedProducts: Product[] = [];
    const editId = payload.id;

    if (editId) {
      // Edit
      const orig = products.find((p) => p.id === editId);
      updatedProducts = products.map((p) =>
        p.id === editId
          ? {
              ...p,
              name: payload.name,
              sku: payload.sku,
              category: payload.category,
              cost: payload.cost,
              price: payload.price,
              stock: payload.stock,
              color: payload.color,
              image: payload.image
            }
          : p
      );

      // Inventory adjustment log events
      if (orig && orig.stock !== payload.stock) {
        const adjustType = payload.stock > orig.stock ? 'IN' : 'OUT';
        const adjustQty = Math.abs(payload.stock - orig.stock);
        const l: StockLog = {
          id: 'LOG-ADJ-' + Date.now(),
          timestamp: new Date().toISOString(),
          sku: payload.sku,
          productName: payload.name,
          type: adjustType,
          qty: adjustQty,
          prevStock: orig.stock,
          newStock: payload.stock,
          note: 'កែសម្រួលស្តុកដោយផ្ទាល់ (Inventory Adjustment)'
        };
        setStockLogs([l, ...stockLogs]);
        triggerGoogleSheetsLog(l);
        if (user) {
          saveLogToFirestore(l);
        }
      }
      if (user) {
        const editedProd = updatedProducts.find((p) => p.id === editId);
        if (editedProd) saveProductToFirestore(editedProd);
      }
      showToast('កែប្រែព័ត៌មានទំនិញរួចរាល់!', 'success');
    } else {
      // Add
      const newId = Date.now();
      const nProd: Product = {
        id: newId,
        name: payload.name,
        sku: payload.sku,
        category: payload.category,
        cost: payload.cost,
        price: payload.price,
        stock: payload.stock,
        color: payload.color,
        image: payload.image
      };
      updatedProducts = [nProd, ...products];

      const l: StockLog = {
        id: 'LOG-ADD-' + Date.now(),
        timestamp: new Date().toISOString(),
        sku: payload.sku,
        productName: payload.name,
        type: 'IN',
        qty: payload.stock,
        prevStock: 0,
        newStock: payload.stock,
        note: 'បញ្ចូលទំនិញថ្មីដំបូង'
      };
      setStockLogs([l, ...stockLogs]);
      triggerGoogleSheetsLog(l);
      if (user) {
        saveProductToFirestore(nProd);
        saveLogToFirestore(l);
      }
      showToast('បានបង្កើតទំនិញថ្មីជោគជ័យ!', 'success');
    }

    setProducts(updatedProducts);
    setIsProductModalOpen(false);
    setSelectedEditProduct(null);
  };

  const handleRestockSave = (addQty: number, nextCost: number | null, noteText: string) => {
    if (!selectedRestockProduct) return;
    const orig = selectedRestockProduct;
    const finalCost = nextCost !== null ? nextCost : orig.cost;
    const finalNewStock = orig.stock + addQty;

    const updated = products.map((p) =>
      p.id === orig.id ? { ...p, stock: finalNewStock, cost: finalCost } : p
    );

    const l: StockLog = {
      id: 'LOG-RSTK-' + Date.now(),
      timestamp: new Date().toISOString(),
      sku: orig.sku,
      productName: orig.name,
      type: 'IN',
      qty: addQty,
      prevStock: orig.stock,
      newStock: finalNewStock,
      note: noteText || 'បញ្ចូលស្តុកបន្ថែម (Bulk Store Restock)'
    };

    setProducts(updated);
    setStockLogs([l, ...stockLogs]);
    triggerGoogleSheetsLog(l);
    if (user) {
      const p = updated.find((prod) => prod.id === orig.id);
      if (p) saveProductToFirestore(p);
      saveLogToFirestore(l);
    }
    setIsRestockModalOpen(false);
    setSelectedEditRestockProduct(null);
    showToast(`បានបញ្ចូលស្តុកបន្ថែម +${addQty}!`, 'success');
  };

  // ----------------------------------------------------
  // EXCEL & DATA EXPORTS (SHEETJS MODULE CONTROLS)
  // ----------------------------------------------------
  const handleExportStockLogs = () => {
    if (stockLogs.length === 0) return showToast('គ្មានកំណត់ត្រាសម្រាប់ការនាំចេញ!', 'error');
    const rows = stockLogs.map((l) => ({
      'កាលបរិច្ឆេទ': new Date(l.timestamp).toLocaleString('km-KH'),
      'កូដ/SKU': l.sku,
      'ឈ្មោះទំនិញ': l.productName,
      'ប្រភេទ': l.type === 'IN' ? 'ចូលស្តុក' : 'លក់ចេញ',
      'ចំនួន': l.qty,
      'ស្តុកចុងក្រោយ': l.newStock,
      'មូលហេតុ': l.note
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Logs Event');
    XLSX.writeFile(wb, 'ប្រវត្តិចេញចូលស្តុក.xlsx');
    showToast('នាំចេញប្រវត្តិចេញចូលស្តុក ជោគជ័យ!', 'success');
  };

  const handleExportCurrentStock = () => {
    if (products.length === 0) return showToast('គ្មានទិន្នន័យដើម្បីនាំចេញ!', 'error');
    const rows = products.map((p) => ({
      'លេខកូដ/SKU': p.sku,
      'ឈ្មោះទំនិញ': p.name,
      'ក្រុម (Category)': p.category,
      'តម្លៃដើម ($)': p.cost,
      'តម្លៃលក់ ($)': p.price,
      'ស្តុកបច្ចុប្បន្ន': p.stock
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Catalog');
    XLSX.writeFile(wb, 'ស្តុកទំនិញបច្ចុប្បន្ន.xlsx');
    showToast('នាំចេញបញ្ជីស្តុកទំនិញបច្ចុប្បន្ន ជោគជ័យ!', 'success');
  };

  const handleExportSalesHistory = () => {
    if (salesHistory.length === 0) return showToast('គ្មានប្រវត្តិការលក់សម្រាប់ការនាំចេញទេ!', 'error');
    const rows = salesHistory.map((t) => ({
      'លេខវិក្កយបត្រ': t.id,
      'កាលបរិច្ឆេទ': t.date,
      'អតិថិជន': t.customerName,
      'លេខទូរស័ព្ទ': t.customerPhone,
      'ចំនួនសរុប': t.items.reduce((s, i) => s + i.quantity, 0),
      'ទំនិញ': t.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', '),
      'សរុបរង ($)': t.subtotal,
      'បញ្ចុះតម្លៃ (%)': t.discount,
      'សរុបចុងក្រោយ ($)': t.netTotal,
      'ការទូទាត់': t.paymentMethod === 'QR' ? 'QR Code' : 'Cash',
      'ប្រាក់ទទួលបាន ($)': t.cashReceived,
      'ប្រាក់អាប់ ($)': t.changeDollar
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales History');
    XLSX.writeFile(wb, `របាយការណ៍លក់_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('នាំចេញប្រវត្តិការលក់រួចរាល់ ជោគជ័យ!', 'success');
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-pdf-template');
    if (!element) return;
    
    showToast('កំពុងបង្កើតឯកសារ PDF...', 'info');
    try {
      // Temporarily prepare the element for perfect capturing (avoid cutoffs and scrollbars)
      const originalStyle = element.getAttribute('style') || '';
      const originalClassName = element.className;
      
      element.style.height = 'auto';
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
      element.classList.remove('overflow-y-auto');
      
      const canvas = await html2canvas(element, {
        scale: 2, // 2x scale for ultra crisp text and graphics
        useCORS: true, // Support loaded images/resources
        backgroundColor: '#ffffff', // Clean white background
        logging: false,
      });
      
      // Restore original container styling
      element.setAttribute('style', originalStyle);
      element.className = originalClassName;
      
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Add a small margin of 0.2 inches on each side for professional printable look
      pdf.addImage(imgData, 'JPEG', 0.2, 0.2, pdfWidth - 0.4, pdfHeight);
      pdf.save(`វិក្កយបត្រ-${activeInvoice?.id || 'invoice'}.pdf`);
      showToast('ទាញយក PDF ជោគជ័យ!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('បរាជ័យក្នុងការបង្កើត PDF!', 'error');
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-500 font-medium">កំពុងរៀបចំប្រព័ន្ធ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative font-sans">
        {/* Dynamic Toast popup stack */}
        <div className="fixed top-6 md:top-10 left-1/2 transform -translate-x-1/2 z-[150] flex flex-col space-y-2 pointer-events-none w-[90%] max-w-sm md:max-w-md print-hidden">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-4 py-3 rounded-2xl shadow-xl flex items-center justify-start text-xs md:text-sm font-bold gap-3 relative overflow-hidden animate-fadeIn ${
                t.type === 'error'
                  ? 'bg-rose-600 text-white shadow-rose-600/30'
                  : t.type === 'info'
                  ? 'bg-slate-800 text-white shadow-slate-800/30'
                  : 'bg-blue-600 text-white shadow-blue-600/30'
              }`}
            >
              {t.type === 'error' ? (
                <AlertCircle className="w-5 h-5 shrink-0 text-white-300" />
              ) : t.type === 'info' ? (
                <Info className="w-5 h-5 shrink-0 text-white-300" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-white-300" />
              )}
              <div className="flex-grow leading-snug">{t.message}</div>
            </div>
          ))}
        </div>
        <LoginScreen users={users} onLogin={handleLogin} onRegister={handleRegister} />
      </div>
    );
  }

  const isSubscribed = userRole === 'admin' || (user.subscriptionEnd && new Date(user.subscriptionEnd) > new Date());

  if (!isSubscribed) {
    return (
      <SubscriptionScreen 
        user={user} 
        onLogout={handleLogout} 
        onSuccess={() => {
          showToast('ការផ្ទៀងផ្ទាត់ជោគជ័យ! សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ', 'success');
          // Reload user data slightly
          const updatedUsers = [...users];
          const userIdx = updatedUsers.findIndex(u => u.id === user.id);
          if (userIdx > -1) {
            const now = new Date();
            // Just local update to unblock UI instantly, the realtime listener might be better but App_users listener doesn't update `user` state directly if activeUserId is already set unless we update `user` state.
            setUser({
              ...user,
              subscriptionEnd: new Date(now.setFullYear(now.getFullYear() + 1)).toISOString() // fake local update, actual handled in SubscriptionScreen
            });
          }
        }} 
      />
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row w-full font-sans bg-white print-app-container">
      {/* Dynamic Toast popup stack */}
      <div className="fixed top-6 md:top-10 left-1/2 transform -translate-x-1/2 z-[150] flex flex-col space-y-2 pointer-events-none w-[90%] max-w-sm md:max-w-md print-hidden">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center justify-start text-xs md:text-sm font-bold gap-3 relative overflow-hidden animate-fadeIn ${
              t.type === 'error'
                ? 'bg-rose-600 text-white shadow-rose-600/30'
                : t.type === 'info'
                ? 'bg-slate-800 text-white shadow-slate-800/30'
                : 'bg-blue-600 text-white shadow-blue-600/30'
            }`}
          >
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white rounded-full opacity-10 pointer-events-none"></div>
            {t.type === 'error' ? (
              <AlertCircle className="w-5 h-5 shrink-0 text-white-300" />
            ) : t.type === 'info' ? (
              <Info className="w-5 h-5 shrink-0 text-white-300" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-white-300" />
            )}
            <div className="flex-grow leading-snug">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        shopSettings={shopSettings}
        sheetsWebhookUrl={sheetsWebhookUrl}
        onOpenShopSettings={() => setIsShopSettingsOpen(true)}
        onOpenDonate={() => setIsDonateOpen(true)}
        userRole={userRole}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f1f5f9] order-1 md:order-2 relative z-10 print-hidden">
        <Header
            shopSettings={shopSettings}
            sheetsWebhookUrl={sheetsWebhookUrl}
            onOpenShopSettings={() => setIsShopSettingsOpen(true)}
            onOpenDonate={() => setIsDonateOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            user={user}
            userRole={userRole}
            isAutoSyncEnabled={isAutoSyncEnabled}
          />

        {/* Content View Overlay */}
        <main className="flex-1 overflow-y-auto custom-scroll relative w-full pb-4 md:pb-8">
          <div className="w-full">
            {/* Show view panels conditionally */}
            {currentTab === 'pos' && (
              <POSSection
                products={products}
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
                onSetCartQty={handleSetCartQty}
                onClearCart={handleClearCart}
                onCheckout={handleCheckout}
                shopSettings={shopSettings}
              />
            )}

            {currentTab === 'inventory' && (
              <InventorySection
                products={products}
                onOpenProductForm={(p) => {
                  setSelectedEditProduct(p || null);
                  setIsProductModalOpen(true);
                }}
                onOpenRestock={(p) => {
                  setSelectedEditRestockProduct(p);
                  setIsRestockModalOpen(true);
                }}
                onDeleteProduct={(p) => {
                  setProductToDelete(p);
                  setIsDeleteProductOpen(true);
                }}
              />
            )}

            {currentTab.startsWith('admin_') && userRole === 'admin' && (
              <div className="md:mt-0 mt-8">
                <AdminPanel
                  activeTab={currentTab.replace('admin_', '')}
                  onSetActiveUser={setActiveUserId}
                  activeUserId={activeUserId}
                  onToast={showToast}
                />
              </div>
            )}

            {currentTab === 'sheets' && (
              <LedgerSection
                stockLogs={stockLogs}
                onClearAllLogs={() => setIsClearAllLogsOpen(true)}
                onDeleteSingleLog={(log) => {
                  setLogToDelete(log);
                  setIsDeleteLogOpen(true);
                }}
              />
            )}

            {currentTab === 'history' && (
              <HistorySection
                salesHistory={salesHistory}
                onReprint={(txn) => {
                  setActiveInvoice(txn);
                }}
                onDeleteInvoice={(txn) => {
                  setInvoiceToDelete(txn);
                  setIsDeleteInvoiceOpen(true);
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* ----------------------------------------------------
          MODALS WRAPPER SYSTEM
      ---------------------------------------------------- */}

      {/* Product Creator & Editor Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        product={selectedEditProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedEditProduct(null);
        }}
        onSave={handleProductSave}
      />

      {/* Quick Restock modal controls */}
      <RestockModal
        isOpen={isRestockModalOpen}
        product={selectedRestockProduct}
        onClose={() => {
          setIsRestockModalOpen(false);
          setSelectedEditRestockProduct(null);
        }}
        onSave={handleRestockSave}
      />

      {/* Customize general shop info */}
      <ShopSettingsModal
        isOpen={isShopSettingsOpen}
        settings={shopSettings}
        onClose={() => setIsShopSettingsOpen(false)}
        onSave={(s) => {
          setShopSettings(s);
          localStorage.setItem('pos_settings', JSON.stringify(s));
          if (user) {
            saveShopSettingsToFirestore(s);
          }
          setIsShopSettingsOpen(false);
          showToast('រក្សាទុកការកំណត់ហាងជោគជ័យ!', 'success');
        }}
      />

      {/* Coffee Support scan sheet */}
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />

      {/* Invoice receipt print popup sheet */}
      <InvoiceModal
        isOpen={!!activeInvoice}
        txn={activeInvoice}
        shopSettings={shopSettings}
        onClose={() => setActiveInvoice(null)}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* profile & Google integration dialog trigger */}
      {isProfileOpen && (
        <div 
          onClick={() => {
            setIsProfileOpen(false);
            setIsChangingPassword(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end md:items-center z-[70] p-0 md:p-4 font-khmer select-none"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md md:max-w-lg rounded-t-[32px] md:rounded-[32px] p-6 pb-6 shadow-2xl h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col relative animate-slideUp border-t border-slate-100"
          >
            {/* Top Indicator for Mobile Drag feeling */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 shrink-0 md:hidden"></div>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div>
                <h3 className="text-lg md:text-xl font-black text-slate-800">គ្រប់គ្រងគណនី</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="p-2 hover:bg-slate-100 active:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 active:scale-95 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segment Controls (Mobile-first Navigation Tabs) */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0 gap-1 my-4">
              <button
                type="button"
                onClick={() => setProfileActiveTab('profile')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
                  profileActiveTab === 'profile'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 active:bg-white/40'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>គណនី</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileActiveTab('shop')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
                  profileActiveTab === 'shop'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 active:bg-white/40'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>ព័ត៌មានហាង</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileActiveTab('sync')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
                  profileActiveTab === 'sync'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 active:bg-white/40'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>ទិន្នន័យ & Sync</span>
              </button>
            </div>

            {/* Tabbed Contents Container */}
            <div className="overflow-y-auto custom-scroll flex-1 pr-1 pb-4 space-y-4">
              
              {/* TAB 1: PROFILE & ACCOUNT */}
              {profileActiveTab === 'profile' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Avatar Profile Card */}
                  <div className="bg-gradient-to-b from-slate-50 to-white p-5 rounded-[24px] flex flex-col items-center text-center border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-40"></div>
                    
                    <div className="relative mb-3">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md overflow-hidden flex items-center justify-center bg-gradient-to-tr from-blue-500 to-indigo-600">
                        {user && user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || 'photo'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-3xl font-black">
                            {(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>

                    <h4 className="text-base md:text-lg font-black text-slate-800">{user?.displayName || user?.username || 'ម្ចាស់ហាង'}</h4>
                    {user?.email && (
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        📬 {user.email}
                      </p>
                    )}
                    
                    <div className="mt-2.5 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-[10px] md:text-xs font-bold text-emerald-600 px-3 py-1 rounded-full">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>ទិន្នន័យត្រូវបានរក្សាទុកលើ Cloud (Secure)</span>
                    </div>
                  </div>

                  {/* VIP Subscription Details */}
                  {userRole !== 'admin' && (
                    <div className="bg-slate-900 text-white rounded-[24px] p-5 text-left shadow-lg flex flex-col gap-3 relative overflow-hidden border border-slate-800">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-sans">ស្ថានភាពគណនី</div>
                            <div className="text-sm font-black text-white">{user?.subscriptionPlan || 'ឥតគិតថ្លៃ'}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          សកម្ម
                        </span>
                      </div>
                      <div className="h-[1px] bg-slate-800 my-1"></div>
                      <div className="flex justify-between items-center text-xs text-slate-300 font-bold">
                        <span>ថ្ងៃផុតកំណត់៖</span>
                        <span className="text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 font-sans">
                          {user?.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' }) : 'គ្មានដែនកំណត់'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Change Password Panel */}
                  <div className="space-y-3">
                    {isChangingPassword ? (
                      <form onSubmit={handleUpdatePassword} className="bg-slate-50 border border-slate-200 rounded-[24px] p-5 text-left space-y-3 shadow-inner my-1">
                        <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                          <Key className="w-4 h-4 text-indigo-500" />
                          <h5 className="text-sm font-black text-slate-800">ប្ដូរលេខសម្ងាត់ថ្មី</h5>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] md:text-xs font-bold text-slate-500">លេខសម្ងាត់បច្ចុប្បន្ន <span className="text-rose-500">*</span></label>
                          <input
                            type="password"
                            required
                            placeholder="បញ្ចូលលេខសម្ងាត់បច្ចុប្បន្ន"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-800 transition shadow-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] md:text-xs font-bold text-slate-500">លេខសម្ងាត់ថ្មី <span className="text-rose-500">*</span></label>
                          <input
                            type="password"
                            required
                            placeholder="បញ្ចូលលេខសម្ងាត់ថ្មី (យ៉ាងហោច ៤ ខ្ទង់)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-800 transition shadow-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] md:text-xs font-bold text-slate-500">បញ្ជាក់លេខសម្ងាត់ថ្មី <span className="text-rose-500">*</span></label>
                          <input
                            type="password"
                            required
                            placeholder="បញ្ចូលបញ្ជាក់លេខសម្ងាត់ថ្មី"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-800 transition shadow-sm"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black py-2.5 px-4 rounded-xl text-xs md:text-sm active:scale-95 transition flex-1 shadow-md"
                          >
                            {isUpdatingPassword ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setCurrentPassword('');
                              setNewPassword('');
                              setConfirmPassword('');
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm transition active:scale-95"
                          >
                            បោះបង់
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 px-5 rounded-[20px] text-xs md:text-sm active:scale-95 transition shadow-sm w-full flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span>ផ្លាស់ប្ដូរលេខសម្ងាត់</span>
                        </div>
                        <Key className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </div>

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-bold py-3.5 px-6 rounded-[20px] text-xs md:text-sm active:scale-95 transition shadow-sm w-full flex items-center justify-center gap-2 mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ចាកចេញពីគណនី</span>
                  </button>
                </div>
              )}

              {/* TAB 2: SHOP SETTINGS & PRESENTATION */}
              {profileActiveTab === 'shop' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Shop Front Visual Card */}
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-5 rounded-[24px] relative overflow-hidden shadow-md flex flex-col justify-between min-h-[140px]">
                    <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full"></div>
                    <div className="absolute right-4 top-4">
                      <Store className="w-12 h-12 text-white/20" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">ម្ចាស់ហាងលក់រាយ</span>
                      <h4 className="text-lg md:text-xl font-black mt-1">{shopSettings.name || 'ហាងរបស់ខ្ញុំ'}</h4>
                    </div>
                    <div className="mt-4 text-xs text-white/80 font-bold flex flex-col gap-1">
                      <div>📞 {shopSettings.phone || '-'}</div>
                      <div className="truncate max-w-[280px]">📍 {shopSettings.address || '-'}</div>
                    </div>
                  </div>

                  {/* Detailed Information Grid */}
                  <div className="border border-slate-150 rounded-[24px] p-5 bg-white shadow-sm flex flex-col gap-3">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                      ព័ត៌មានលម្អិតពីហាង
                    </h5>
                    
                    <div className="space-y-3.5 text-xs md:text-sm">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-slate-500 font-bold shrink-0">ឈ្មោះហាង៖</span>
                        <span className="font-black text-slate-800 text-right">{shopSettings.name || 'មិនទាន់កំណត់'}</span>
                      </div>
                      <div className="h-[1px] bg-slate-100"></div>
                      
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-slate-500 font-bold shrink-0">លេខទូរស័ព្ទ៖</span>
                        <span className="font-bold text-slate-800 text-right">{shopSettings.phone || 'មិនទាន់កំណត់'}</span>
                      </div>
                      <div className="h-[1px] bg-slate-100"></div>

                      <div className="flex justify-between items-start gap-4">
                        <span className="text-slate-500 font-bold shrink-0">អាសយដ្ឋាន៖</span>
                        <span className="font-bold text-slate-800 text-right leading-relaxed max-w-[200px] break-words">{shopSettings.address || 'មិនទាន់កំណត់'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action to Edit Shop Config */}
                  {userRole !== 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsShopSettingsOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-6 rounded-[20px] text-xs md:text-sm active:scale-95 transition shadow-md w-full flex items-center justify-center gap-2 mt-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>កែសម្រួលព័ត៌មានហាង</span>
                    </button>
                  )}
                </div>
              )}

              {/* TAB 3: DATA EXPORT & SYNC */}
              {profileActiveTab === 'sync' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Action Panel for Direct Sales Export */}
                  <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <h5 className="text-sm font-black text-slate-800">ទាញយកប្រវត្តិលក់</h5>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ទាញយកទិន្នន័យប្រវត្តិនៃការលក់ និងប្រតិបត្តិការទាំងអស់ជាទម្រង់ Microsoft Excel សម្រាប់ធ្វើការវិភាគ ឬរក្សាទុក។
                    </p>
                    <button
                      type="button"
                      onClick={handleExportSalesHistory}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-xl text-xs md:text-sm active:scale-95 transition shadow-md w-full flex items-center justify-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      ទាញយក Excel (Sales History)
                    </button>
                  </div>

                  {/* GSheets Setup integration */}
                  <GoogleSheetsSetup
                    sheetsWebhookUrl={sheetsWebhookUrl}
                    isAutoSyncEnabled={isAutoSyncEnabled}
                    onToggleAutoSync={handleToggleAutoSync}
                    onSaveSheetsUrl={async (url) => {
                      setSheetsWebhookUrl(url);
                      await saveWebappUrlToFirestore(url, isAutoSyncEnabled);
                      showToast('បានរក្សាទុក URL ជោគជ័យ!', 'success');
                    }}
                    onTestSheetsUrl={handleTestSheetsConnection}
                    onManualSync={handleManualSyncAll}
                    onExportStockLogs={handleExportStockLogs}
                    onExportCurrentStock={handleExportCurrentStock}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          CONFIRMATION ALERTS
      ---------------------------------------------------- */}

      {/* 1. Delete catalog product confirmation alert */}
      <ConfirmationModal
        isOpen={isDeleteProductOpen}
        title="លុបទំនិញក្នុងស្តុក?"
        message={`តើអ្នកពិតជាចង់លុបទំនិញ "${productToDelete?.name}" ចេញពីបញ្ជីទំនិញក្នុងស្តុកមែនទេ?`}
        onConfirm={() => {
          if (!productToDelete) return;
          const updated = products.filter((p) => p.id !== productToDelete.id);
          setProducts(updated);
          setCart((prev) => prev.filter((i) => i.product.id !== productToDelete.id));

          // Log item deletion
          const l: StockLog = {
            id: 'LOG-DEL-' + Date.now(),
            timestamp: new Date().toISOString(),
            sku: productToDelete.sku,
            productName: productToDelete.name,
            type: 'OUT',
            qty: productToDelete.stock,
            prevStock: productToDelete.stock,
            newStock: 0,
            note: 'លុបទំនិញចេញពីបញ្ជីក្នុងស្តុកយ៉ាងពេញលេញ'
          };
          setStockLogs([l, ...stockLogs]);
          triggerGoogleSheetsLog(l);
          if (user) {
            deleteProductFromFirestore(productToDelete.id);
            saveLogToFirestore(l);
          }

          setIsDeleteProductOpen(false);
          setProductToDelete(null);
          showToast('បានលុបទំនិញរួចរាល់ម៉ឺងម៉ាត់!', 'info');
        }}
        onClose={() => {
          setIsDeleteProductOpen(false);
          setProductToDelete(null);
        }}
      />

      {/* 2. Delete single ledger stocklog confirmation alert */}
      <ConfirmationModal
        isOpen={isDeleteLogOpen}
        title="លុបកំណត់ត្រាស្តុក?"
        message="តើអ្នកពិតជាចង់លុបបំបាត់កំណត់ត្រាចេញចូលស្តុកមួយនេះមែនទេ? ទិន្នន័យនេះមិនអាចទាញមកវិញបានឡើយ។"
        onConfirm={() => {
          if (!logToDelete) return;
          const updated = stockLogs.filter((log) => log.id !== logToDelete.id);
          setStockLogs(updated);
          if (user) {
            deleteLogFromFirestore(logToDelete.id);
          } else {
             showToast('អ្នកមិនទាន់បានចូលប្រើប្រាស់!', 'error');
          }
          setIsDeleteLogOpen(false);
          setLogToDelete(null);
          showToast('លុបកំណត់ត្រាស្តុកទទួលបានជោគជ័យ!', 'success');
        }}
        onClose={() => {
          setIsDeleteLogOpen(false);
          setLogToDelete(null);
        }}
      />

      {/* 3. Delete single invoice transaction confirmation alert */}
      <ConfirmationModal
        isOpen={isDeleteInvoiceOpen}
        title="លុបវិក្កយបត្រលក់?"
        message={`តើអ្នកពិតជាចង់លុបវិក្កយបត្រ "${invoiceToDelete?.id}" នេះមែនទេ? ទិន្នន័យចំណូល និងស្ថិតិនឹងត្រូវកាត់បន្ថយ។`}
        onConfirm={() => {
          if (!invoiceToDelete) return;
          const updated = salesHistory.filter((t) => t.id !== invoiceToDelete.id);
          setSalesHistory(updated);
          if (user) {
            deleteSaleFromFirestore(invoiceToDelete.id);
          } else {
             showToast('អ្នកមិនទាន់បានចូលប្រើប្រាស់!', 'error');
          }
          setIsDeleteInvoiceOpen(false);
          setInvoiceToDelete(null);
          showToast('បានលុបវិក្កយបត្ររួចរាល់!', 'info');
        }}
        onClose={() => {
          setIsDeleteInvoiceOpen(false);
          setInvoiceToDelete(null);
        }}
      />

      {/* 4. Clear all ledger log entries confirmation alert */}
      <ConfirmationModal
        isOpen={isClearLogsOpen}
        title="លុបកំណត់ត្រាទាំងអស់?"
        message="តើអ្នកពិតជាចង់លុបកំណត់ត្រាចេញចូលស្តុកទាំងអស់ចេញពី កំណត់ត្រា មែនទេ? សកម្មភាពនេះនឹងលុបរាល់ប្រវត្តិស្តុកតាំងពីដើមមក។"
        onConfirm={() => {
          setStockLogs([]);
          if (user) {
            for (const log of stockLogs) {
              deleteLogFromFirestore(log.id);
            }
          } else {
             showToast('អ្នកមិនទាន់បានចូលប្រើប្រាស់!', 'error');
          }
          setIsClearAllLogsOpen(false);
          showToast('បានសម្អាតរាល់កំណត់ត្រាស្តុកទាំងអស់!', 'success');
        }}
        onClose={() => {
          setIsClearAllLogsOpen(false);
        }}
      />
    </div>
  );
}
