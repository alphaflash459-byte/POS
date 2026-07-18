const fs = require('fs');

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const importReplacement = `import { collection, onSnapshot, getDocs, collectionGroup, query, orderBy, setDoc, doc } from 'firebase/firestore';`;
code = code.replace(/import { collection, onSnapshot, getDocs, collectionGroup, query, orderBy } from 'firebase\/firestore';/, importReplacement);

const newStates = `  const [totalProducts, setTotalProducts] = useState(0);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  // Create User State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
`;
code = code.replace(/  const \[totalProducts, setTotalProducts\] = useState\(0\);\n  const \[allTransactions, setAllTransactions\] = useState<Transaction\[\]>\(\[\]\);/, newStates);

const handleCreateUser = `
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

  useEffect(() => {`;
code = code.replace(/  useEffect\(\(\) => \{/, handleCreateUser);

const userCreationForm = `
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

        {/* Users List */}`;
code = code.replace(/        \{\/\* Users List \*\/\}/, userCreationForm);

fs.writeFileSync('src/components/AdminPanel.tsx', code);

