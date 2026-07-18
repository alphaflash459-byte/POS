const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const interfaceReplacement = `interface AdminPanelProps {
  activeTab: string;
  onSetActiveUser: (userId: string) => void;
  activeUserId: string | null;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminPanel({ activeTab, onSetActiveUser, activeUserId, onToast }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
`;

code = code.replace(/interface AdminPanelProps \{[\s\S]*?const \[isLoading, setIsLoading\] = useState\(true\);\n  const \[activeTab, setActiveTab\] = useState<'dashboard' \| 'users' \| 'history' \| 'report'>\('dashboard'\);/, interfaceReplacement);

const returnReplacement = `  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 font-khmer min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-black text-slate-800">ផ្ទាំងគ្រប់គ្រង (Admin)</h2>
          <p className="text-sm text-slate-500 mt-1">គ្រប់គ្រងទិន្នន័យ និងសកម្មភាពហាង</p>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
`;
code = code.replace(/  return \(\s*<div className="bg-slate-50 rounded-3xl p-6 md:p-8 font-khmer min-h-screen">[\s\S]*?\{activeTab === 'dashboard' && \(\s*<>/, returnReplacement);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
