import React, { useState } from 'react';
import { User } from '../types';
import { Store, ShieldCheck, KeyRound, User as UserIcon } from 'lucide-react';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (username: string, password: string) => void;
}

export default function LoginScreen({ users, onLogin, onRegister }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isRegistering) {
      if (users.find(u => u.username === username)) {
        setError('ឈ្មោះអ្នកប្រើប្រាស់នេះមានរួចហើយ!');
        return;
      }
      onRegister(username, password);
    } else {
      const foundUser = users.find(u => u.username === username && u.password === password);
      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('ឈ្មោះអ្នកប្រើប្រាស់ ឬលេខសម្ងាត់មិនត្រឹមត្រូវទេ!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl shadow-slate-900/5 w-full max-w-md border border-slate-200/50 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-slate-50 rounded-full opacity-60"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-600/20">
              <Store className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-center text-slate-800 mb-1 tracking-wide">
            {isRegistering ? 'ចុះឈ្មោះបង្កើតគណនី' : 'ចូលប្រើប្រាស់ប្រព័ន្ធ'}
          </h2>
          <p className="text-slate-400 text-center mb-8 text-xs font-bold tracking-widest uppercase">
            {isRegistering ? 'REGISTER ACCOUNT' : 'POS & INVENTORY SYSTEM'}
          </p>
          
          {error && (
            <div className="bg-rose-50 text-rose-600 p-3.5 rounded-2xl text-xs mb-5 border border-rose-100 text-center font-bold">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 px-1 uppercase tracking-wider">ឈ្មោះអ្នកប្រើប្រាស់</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none font-bold text-slate-800"
                  placeholder="ឧ. somnang_luy"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 px-1 uppercase tracking-wider">លេខសម្ងាត់</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm md:text-base focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition outline-none font-bold text-slate-800"
                  placeholder="បញ្ចូលលេខសម្ងាត់"
                  required
                />
              </div>
            </div>
            
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="w-full hover:bg-blue-700 bg-blue-600 text-white font-black text-sm py-4 rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all duration-200"
              >
                {isRegistering ? 'ចុះឈ្មោះឥឡូវនេះ' : 'ចូលគណនីរបស់អ្នក'}
              </button>
              <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="w-full hover:bg-slate-100 bg-slate-50 text-slate-600 font-bold text-xs py-3.5 rounded-2xl border border-slate-200 active:scale-95 transition-all duration-200"
              >
                {isRegistering ? 'មានគណនីរួចហើយ? ចូលគណនី' : 'បង្កើតគណនីម្ចាស់ហាងថ្មី'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
