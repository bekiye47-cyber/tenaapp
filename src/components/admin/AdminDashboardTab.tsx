import React from 'react';
import {
  Users,
  Crown,
  CreditCard,
  CheckCircle2,
  BookOpen,
  Flame,
  Youtube,
  Sparkles,
  ArrowUpRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { AdminTab } from '../../types';

interface AdminDashboardTabProps {
  onNavigate: (tab: AdminTab) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({ onNavigate }) => {
  const users = dataService.getUsers();
  const deposits = dataService.getDeposits();
  const books = dataService.getBooks();
  const challenges = dataService.getChallenges();
  const videos = dataService.getYouTubeVideos();
  const transactions = dataService.getAllTransactions();

  const totalUsers = users.length;
  const vipUsers = users.filter((u) => u.vip).length;
  const pendingDeposits = deposits.filter((d) => d.status === 'pending');
  const approvedDeposits = deposits.filter((d) => d.status === 'approved');
  const totalStars = users.reduce((acc, u) => acc + (u.stars || 0), 0);

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
    { label: 'VIP Members', value: vipUsers, icon: Crown, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Pending Deposits', value: pendingDeposits.length, icon: CreditCard, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40', alert: pendingDeposits.length > 0 },
    { label: 'Approved Deposits', value: approvedDeposits.length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Active Books', value: books.filter((b) => b.is_active).length, icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Active Challenges', value: challenges.filter((c) => c.is_active).length, icon: Flame, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40' },
    { label: 'YouTube Videos', value: videos.filter((v) => v.is_active).length, icon: Youtube, color: 'text-red-600 bg-red-50 dark:bg-red-950/40' },
    { label: 'Total Community Stars', value: totalStars, icon: Sparkles, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40' },
  ];

  return (
    <div id="admin-dashboard-tab" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Clinical & Operational Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time synchronization with Supabase PostgreSQL database
          </p>
        </div>
        {pendingDeposits.length > 0 && (
          <button
            onClick={() => onNavigate('deposits')}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm animate-pulse"
          >
            <span>{pendingDeposits.length} Deposit(s) Awaiting Review</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 8 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border shadow-xs flex items-center justify-between transition-all ${
                s.alert
                  ? 'border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {s.label}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{s.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Content: Recent Deposits & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending / Recent Deposits */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Recent Deposit Requests</span>
            </h3>
            <button
              onClick={() => onNavigate('deposits')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Manage All →
            </button>
          </div>

          <div className="space-y-2.5">
            {deposits.slice(0, 4).map((dep) => (
              <div
                key={dep.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    <img
                      src={dep.receipt_url}
                      alt="Receipt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {dep.user?.first_name || 'User'} ({dep.payment_method})
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Ref: {dep.transaction_reference}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    +{dep.amount} ETB
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      dep.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : dep.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {dep.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Community Members */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Registered Users Directory</span>
            </h3>
            <button
              onClick={() => onNavigate('users')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2.5">
            {users.slice(0, 4).map((u) => (
              <div
                key={u.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={u.first_name}
                    className="w-9 h-9 rounded-xl object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{u.first_name} {u.last_name}</span>
                      {u.vip && <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">TG: {u.telegram_id || 'N/A'}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-600">
                    {(Number(u.wallet_balance) || 0).toFixed(2)} ETB
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {u.stars || 0} ⭐ • {u.challenge_streak || 0}d streak
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
