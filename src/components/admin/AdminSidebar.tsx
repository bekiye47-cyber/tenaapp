import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  Flame,
  Youtube,
  Crown,
  Settings,
  FileText,
  LogOut,
  Database,
  ExternalLink
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  pendingDepositsCount: number;
  adminEmail: string;
  onLogout: () => void;
  onOpenSupabaseModal: () => void;
  onSwitchToUserApp: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onChangeTab,
  pendingDepositsCount,
  adminEmail,
  onLogout,
  onOpenSupabaseModal,
  onSwitchToUserApp
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deposits', label: 'Deposits', icon: CreditCard, badge: pendingDepositsCount },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'books', label: 'Books & Guides', icon: BookOpen },
    { id: 'challenges', label: 'Challenges', icon: Flame },
    { id: 'youtube', label: 'YouTube Videos', icon: Youtube },
    { id: 'vip', label: 'VIP Club & Content', icon: Crown },
    { id: 'payments', label: 'Payment Settings', icon: Settings },
    { id: 'logs', label: 'Activity Logs', icon: FileText },
  ];

  return (
    <aside id="admin-sidebar" className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base font-black tracking-wide text-white">TENA HOLISTIC</h1>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mt-0.5">
            Admin Console (PC)
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-bounce">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Launch and Supabase Actions */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <button
          onClick={onOpenSupabaseModal}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Supabase Setup</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono">SQL</span>
        </button>

        <button
          onClick={onSwitchToUserApp}
          className="w-full flex items-center justify-between px-3 py-2 bg-emerald-950/50 hover:bg-emerald-950 text-emerald-300 rounded-xl text-xs font-semibold transition-colors border border-emerald-900/60"
        >
          <span>Open Telegram Mini App</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* User identity & Logout */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
          <div className="truncate mr-2">
            <span className="block text-[10px] text-slate-500">Signed in as:</span>
            <span className="font-mono text-slate-300 truncate text-[11px] block">{adminEmail}</span>
          </div>
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
