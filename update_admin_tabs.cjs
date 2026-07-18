const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// Add the tabs state
code = code.replace(
  /const \[isLoading, setIsLoading\] = useState\(true\);/,
  `const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'history' | 'report'>('dashboard');`
);

// Add the FileBarChart, History icon
code = code.replace(
  /import { ShieldAlert, Users, ShoppingCart, Boxes, DollarSign, Activity } from 'lucide-react';/,
  `import { ShieldAlert, Users, ShoppingCart, Boxes, DollarSign, Activity, LayoutDashboard, History, FileBarChart } from 'lucide-react';`
);

// Replace the return statement content with tabs
const returnStart = `  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 font-khmer min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-black text-slate-800">ផ្ទាំងគ្រប់គ្រង (Admin)</h2>
            <p className="text-sm text-slate-500 mt-1">គ្រប់គ្រងទិន្នន័យ និងសកម្មភាពហាង</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap \${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}\`}
          >
            <LayoutDashboard className="w-4 h-4" /> ទិដ្ឋភាពរួម
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap \${activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}\`}
          >
            <Users className="w-4 h-4" /> គណនី
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap \${activeTab === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}\`}
          >
            <History className="w-4 h-4" /> ប្រវត្តិ
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap \${activeTab === 'report' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}\`}
          >
            <FileBarChart className="w-4 h-4" /> របាយការណ៍
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
`;

const afterTabsRender = `
        </>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
`;

const endOfUsersRender = `
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
                      <span className="font-black text-emerald-600 text-sm">\${txn.netTotal?.toFixed(2)}</span>
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
`;

let newCode = code.split(/return \(\s*<div className="bg-slate-50 rounded-3xl p-6 md:p-8 font-khmer min-h-screen">/)[0];

const dashboardStats = code.match(/\{\/\* Stats Cards \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">/)[0];
// Remove the trailing <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
let dashboardStatsClean = dashboardStats.replace(/<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">$/, '');

const usersList = code.match(/\{\/\* Create User Form \*\/\}[\s\S]*?<\/table>\s*<\/div>\s*<\/div>/)[0];

newCode += returnStart;
newCode += dashboardStatsClean;
newCode += afterTabsRender;
newCode += usersList;
newCode += endOfUsersRender;

fs.writeFileSync('src/components/AdminPanel.tsx', newCode);
