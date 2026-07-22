import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, getDocs, collectionGroup, query, orderBy, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.ts';
import { ShieldAlert, Users, ShoppingCart, Boxes, DollarSign, Activity, LayoutDashboard, History, FileBarChart, Receipt, Check, X } from 'lucide-react';
import { APP_ID } from '../App.tsx';
import { User, Transaction, Product, StockLog, SubscriptionRequest } from '../types.ts';

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
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);

  // Create User State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditUserMode, setIsEditUserMode] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('user');
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Detailed Report Modal State
  const [isDetailReportOpen, setIsDetailReportOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [detailSales, setDetailSales] = useState<Transaction[]>([]);
  const [detailProducts, setDetailProducts] = useState<Product[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [activeDetailSubTab, setActiveDetailSubTab] = useState<'sales' | 'products'>('sales');
  const [selectedDetailTxn, setSelectedDetailTxn] = useState<Transaction | null>(null);

  const handleOpenDetailReport = async (u: User) => {
    setDetailUser(u);
    setIsDetailReportOpen(true);
    setIsLoadingDetail(true);
    setActiveDetailSubTab('sales');
    setSelectedDetailTxn(null);
    try {
      // Load sales
      const salesRef = collection(db, 'artifacts', APP_ID, 'users', u.id, 'sales');
      const salesSnap = await getDocs(salesRef);
      const listSales: Transaction[] = [];
      salesSnap.forEach(d => {
        listSales.push({ id: d.id, ...d.data() } as Transaction);
      });
      // Sort sales by timestamp descending
      listSales.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setDetailSales(listSales);

      // Load products
      const productsRef = collection(db, 'artifacts', APP_ID, 'users', u.id, 'products');
      const productsSnap = await getDocs(productsRef);
      const listProducts: Product[] = [];
      productsSnap.forEach(d => {
        listProducts.push({ id: Number(d.id), ...d.data() } as Product);
      });
      setDetailProducts(listProducts);
    } catch (err) {
      console.error("Error loading detail report:", err);
      onToast('មានបញ្ហាក្នុងការទាញយករបាយការណ៍លម្អិត!', 'error');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionRequest | null>(null);

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
      setIsCreateUserModalOpen(false);
    } catch (err) {
      console.error(err);
      onToast('បរាជ័យក្នុងការបង្កើតគណនី!', 'error');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!editUsername) {
      onToast('សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់!', 'error');
      return;
    }
    
    setIsSavingUser(true);
    try {
      await setDoc(doc(db, 'artifacts', APP_ID, 'app_users', selectedUser.id), {
        ...selectedUser,
        username: editUsername,
        password: editPassword,
        role: editRole,
      }, { merge: true });
      onToast('គណនីត្រូវបានកែប្រែដោយជោគជ័យ!', 'success');
      setIsEditUserMode(false);
      setSelectedUser({ ...selectedUser, username: editUsername, password: editPassword, role: editRole });
    } catch (err) {
      console.error(err);
      onToast('មានបញ្ហាក្នុងការកែប្រែគណនី!', 'error');
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (selectedUser.role === 'admin') {
      onToast('មិនអាចលុបគណនីអ្នកគ្រប់គ្រងបានទេ!', 'error');
      return;
    }
    if (!window.confirm('តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ? ទិន្នន័យទាំងអស់របស់គាត់នឹងត្រូវបាត់បង់។')) return;

    setIsDeletingUser(true);
    try {
      await deleteDoc(doc(db, 'artifacts', APP_ID, 'app_users', selectedUser.id));
      onToast('គណនីត្រូវបានលុបដោយជោគជ័យ!', 'success');
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      onToast('មានបញ្ហាក្នុងការលុបគណនី!', 'error');
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleApproveSubscription = async (req: SubscriptionRequest) => {
    try {
      const userRef = doc(db, 'artifacts', APP_ID, 'app_users', req.userId);
      const appRef = doc(db, 'artifacts', APP_ID);
      
      const userSnap = await getDoc(userRef);
      let currentEnd = new Date();
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.subscriptionEnd) {
          const userEnd = new Date(userData.subscriptionEnd);
          if (userEnd > currentEnd) {
            currentEnd = userEnd;
          }
        }
      }

      if (req.planId === 'daily') {
        currentEnd.setHours(currentEnd.getHours() + 24);
      } else if (req.planId === 'monthly') {
        currentEnd.setMonth(currentEnd.getMonth() + 1);
      } else if (req.planId === 'yearly') {
        currentEnd.setFullYear(currentEnd.getFullYear() + 1);
      } else {
        currentEnd.setDate(currentEnd.getDate() + (req.days || 0));
      }
      
      // Update user
      await setDoc(userRef, {
        subscriptionPlan: req.planId,
        subscriptionEnd: currentEnd.toISOString()
      }, { merge: true });

      // Update request status
      await setDoc(appRef, {
        subscription_requests: {
          [req.id]: { status: 'approved' }
        }
      }, { merge: true });

      onToast('ការជាវត្រូវបានអនុម័តជោគជ័យ!', 'success');
    } catch (e) {
      console.error(e);
      onToast('មានបញ្ហាក្នុងការអនុម័ត!', 'error');
    }
  };

  const handleRejectSubscription = async (req: SubscriptionRequest) => {
    try {
      const appRef = doc(db, 'artifacts', APP_ID);
      
      // Update request status
      await setDoc(appRef, {
        subscription_requests: {
          [req.id]: { status: 'rejected' }
        }
      }, { merge: true });

      onToast('ការជាវត្រូវបានបដិសេធជោគជ័យ!', 'success');
    } catch (e) {
      console.error(e);
      onToast('មានបញ្ហាក្នុងការបដិសេធ!', 'error');
    }
  };

  useEffect(() => {
    // Fetch users and subscription requests
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

    const docRef = doc(db, 'artifacts', APP_ID);
    const unsubReqs = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const reqsObj: Record<string, SubscriptionRequest> = data.subscription_requests || {};
        const reqsArray = Object.values(reqsObj).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSubscriptionRequests(reqsArray);
      }
    });

    return () => {
      unsubUsers();
      unsubReqs();
    };
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
    <div className="bg-slate-50 md:p-6 font-khmer min-h-screen">
      {activeTab === 'dashboard' && (
        <>

{/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 px-4 md:px-0">
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

        {/* Users List */}
        <div className="bg-white md:rounded-2xl shadow-sm border-y md:border-x border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> គណនីហាងទាំងអស់
            </h3>
            <button
              onClick={() => setIsCreateUserModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> បង្កើតគណនីថ្មី
            </button>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-white text-slate-400 font-bold border-b border-slate-100 text-xs">
                <tr>
                  <th className="py-3 px-1 sm:px-2 md:px-4">ឈ្មោះ</th>
                  <th className="py-3 px-1 sm:px-2 md:px-4">កូដសម្ងាត់</th>
                  <th className="py-3 px-1 sm:px-2 md:px-4 text-right">សេវាកម្ម</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr 
                    key={u.id} 
                    className="hover:bg-indigo-50 transition-colors cursor-pointer group"
                    onClick={() => {
                      setSelectedUser(u);
                      setIsEditUserMode(false);
                      setEditUsername(u.username);
                      setEditPassword(u.password || '');
                      setEditRole(u.role);
                    }}
                  >
                    <td className="py-3 px-1 sm:px-2 md:px-4 font-bold text-slate-800">
                      {u.username || 'គ្មានឈ្មោះ'}
                    </td>
                    <td className="py-3 px-1 sm:px-2 md:px-4 font-mono text-xs text-slate-500">
                      {u.password ? '••••••' : '-'}
                    </td>
                    <td className="py-3 px-1 sm:px-2 md:px-4 text-right">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        u.subscriptionPlan === 'yearly' ? 'bg-purple-100 text-purple-700' :
                        u.subscriptionPlan === 'monthly' ? 'bg-blue-100 text-blue-700' :
                        u.subscriptionPlan === 'daily' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {u.subscriptionPlan === 'yearly' ? 'ប្រចាំឆ្នាំ' :
                         u.subscriptionPlan === 'monthly' ? 'ប្រចាំខែ' :
                         u.subscriptionPlan === 'daily' ? 'ប្រចាំថ្ងៃ' :
                         'ឥតគិតថ្លៃ'}
                      </span>
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
        <div className="bg-white md:rounded-2xl shadow-sm border-y md:border-x border-slate-100 overflow-hidden">
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

      {activeTab === 'subscriptions' && (
        <div className="bg-white md:rounded-2xl shadow-sm border-y md:border-x border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-500" /> សំណើជាវសេវាកម្ម
            </h3>
          </div>
          <div className="overflow-hidden">
            {subscriptionRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">មិនទាន់មានសំណើការជាវសេវាកម្មទេ</div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-white text-slate-400 font-bold border-b border-slate-100 text-xs">
                  <tr>
                    <th className="py-2 px-1 sm:px-2 md:px-4">ឈ្មោះ</th>
                    <th className="py-2 px-1 sm:px-2 md:px-4">កាលបរិច្ឆេទ</th>
                    <th className="py-2 px-1 sm:px-2 md:px-4">កញ្ចប់</th>
                    <th className="py-2 px-1 sm:px-2 md:px-4 text-right">ស្ថានភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {subscriptionRequests.map((req) => (
                    <tr 
                      key={req.id} 
                      className="hover:bg-indigo-50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedSubscription(req)}
                    >
                      <td className="py-2 px-1 sm:px-2 md:px-4 font-bold text-slate-800 text-xs">
                        {req.username}
                      </td>
                      <td className="py-2 px-1 sm:px-2 md:px-4 text-[10px] text-slate-500 whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-2 px-1 sm:px-2 md:px-4 text-xs">
                        <span className="font-bold text-blue-600">{req.planName}</span>
                      </td>
                      <td className="py-2 px-1 sm:px-2 md:px-4 text-right">
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                          req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {req.status === 'pending' ? 'រង់ចាំ' : req.status === 'approved' ? 'អនុម័ត' : 'បដិសេធ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsCreateUserModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-indigo-500" /> បង្កើតគណនីថ្មី
              </h3>
              <button 
                onClick={() => setIsCreateUserModalOpen(false)}
                className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">ឈ្មោះអ្នកប្រើប្រាស់</label>
                  <input 
                    type="text" 
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                    placeholder="ឈ្មោះគណនីថ្មី"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">លេខសម្ងាត់</label>
                  <input 
                    type="text" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                    placeholder="លេខសម្ងាត់គណនី"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 mt-2 rounded-xl shadow-md transition disabled:opacity-50 text-base"
                >
                  {isCreatingUser ? 'កំពុងបង្កើត...' : 'បង្កើតគណនី'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Details & Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedUser(null)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-indigo-500" /> ព័ត៌មានគណនី
              </h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {isEditUserMode ? (
                <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">ឈ្មោះអ្នកប្រើប្រាស់</label>
                    <input 
                      type="text" 
                      value={editUsername}
                      onChange={e => setEditUsername(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                      placeholder="ឈ្មោះគណនី"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">លេខសម្ងាត់</label>
                    <input 
                      type="text" 
                      value={editPassword}
                      onChange={e => setEditPassword(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                      placeholder="លេខសម្ងាត់គណនី"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditUserMode(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-sm"
                    >
                      បោះបង់
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingUser}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition disabled:opacity-50 text-sm"
                    >
                      {isSavingUser ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-2xl">
                      {selectedUser.username ? selectedUser.username[0].toUpperCase() : 'អ'}
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-slate-800">{selectedUser.username}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          selectedUser.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {selectedUser.role === 'admin' ? 'អ្នកគ្រប់គ្រង' : 'អ្នកប្រើប្រាស់'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          selectedUser.subscriptionPlan === 'yearly' ? 'bg-purple-100 text-purple-700' :
                          selectedUser.subscriptionPlan === 'monthly' ? 'bg-blue-100 text-blue-700' :
                          selectedUser.subscriptionPlan === 'daily' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {selectedUser.subscriptionPlan === 'yearly' ? 'ប្រចាំឆ្នាំ' :
                           selectedUser.subscriptionPlan === 'monthly' ? 'ប្រចាំខែ' :
                           selectedUser.subscriptionPlan === 'daily' ? 'ប្រចាំថ្ងៃ' :
                           'ឥតគិតថ្លៃ'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-sm font-bold text-slate-500">លេខសម្ងាត់</span>
                      <span className="text-sm font-mono text-slate-800">{selectedUser.password || 'មិនមាន'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-sm font-bold text-slate-500">ថ្ងៃផុតកំណត់សេវាកម្ម</span>
                      <span className="text-sm font-bold text-rose-600">
                        {selectedUser.subscriptionEnd ? new Date(selectedUser.subscriptionEnd).toLocaleDateString('km-KH') : 'មិនមាន'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-500">បង្កើតគណនីនៅ</span>
                      <span className="text-sm font-bold text-slate-800">
                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('km-KH') : 'មិនមាន'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setIsEditUserMode(true)}
                      className="flex-1 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-sm transition"
                    >
                      កែប្រែ
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      disabled={isDeletingUser}
                      className="flex-1 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-sm transition disabled:opacity-50"
                    >
                      {isDeletingUser ? 'កំពុងលុប...' : 'លុបគណនី'}
                    </button>
                  </div>
                  
                  {selectedUser.role !== 'admin' && (
                    <button
                      onClick={() => handleOpenDetailReport(selectedUser)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold text-sm transition mt-1"
                    >
                      <Activity className="w-4 h-4" />
                      មើលរបាយការណ៍លម្អិត
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Subscription Request Details Modal */}
      {/* User Detailed Report Modal */}
      {isDetailReportOpen && detailUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsDetailReportOpen(false)}>
          <div className="bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 flex items-center gap-2 text-xl">
                  <Activity className="w-6 h-6 text-indigo-500" /> របាយការណ៍លម្អិតរបស់៖ {detailUser.username}
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-1">បង្កើតឡើងនៅ៖ {detailUser.createdAt ? new Date(detailUser.createdAt).toLocaleDateString('km-KH') : 'មិនមាន'}</p>
              </div>
              <button 
                onClick={() => setIsDetailReportOpen(false)}
                className="p-2.5 hover:bg-slate-100 bg-slate-50 rounded-full text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingDetail ? (
              <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold text-sm">កំពុងទាញយកទិន្នន័យ...</span>
              </div>
            ) : (
              <div className="p-6 overflow-y-auto custom-scroll flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">ចំណូលសរុប</p>
                      <h4 className="text-lg font-black text-slate-800">
                        ${detailSales.reduce((acc, curr) => acc + (curr.netTotal || 0), 0).toFixed(2)}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">ចំនួនលក់សរុប</p>
                      <h4 className="text-lg font-black text-slate-800">{detailSales.length} ដង</h4>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <Boxes className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">ទំនិញក្នុងស្តុក</p>
                      <h4 className="text-lg font-black text-slate-800">{detailProducts.length} មុខ</h4>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">មធ្យមភាគវិក្កយបត្រ</p>
                      <h4 className="text-lg font-black text-slate-800">
                        ${(detailSales.length > 0 
                          ? detailSales.reduce((acc, curr) => acc + (curr.netTotal || 0), 0) / detailSales.length 
                          : 0).toFixed(2)}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Sub Tab Navigation */}
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setActiveDetailSubTab('sales')}
                    className={`px-5 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                      activeDetailSubTab === 'sales'
                        ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-xl'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <History className="w-4 h-4" /> ប្រវត្តិលក់ ({detailSales.length})
                  </button>
                  <button
                    onClick={() => setActiveDetailSubTab('products')}
                    className={`px-5 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                      activeDetailSubTab === 'products'
                        ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-xl'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Boxes className="w-4 h-4" /> បញ្ជីទំនិញ ({detailProducts.length})
                  </button>
                </div>

                {/* Tab Contents */}
                {activeDetailSubTab === 'sales' ? (
                  detailSales.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-100 text-sm font-bold">
                      មិនទាន់មានការលក់នៅឡើយទេ
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[350px]">
                      {/* Left: Sales list */}
                      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col h-[400px]">
                        <div className="p-3 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          វិក្កយបត្រលក់
                        </div>
                        <div className="overflow-y-auto custom-scroll flex-1 divide-y divide-slate-100">
                          {detailSales.map((txn) => (
                            <div
                              key={txn.id}
                              onClick={() => setSelectedDetailTxn(txn)}
                              className={`p-4 transition cursor-pointer flex justify-between items-center ${
                                selectedDetailTxn?.id === txn.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <div className="font-bold text-slate-800 text-sm">{txn.customerName || 'អតិថិជនទូទៅ'}</div>
                                <div className="text-[10px] text-slate-400 font-bold mt-0.5">{new Date(txn.timestamp).toLocaleString('km-KH')}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-black text-slate-800 text-sm">${txn.netTotal?.toFixed(2)}</div>
                                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 uppercase">
                                  {txn.paymentMethod}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Thermal Receipt Paper Preview */}
                      <div className="lg:col-span-5 flex flex-col">
                        {selectedDetailTxn ? (
                          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col font-mono text-xs text-slate-800 h-[400px] overflow-y-auto custom-scroll relative">
                            {/* Paper top tooth edge */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-[linear-gradient(45deg,transparent_25%,#f1f5f9_25%,#f1f5f9_75%,transparent_75%),linear-gradient(-45deg,transparent_25%,#f1f5f9_25%,#f1f5f9_75%,transparent_75%)] bg-[size:8px_4px] opacity-40"></div>
                            
                            <div className="text-center font-bold text-sm text-slate-900 border-b border-dashed border-slate-200 pb-3 mb-3">
                              <div>វិក្កយបត្រគំរូ</div>
                              <div className="text-[10px] text-slate-500 font-normal mt-0.5">លេខ៖ {selectedDetailTxn.id}</div>
                            </div>

                            <div className="space-y-1 pb-3 mb-3 border-b border-dashed border-slate-200">
                              <div className="flex justify-between">
                                <span className="text-slate-400">អតិថិជន៖</span>
                                <span className="font-bold">{selectedDetailTxn.customerName || 'អតិថិជនទូទៅ'}</span>
                              </div>
                              {selectedDetailTxn.customerPhone && (
                                <div className="flex justify-between">
                                  <span className="text-slate-400">ទូរស័ព្ទ៖</span>
                                  <span className="font-bold">{selectedDetailTxn.customerPhone}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-slate-400">កាលបរិច្ឆេទ៖</span>
                                <span>{new Date(selectedDetailTxn.timestamp).toLocaleString('km-KH')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">ទូទាត់៖</span>
                                <span className="font-bold">{selectedDetailTxn.paymentMethod}</span>
                              </div>
                            </div>

                            <div className="flex-grow space-y-2 mb-3">
                              <div className="font-bold flex justify-between border-b border-slate-100 pb-1 text-[10px] text-slate-400">
                                <span>ទំនិញ</span>
                                <div className="flex gap-4">
                                  <span>ចំនួន</span>
                                  <span>សរុប</span>
                                </div>
                              </div>
                              {selectedDetailTxn.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span className="truncate max-w-[150px] font-sans text-xs">{item.product.name}</span>
                                  <div className="flex gap-6 font-mono">
                                    <span>x{item.quantity}</span>
                                    <span className="font-bold">${(item.quantity * item.product.price).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5 font-bold">
                              <div className="flex justify-between">
                                <span className="text-slate-400">សរុបរង៖</span>
                                <span>${selectedDetailTxn.subtotal?.toFixed(2)}</span>
                              </div>
                              {selectedDetailTxn.discount > 0 && (
                                <div className="flex justify-between text-rose-600">
                                  <span>បញ្ចុះតម្លៃ៖</span>
                                  <span>-${selectedDetailTxn.discount?.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-slate-900 text-sm border-t border-slate-100 pt-1.5 font-black">
                                <span>សរុប៖</span>
                                <span>${selectedDetailTxn.netTotal?.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-8 text-center text-slate-400 text-xs h-[400px] font-bold">
                            សូមជ្រើសរើសវិក្កយបត្រមួយដើម្បីមើលព័ត៌មានលម្អិត
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  detailProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-100 text-sm font-bold">
                      មិនទាន់មានមុខទំនិញនៅក្នុងស្តុកនៅឡើយទេ
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden max-h-[400px] overflow-y-auto custom-scroll">
                      <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 text-xs sticky top-0 z-10">
                          <tr>
                            <th className="py-3 px-4">SKU / ឈ្មោះទំនិញ</th>
                            <th className="py-3 px-4">ប្រភេទ</th>
                            <th className="py-3 px-4 text-right">តម្លៃដើម</th>
                            <th className="py-3 px-4 text-right">តម្លៃលក់</th>
                            <th className="py-3 px-4 text-center">ចំនួនស្តុក</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-sans">
                          {detailProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3.5 px-4">
                                <div className="font-mono text-[10px] text-slate-400 font-bold">{p.sku || 'N/A'}</div>
                                <div className="font-bold text-slate-800 text-sm mt-0.5">{p.name}</div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                  {p.category || 'ទូទៅ'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-500">${Number(p.cost || 0).toFixed(2)}</td>
                              <td className="py-3.5 px-4 text-right font-mono font-black text-indigo-600">${Number(p.price || 0).toFixed(2)}</td>
                              <td className="py-3.5 px-4 text-center font-mono">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  p.stock <= 5 
                                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                  {p.stock}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            )}
            
            <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button
                onClick={() => setIsDetailReportOpen(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedSubscription(null)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Receipt className="w-5 h-5 text-indigo-500" /> ព័ត៌មានសំណើជាវ
              </h3>
              <button 
                onClick={() => setSelectedSubscription(null)}
                className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800 text-lg">{selectedSubscription.username}</div>
                  <div className="text-sm text-slate-500">{new Date(selectedSubscription.createdAt).toLocaleString('km-KH')}</div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  selectedSubscription.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  selectedSubscription.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {selectedSubscription.status === 'pending' ? 'រង់ចាំ' : selectedSubscription.status === 'approved' ? 'អនុម័តរួច' : 'បដិសេធ'}
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-700">{selectedSubscription.planName}</span>
                <span className="text-xl font-black text-blue-600">${selectedSubscription.price}</span>
              </div>
              
              <div className="bg-slate-100 rounded-2xl overflow-hidden flex-grow flex items-center justify-center p-2 min-h-[300px]">
                <img 
                  src={selectedSubscription.receiptImage} 
                  alt="វិក្កយបត្រ" 
                  className="w-full h-full object-contain max-h-[400px] rounded-xl"
                />
              </div>
              
              {selectedSubscription.status === 'pending' && (
                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={() => {
                      handleRejectSubscription(selectedSubscription);
                      setSelectedSubscription(null);
                    }}
                    className="flex-1 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" /> បដិសេធ
                  </button>
                  <button 
                    onClick={() => {
                      handleApproveSubscription(selectedSubscription);
                      setSelectedSubscription(null);
                    }}
                    className="flex-1 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-sm shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" /> អនុម័ត
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
