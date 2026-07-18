import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, getDocs, collectionGroup, query, orderBy, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.ts';
import { ShieldAlert, Users, ShoppingCart, Boxes, DollarSign, Activity, LayoutDashboard, History, FileBarChart } from 'lucide-react';
import { APP_ID } from '../App.tsx';
import { User, Transaction, Product, StockLog } from '../types.ts';

interface AdminPanelProps {
  activeTab: string;
  onSetActiveUser: (userId: string) => void;
  activeUserId: string | null;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminPanel({ activeTab, onSetActiveUser, activeUserId, onToast }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  
  // Dashboard Stats
  const [totalSales, setTotalSales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  // Create User State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);



  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      onToast('សូមបញ្ចូលឈ្មោះ និងលេខសម្ងាត់!', 'error');
      return;
    }
    if (users.find(u => u.username === newUsername)) {
      onToast('ឈ្មោះអ្នកប្រើប្រាស់នេះមានរួចហើយ!', 'error');
      return;
    }
    
    setIsCreatingUser(true);
    try {
      const newUserId = 'user_' + Date.now();
      const newUser = {
        username: newUsername,
        password: newPassword,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'artifacts', APP_ID, 'app_users', newUserId), newUser);
      onToast('គណនីថ្មីត្រូវបានបង្កើតដោយជោគជ័យ!', 'success');
      setNewUsername('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      onToast('បរាជ័យក្នុងការបង្កើតគណនី!', 'error');
    } finally {
      setIsCreatingUser(false);
    }
  };

  useEffect(() => {
    // Fetch users
    const usersRef = collection(db, 'artifacts', APP_ID, 'app_users');
    const unsubUsers = onSnapshot(usersRef, (snapshot) => {
      const list: User[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as User);
      });
      setUsers(list);
    }, (error) => {
      console.error("Error fetching users", error);
    });

    return () => unsubUsers();
  }, []);

  useEffect(() => {
    // Fetch all sales across all users
    const fetchStats = async () => {
      try {
        const salesQuery = query(collectionGroup(db, 'sales'), orderBy('timestamp', 'desc'));
        const salesSnapshot = await getDocs(salesQuery);
        
        let sum = 0;
        let count = 0;
        const txns: Transaction[] = [];

        salesSnapshot.forEach(doc => {
          // ensure it belongs to this app by checking the path
          if (doc.ref.path.includes(APP_ID)) {
            const data = doc.data() as Transaction;
            sum += (data.netTotal || 0);
            count++;
            txns.push(data);
          }
        });
        
        setTotalSales(sum);
        setTotalTransactions(count);
        setAllTransactions(txns.slice(0, 10)); // keep recent 10

        const productsQuery = query(collectionGroup(db, 'products'));
        const productsSnapshot = await getDocs(productsQuery);
        let pCount = 0;
        productsSnapshot.forEach(doc => {
          if (doc.ref.path.includes(APP_ID)) pCount++;
        });
        setTotalProducts(pCount);

      } catch (e) {
        console.error("Error fetching admin stats:", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 font-khmer">កំពុងទាញយកទិន្នន័យ...</div>;
  }

    return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 font-khmer min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-black text-slate-800">ផ្ទាំងអ្នកគ្រប់គ្រង</h2>
          <p className="text-sm text-slate-500 mt-1">គ្រប់គ្រងទិន្នន័យ និងសកម្មភាពហាង</p>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>

{/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">ចំណូលសរុបរួម</p>
            <h3 className="text-xl font-black text-slate-800">${totalSales.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">ចំនួនលក់សរុប</p>
            <h3 className="text-xl font-black text-slate-800">{totalTransactions} ដង</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">អ្នកប្រើប្រាស់ (ហាង)</p>
            <h3 className="text-xl font-black text-slate-800">{users.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">ទំនិញសរុប</p>
            <h3 className="text-xl font-black text-slate-800">{totalProducts} មុខ</h3>
          </div>
        </div>
      </div>

      
        </>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
{/* Create User Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> បង្កើតគណនីថ្មី
            </h3>
          </div>
          <div className="p-5">
            <form onSubmit={handleCreateUser} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3">
                <label className="block text-xs font-bold text-slate-500 mb-1">ឈ្មោះអ្នកប្រើប្រាស់</label>
                <input 
                  type="text" 
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
                  placeholder="ឈ្មោះគណនីថ្មី"
                />
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-xs font-bold text-slate-500 mb-1">លេខសម្ងាត់</label>
                <input 
                  type="text" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
                  placeholder="លេខសម្ងាត់គណនី"
                />
              </div>
              <div className="w-full md:w-1/3">
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {isCreatingUser ? 'កំពុងបង្កើត...' : 'បង្កើតគណនី'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> គណនីហាងទាំងអស់
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white text-slate-400 font-bold border-b border-slate-100 text-xs">
                <tr>
                  <th className="py-3 px-5">ឈ្មោះអ្នកប្រើប្រាស់</th>
                  <th className="py-3 px-5">តួនាទី</th>
                  <th className="py-3 px-5 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {u.username ? u.username[0].toUpperCase() : 'U'}
                        </div>
                        {u.username || 'គ្មានឈ្មោះ'}
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => {
                          // The admin wants to look at user data WITHOUT using the POS program
                          // But we still need a way to show detailed user data.
                          // For now, let's keep the active user switch functionality, but
                          // the prompt asked not to use the app like a user. 
                          // The dashboard itself is replacing the POS view for admin.
                          onToast(`មុខងារចូលមើលហាងត្រូវបានបិទសម្រាប់ Dashboard រួម។ ទិន្នន័យ ${u.username} មាននៅក្នុងរបាយការណ៍រួម។`, 'info');
                        }}
                        className="inline-flex items-center gap-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-indigo-100"
                      >
                        <Activity className="w-3 h-3" />
                        មើលរបាយការណ៍
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" /> ប្រវត្តិប្រតិបត្តិការទាំងអស់
            </h3>
          </div>
          <div className="p-0">
            {allTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">មិនទាន់មានប្រតិបត្តិការទេ</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {allTransactions.map(txn => (
                  <li key={txn.id} className="p-4 hover:bg-slate-50 transition">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 text-sm">{txn.customerName || 'អតិថិជនទូទៅ'}</span>
                      <span className="font-black text-emerald-600 text-sm">${txn.netTotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{new Date(txn.timestamp).toLocaleString('km-KH')}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">{txn.paymentMethod}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <FileBarChart className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">របាយការណ៍លម្អិត</h3>
          <p className="text-slate-500 text-sm">មុខងាររបាយការណ៍កំពុងត្រូវបានអភិវឌ្ឍន៍ វានឹងរួចរាល់ក្នុងពេលឆាប់ៗនេះ។</p>
        </div>
      )}
    </div>
  );
}
