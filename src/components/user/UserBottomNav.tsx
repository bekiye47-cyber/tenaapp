import React from 'react';
import { Home, Flame, BookOpen, Youtube, User } from 'lucide-react';
import { UserTab } from '../../types';
import { triggerHaptic } from '../../utils/telegram';

interface UserBottomNavProps {
  activeTab: UserTab;
  onChangeTab: (tab: UserTab) => void;
  lang?: 'en' | 'am';
}

export const UserBottomNav: React.FC<UserBottomNavProps> = ({ activeTab, onChangeTab, lang = 'en' }) => {
  const tabs: { id: UserTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: lang === 'am' ? 'መነሻ' : 'Home', icon: Home },
    { id: 'challenges', label: lang === 'am' ? 'ተግዳሮቶች' : 'Challenges', icon: Flame },
    { id: 'library', label: lang === 'am' ? 'ቤተ-መጽሐፍት' : 'Library', icon: BookOpen },
    { id: 'youtube', label: lang === 'am' ? 'ዩቲዩብ' : 'YouTube', icon: Youtube },
    { id: 'profile', label: lang === 'am' ? 'መገለጫ' : 'Profile', icon: User },
  ];

  return (
    <nav
      id="user-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 safe-bottom transition-colors"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => {
                triggerHaptic('light');
                onChangeTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-emerald-500 rounded-full shadow-sm" />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-50 dark:bg-emerald-950/50 scale-110' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
