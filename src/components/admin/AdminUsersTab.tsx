import React, { useState } from 'react';
import { Users, Search, Crown, Sparkles, Flame, Wallet, Eye, ShieldCheck, ShieldAlert, X } from 'lucide-react';
import { UserProfile } from '../../types';
import { dataService } from '../../services/dataService';

interface AdminUsersTabProps {
  adminEmail: string;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ adminEmail, onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVip, setFilterVip] = useState<'all' | 'vip' | 'regular'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const users = dataService.getUsers();

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      (u.first_name || '').toLowerCase().includes(query) ||
      (u.last_name || '').toLowerCase().includes(query) ||
      (u.username || '').toLowerCase().includes(query) ||
      (u.telegram_id ? u.telegram_id.toString() : '').includes(query);

    const matchVip =
      filterVip === 'all' ||
      (filterVip === 'vip' && u.vip) ||
      (filterVip === 'regular' && !u.vip);

    return matchSearch && matchVip;
  });

  const handleToggleVip = (user: UserProfile) => {
    const newStatus = !user.vip;
    const res = dataService.setUserVip(user.id, newStatus, adminEmail);
    if (res.success) {
      onShowToast(
        'success',
        newStatus ? 'VIP Granted' : 'VIP Removed',
        `${user.first_name} is ${newStatus ? 'now a VIP member' : 'reverted to regular member'}.`
      );
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({ ...selectedUser, vip: newStatus });
      }
    } else {
      onShowToast('error', 'Update Failed', res.message);
    }
  };

  return (
    <div id="admin-users-tab" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Community & User Directory</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor Telegram user progress, wallet balances, and grant or revoke VIP membership
          </p>
        </div>

        {/* Filter VIP */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {(['all', 'vip', 'regular'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterVip(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterVip === mode
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by first name, username (@...), or Telegram ID..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Telegram ID</th>
                <th className="p-4">Wallet Balance</th>
                <th className="p-4">Progress Stats</th>
                <th className="p-4">VIP Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-750 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                          alt={u.first_name}
                          className="w-10 h-10 rounded-2xl object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{u.first_name} {u.last_name}</span>
                            {u.vip && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            @{u.username || 'unknown'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300">
                      {u.telegram_id || 'N/A'}
                    </td>

                    <td className="p-4">
                      <span className="font-mono font-bold text-emerald-600 text-sm">
                        {(Number(u.wallet_balance) || 0).toFixed(2)} ETB
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                          {u.stars}
                        </span>
                        <span className="flex items-center gap-1 text-orange-600 font-semibold">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          {u.challenge_streak}d
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          u.vip
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {u.vip ? '💎 VIP Member' : 'Standard'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleVip(u)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                            u.vip
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
                          }`}
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>{u.vip ? 'Remove VIP' : 'Grant VIP'}</span>
                        </button>

                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl text-slate-700 dark:text-slate-200"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">User Comprehensive Profile</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={selectedUser.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={selectedUser.first_name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
              />
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedUser.first_name} {selectedUser.last_name}
                </h4>
                <p className="text-xs text-slate-500 font-mono">@{selectedUser.username || 'unknown'}</p>
                <p className="text-[11px] text-slate-400 font-mono">TG ID: {selectedUser.telegram_id || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Wallet Balance</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">{(Number(selectedUser.wallet_balance) || 0).toFixed(2)} ETB</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">VIP Status</span>
                <span className="font-bold text-amber-600 text-sm">{selectedUser.vip ? 'Active VIP' : 'Standard'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Stars Earned</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.stars} ⭐</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Challenge Streak</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedUser.challenge_streak} days 🔥</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleToggleVip(selectedUser)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  selectedUser.vip
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>{selectedUser.vip ? 'Revoke VIP Status' : 'Grant VIP Status'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
