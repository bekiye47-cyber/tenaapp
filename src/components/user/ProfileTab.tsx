import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Flame,
  Wallet,
  Crown,
  History,
  BookOpen,
  Award,
  Settings,
  Moon,
  Sun,
  Globe,
  ChevronRight,
  Shield,
  PhoneCall,
  CheckCircle2,
  Lock,
  FileText,
  HelpCircle,
  X
} from 'lucide-react';
import { UserProfile, UserTab, Book, Challenge, WalletTransaction } from '../../types';
import { dataService } from '../../services/dataService';
import { triggerHaptic } from '../../utils/telegram';

interface ProfileTabProps {
  user: UserProfile;
  onOpenDeposit: () => void;
  onOpenVip: () => void;
  onOpenDoctorTalk: () => void;
  onOpenBookReader: (book: Book) => void;
  onToggleTheme: () => void;
  currentTheme: 'light' | 'dark';
  currentLang: 'en' | 'am';
  onToggleLang: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onOpenDeposit,
  onOpenVip,
  onOpenDoctorTalk,
  onOpenBookReader,
  onToggleTheme,
  currentTheme,
  currentLang,
  onToggleLang,
  onShowToast
}) => {
  const [activeModal, setActiveModal] = useState<'transactions' | 'achievements' | 'purchases' | 'info' | null>(null);

  const transactions = dataService.getUserTransactions(user.id);
  const purchases = dataService.getUserPurchases(user.id);
  const allBooks = dataService.getBooks();
  const allChallenges = dataService.getChallenges();
  const achievements = dataService.getAchievements();

  const purchasedBooks = allBooks.filter((b) => dataService.isContentPurchased(user.id, 'book', b.id));
  const purchasedChallenges = allChallenges.filter((c) => dataService.isContentPurchased(user.id, 'challenge', c.id));

  return (
    <div id="user-profile-tab" className="space-y-4 pb-24 animate-in fade-in">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user.first_name}
              className="w-16 h-16 rounded-3xl object-cover border-2 border-emerald-500 shadow-sm"
            />
            {user.vip && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs p-1 rounded-full ring-2 ring-white dark:ring-slate-800 shadow">
                <Crown className="w-3.5 h-3.5 fill-current" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {user.first_name} {user.last_name}
              </h2>
              {user.vip && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold">
                  VIP
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              @{user?.username || `tg_${user?.telegram_id || 'user'}`}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Telegram ID: <span className="font-mono">{user?.telegram_id || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex flex-col items-center p-2.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30">
            <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{user?.stars || 0}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Stars Earned</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30">
            <div className="flex items-center gap-1 text-orange-700 dark:text-orange-400 font-bold text-sm">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{user?.challenge_streak || 0}d</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Streak</span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30">
            <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{achievements.length}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Badges</span>
          </div>
        </div>
      </div>

      {/* Wallet Management Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-5 text-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-2xl">
              <Wallet className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-[11px] text-emerald-200/80 font-medium block">Tena Holistic Balance</span>
              <h3 className="text-2xl font-black">{(Number(user?.wallet_balance) || 0).toFixed(2)} ETB</h3>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveModal('transactions');
            }}
            className="flex items-center gap-1 text-xs text-emerald-200 hover:text-white px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            id="profile-deposit-btn"
            onClick={() => {
              triggerHaptic('medium');
              onOpenDeposit();
            }}
            className="py-2.5 px-3 bg-white text-emerald-950 hover:bg-emerald-50 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <span>+ Deposit ETB</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveModal('transactions');
            }}
            className="py-2.5 px-3 bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{transactions.length} Transactions</span>
          </button>
        </div>
      </div>

      {/* Profile Actions List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60 overflow-hidden shadow-xs">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveModal('achievements');
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Health Achievements & Badges</h4>
              <p className="text-[11px] text-slate-400">View unlocked trophies & star rewards</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveModal('purchases');
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">My Unlocked Content</h4>
              <p className="text-[11px] text-slate-400">
                {purchasedBooks.length} books, {purchasedChallenges.length} challenges
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenVip();
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Tena Holistic VIP Status</h4>
              <p className="text-[11px] text-slate-400">
                {user.vip ? 'Active VIP Member • All Protocols Unlocked' : 'Explore VIP Benefits'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenDoctorTalk();
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Talk to Doctor & Crisis Hotline</h4>
              <p className="text-[11px] text-slate-400">Contact Dr. Aster & emergency line</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Preferences & Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">
          Settings & Preferences
        </h3>

        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-semibold">
            {currentTheme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Theme: {currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleTheme();
            }}
            className="px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white shadow-xs"
          >
            Toggle
          </button>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-semibold">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>Language: {currentLang === 'en' ? 'English' : 'አማርኛ (Amharic)'}</span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleLang();
            }}
            className="px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white shadow-xs"
          >
            {currentLang === 'en' ? 'አማርኛ' : 'English'}
          </button>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveModal('info');
          }}
          className="w-full p-2.5 rounded-2xl text-xs text-slate-500 dark:text-slate-400 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 block"
        >
          About Tena Holistic, Privacy & Clinical Terms →
        </button>
      </div>

      {/* Modal: Transactions Ledger */}
      {activeModal === 'transactions' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Wallet Transaction History</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {transactions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No transactions recorded yet.
                </div>
              ) : (
                transactions.map((tx) => {
                  const isCredit = tx.amount > 0;
                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{tx.reference}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <span className={`font-mono font-bold text-sm ${isCredit ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {isCredit ? `+${tx.amount}` : tx.amount} ETB
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Achievements */}
      {activeModal === 'achievements' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Health Achievements</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {achievements.map((ach) => {
                const isUnlocked =
                  (ach.requirement_type === 'challenges' && user.stars >= 1) ||
                  (ach.requirement_type === 'vip' && user.vip) ||
                  (ach.requirement_type === 'streak' && user.challenge_streak >= ach.requirement_value) ||
                  (ach.requirement_type === 'stars' && user.stars >= ach.requirement_value);

                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="text-2xl select-none">{ach.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{ach.title}</h4>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{ach.description}</p>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 shrink-0">
                      +{ach.stars_reward} ⭐
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Unlocked Purchases */}
      {activeModal === 'purchases' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">My Unlocked Content</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unlocked Books</span>
                {purchasedBooks.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No paid books unlocked yet.</p>
                ) : (
                  purchasedBooks.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div className="truncate mr-2">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{b.title}</div>
                        <div className="text-[10px] text-slate-400">{b.author}</div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveModal(null);
                          onOpenBookReader(b);
                        }}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-semibold shrink-0"
                      >
                        Read Now
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unlocked Challenges</span>
                {purchasedChallenges.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No paid masterclasses unlocked yet.</p>
                ) : (
                  purchasedChallenges.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div className="truncate mr-2">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{c.title}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">{c.duration} • {c.difficulty}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        Unlocked ✓
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: About & Medical Disclaimer */}
      {activeModal === 'info' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">About Tena Holistic</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong className="text-slate-900 dark:text-white font-bold">Tena Holistic (ጤና ሆሊስቲክ)</strong> is a preventive health and metabolic wellness platform designed to help communities understand their biochemistry, reverse insulin resistance, and adopt joyful daily movement.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white pt-1">Medical Educational Disclaimer:</h4>
              <p className="text-[11px] bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                All challenges, books, video lectures, and metabolic tricks provided across Tena Holistic are intended for health education and lifestyle improvement. They do not constitute personalized medical diagnosis, prescription, or acute hospital care. Always consult your personal physician before modifying ongoing clinical prescriptions.
              </p>
              <p className="text-[11px] text-slate-400">
                Tena Holistic Version 1.0 • Built with Telegram Mini Apps & Supabase
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
