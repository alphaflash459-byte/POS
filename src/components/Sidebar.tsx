/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Store,
  ShoppingCart,
  Boxes,
  FileSpreadsheet,
  Receipt,
  Settings,
  Users,
  LayoutDashboard,
  History,
  FileBarChart,
} from "lucide-react";
import { ShopSettings } from "../types.ts";

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: any) => void;
  onOpenShopSettings: () => void;
  onOpenDonate: () => void;
  shopSettings: ShopSettings;
  sheetsWebhookUrl: string;
  userRole?: "admin" | "user" | null;
}

export default function Sidebar({
  currentTab,
  onChangeTab,
  onOpenShopSettings,
  onOpenDonate,
  shopSettings,
  sheetsWebhookUrl,
  userRole,
}: SidebarProps) {
  let navItems: { id: string; label: string; icon: any; hasDot?: boolean }[] =
    [];

  if (userRole === "admin") {
    navItems = [
      { id: "admin_dashboard", label: "ទិដ្ឋភាពរួម", icon: LayoutDashboard },
      { id: "admin_users", label: "គណនី", icon: Users },
      { id: "admin_history", label: "ប្រវត្តិ", icon: History },
      { id: "admin_report", label: "របាយការណ៍", icon: FileBarChart },
    ];
  } else {
    navItems = [
      { id: "pos", label: "លក់ទំនិញ", icon: ShoppingCart },
      { id: "inventory", label: "ស្តុក", icon: Boxes },
      {
        id: "sheets",
        label: "Ledger",
        icon: FileSpreadsheet,
        hasDot: !!sheetsWebhookUrl,
      },
      { id: "history", label: "ប្រវត្តិ", icon: Receipt },
    ];
  }

  return (
    <nav className="absolute md:relative bottom-0 w-full md:w-64 bg-white/95 md:bg-white backdrop-blur-md md:backdrop-blur-none border-t md:border-t-0 md:border-r border-slate-200/50 z-40 shrink-0 md:order-1 transition-all shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] md:shadow-none print-hidden">
      {/* Desktop Brand Header */}
      <div className="hidden md:flex items-center space-x-3 p-6 mb-2 border-b border-slate-50">
        <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h1
            className="text-base font-black text-slate-800 tracking-wide leading-tight line-clamp-1"
            id="sidebar-shop-name"
          >
            {userRole === "admin"
              ? "ប្រព័ន្ធគ្រប់គ្រង (Admin)"
              : shopSettings.name}
          </h1>
          <span
            className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block"
            id="sidebar-shop-subtitle"
          >
            {userRole === "admin"
              ? "Admin Dashboard"
              : shopSettings.subtitle || "POS SYSTEM"}
          </span>
        </div>
      </div>

      {/* Nav Links Container */}
      <div className="flex md:flex-col justify-around md:justify-start w-full h-[65px] md:h-auto pb-2 md:pb-0 pt-2 md:pt-4 px-2 md:px-4 md:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`group flex flex-col md:flex-row items-center justify-center md:justify-start w-16 md:w-full h-full md:h-auto md:p-3 md:rounded-2xl transition-all ${
                isActive
                  ? "text-blue-600 md:bg-blue-50"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              <div
                className={`p-1.5 md:p-2 rounded-2xl relative transition transform ${
                  isActive
                    ? "bg-blue-100 text-blue-700 scale-110 md:scale-100"
                    : "md:group-hover:scale-110"
                } mb-1 md:mb-0 md:mr-4 shrink-0`}
              >
                <Icon className="w-4.5 h-4.5 md:w-5 md:h-5" />
                {item.hasDot && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
                )}
              </div>
              <span className="text-[10px] md:text-sm font-bold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop Footer Sidebar */}
      {userRole !== "admin" && (
        <div className="hidden md:block absolute bottom-0 w-full p-4 border-t border-slate-50 space-y-2">
          <button
            type="button"
            onClick={onOpenShopSettings}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 p-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition active:scale-95 shadow-sm mb-2"
          >
            <Settings className="w-4 h-4" />
            <span>កំណត់ហាង</span>
          </button>
          <button
            type="button"
            onClick={onOpenDonate}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 p-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition active:scale-95 shadow-sm"
          >
            <span className="text-sm">☕️</span>
            <span>ឧបត្ថម្ភការគាំទ្រ</span>
          </button>
        </div>
      )}
    </nav>
  );
}
