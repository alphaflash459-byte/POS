/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Store, User, Settings, Coffee, Cloud, AlertCircle } from 'lucide-react';
import { ShopSettings } from '../types.ts';

interface HeaderProps {
  shopSettings: ShopSettings;
  sheetsWebhookUrl: string;
  onOpenShopSettings: () => void;
  onOpenDonate: () => void;
  onOpenProfile: () => void;
  user: any | null;
  userRole?: 'admin' | 'user' | null;
  isAutoSyncEnabled?: boolean;
}

export default function Header({
  shopSettings,
  sheetsWebhookUrl,
  onOpenShopSettings,
  onOpenDonate,
  onOpenProfile,
  user,
  userRole,
  isAutoSyncEnabled = true,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 px-2 md:px-4 py-2.5 h-[65px] flex items-center shrink-0 relative z-0">
      <div className="flex justify-between items-center w-full">
        {/* Left: App Identity */}
        <div
          onClick={onOpenProfile}
          className="flex items-center space-x-2.5 md:space-x-3 cursor-pointer group"
          id="header-profile-trigger"
        >
          <div className="relative transition duration-200 group-hover:ring-4 group-hover:ring-slate-100 rounded-full active:scale-95">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-xl font-bold overflow-hidden">
              {user && user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <span
              id="header-online-status"
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                user ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
          </div>
          <div>
            <h4 className="text-[10px] md:text-xs text-slate-500 font-medium leading-tight">
              {user ? `សួស្តី, ${user.displayName || 'ម្ចាស់ហាង'}` : 'សួស្តី, ភ្ញៀវ!'}
            </h4>
            <h1 className="text-sm md:text-base font-bold tracking-wide line-clamp-1 leading-tight">
              {userRole === 'admin' ? 'អ្នកគ្រប់គ្រងប្រព័ន្ធ' : (shopSettings.name || 'ហាងទំនិញ')}
            </h1>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {userRole !== 'admin' && (
            sheetsWebhookUrl ? (
              <div 
                onClick={onOpenProfile}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] md:text-xs font-black border transition-all cursor-pointer active:scale-95 ${
                  isAutoSyncEnabled 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-sm' 
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-sm'
                }`}
              >
                <Cloud className={`w-3.5 h-3.5 ${isAutoSyncEnabled ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className="hidden sm:inline">Sheets Sync:</span>
                <span>{isAutoSyncEnabled ? 'បើកស្វ័យប្រវត្តិ' : 'បានផ្អាក'}</span>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isAutoSyncEnabled ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoSyncEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
              </div>
            ) : (
              <div 
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] md:text-xs font-black bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
              >
                <Cloud className="w-3.5 h-3.5 text-slate-400" />
                <span>មិនទាន់ភ្ជាប់ Google Sheets</span>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
