import React, { useState, useEffect } from 'react';
import { UserTab, AdminTab, UserProfile, Book } from './types';
import { dataService } from './services/dataService';
import { getTelegramUser, initTelegramWebApp, triggerHaptic } from './utils/telegram';

// User Components
import { UserBottomNav } from './components/user/UserBottomNav';
import { HomeTab } from './components/user/HomeTab';
import { ChallengesTab } from './components/user/ChallengesTab';
import { LibraryTab } from './components/user/LibraryTab';
import { YouTubeTab } from './components/user/YouTubeTab';
import { ProfileTab } from './components/user/ProfileTab';
import { DepositModal } from './components/user/DepositModal';
import { BookReaderModal } from './components/user/BookReaderModal';
import { VipSectionModal } from './components/user/VipSectionModal';
import { DoctorTalkModal } from './components/user/DoctorTalkModal';

// Admin Components
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboardTab } from './components/admin/AdminDashboardTab';
import { AdminDepositsTab } from './components/admin/AdminDepositsTab';
import { AdminUsersTab } from './components/admin/AdminUsersTab';
import { AdminBooksTab } from './components/admin/AdminBooksTab';
import { AdminChallengesTab } from './components/admin/AdminChallengesTab';
import { AdminYouTubeTab } from './components/admin/AdminYouTubeTab';
import { AdminVipTab } from './components/admin/AdminVipTab';
import { AdminPaymentSettingsTab } from './components/admin/AdminPaymentSettingsTab';
import { AdminLogsTab } from './components/admin/AdminLogsTab';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { SupabaseSetupModal } from './components/admin/SupabaseSetupModal';

// Common
import { Toast, ToastMessage } from './components/common/Toast';
import { Shield, Smartphone, Laptop } from 'lucide-react';

export default function App() {
  // App Mode: 'user' (Telegram Mini App) | 'admin' (PC Admin Dashboard)
  const [appMode, setAppMode] = useState<'user' | 'admin'>(() => {
    return window.location.hash === '#admin' ? 'admin' : 'user';
  });

  // User Navigation
  const [activeUserTab, setActiveUserTab] = useState<UserTab>('home');

  // Admin Navigation & Auth
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem('tena_admin_session');
  });

  // Modals
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isVipOpen, setIsVipOpen] = useState<boolean>(false);
  const [isDoctorTalkOpen, setIsDoctorTalkOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  // Appearance & Localization
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('tena_theme') as 'light' | 'dark') || 'light';
  });
  const [lang, setLang] = useState<'en' | 'am'>(() => {
    return (localStorage.getItem('tena_lang') as 'en' | 'am') || 'en';
  });

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Current User Profile from dataService
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const tgUser = getTelegramUser();
    return dataService.getOrCreateUser(tgUser);
  });

  // Re-render trigger when dataService changes
  const [, setTick] = useState<number>(0);

  useEffect(() => {
    initTelegramWebApp();

    const unsubscribe = dataService.subscribe(() => {
      const tgUser = getTelegramUser();
      const updated = dataService.getOrCreateUser(tgUser);
      setCurrentUser({ ...updated });
      setTick((t) => t + 1);
    });

    return () => unsubscribe();
  }, []);

  // Theme Sync
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('tena_theme', theme);
  }, [theme]);

  // Language Sync
  const toggleLang = () => {
    const next = lang === 'en' ? 'am' : 'en';
    setLang(next);
    localStorage.setItem('tena_lang', next);
    addToast('info', next === 'am' ? 'ቋንቋ ተቀይሯል' : 'Language Switched', next === 'am' ? 'ወደ አማርኛ ተቀይሯል' : 'Switched to English');
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      title,
      message
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAdminLogin = (email: string) => {
    setAdminEmail(email);
    localStorage.setItem('tena_admin_session', email);
    addToast('success', 'Admin Authenticated', `Welcome back, ${email}`);
  };

  const handleAdminLogout = () => {
    setAdminEmail(null);
    localStorage.removeItem('tena_admin_session');
    addToast('info', 'Logged Out', 'Admin session terminated.');
  };

  const pendingDepositsCount = dataService.getDeposits().filter((d) => d.status === 'pending').length;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} antialiased font-sans transition-colors duration-200`}>
      {/* Toast Manager */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Mode Switcher Floating Pill (For preview & seamless switching between Telegram user view and PC Admin view) */}
      <div className="fixed top-3 right-3 z-40 flex items-center gap-1 bg-slate-900/90 dark:bg-slate-800/90 text-white p-1 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-md text-xs font-semibold">
        <button
          onClick={() => {
            triggerHaptic('light');
            setAppMode('user');
            window.location.hash = '';
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
            appMode === 'user' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Telegram Mini App</span>
          <span className="sm:hidden">App</span>
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setAppMode('admin');
            window.location.hash = '#admin';
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
            appMode === 'admin' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">PC Admin</span>
          <span className="sm:hidden">Admin</span>
          {pendingDepositsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5" />
          )}
        </button>
      </div>

      {/* =========================================================================
          VIEW A: TELEGRAM MINI APP (MOBILE & USER VIEW)
         ========================================================================= */}
      {appMode === 'user' ? (
        <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-slate-50 dark:bg-slate-900 border-x border-slate-200/60 dark:border-slate-800 shadow-2xl">
          {/* Main User Tab Content Area */}
          <main className="flex-1 px-4 pt-4 overflow-y-auto">
            {activeUserTab === 'home' && (
              <HomeTab
                user={currentUser}
                onChangeTab={setActiveUserTab}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onOpenVip={() => setIsVipOpen(true)}
                onOpenDoctorTalk={() => setIsDoctorTalkOpen(true)}
                onOpenBookReader={(b) => setReadingBook(b)}
                onShowToast={addToast}
                lang={lang}
              />
            )}

            {activeUserTab === 'challenges' && (
              <ChallengesTab
                user={currentUser}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onShowToast={addToast}
                lang={lang}
              />
            )}

            {activeUserTab === 'library' && (
              <LibraryTab
                user={currentUser}
                onOpenBookReader={(b) => setReadingBook(b)}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onShowToast={addToast}
                lang={lang}
              />
            )}

            {activeUserTab === 'youtube' && (
              <YouTubeTab lang={lang} />
            )}

            {activeUserTab === 'profile' && (
              <ProfileTab
                user={currentUser}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onOpenVip={() => setIsVipOpen(true)}
                onOpenDoctorTalk={() => setIsDoctorTalkOpen(true)}
                onOpenBookReader={(b) => setReadingBook(b)}
                onToggleTheme={toggleTheme}
                currentTheme={theme}
                currentLang={lang}
                onToggleLang={toggleLang}
                onShowToast={addToast}
              />
            )}
          </main>

          {/* User Sticky Bottom Navigation Bar */}
          <UserBottomNav
            activeTab={activeUserTab}
            onChangeTab={setActiveUserTab}
            lang={lang}
          />

          {/* User Modals */}
          <DepositModal
            isOpen={isDepositOpen}
            onClose={() => setIsDepositOpen(false)}
            user={currentUser}
            onSuccess={() => {
              addToast('success', 'Deposit Submitted', 'Receipt received. We will verify and credit your wallet promptly.');
            }}
          />

          {readingBook && (
            <BookReaderModal
              book={readingBook}
              isOpen={Boolean(readingBook)}
              onClose={() => setReadingBook(null)}
            />
          )}

          <VipSectionModal
            user={currentUser}
            isOpen={isVipOpen}
            onClose={() => setIsVipOpen(false)}
            onOpenDoctorTalk={() => {
              setIsVipOpen(false);
              setIsDoctorTalkOpen(true);
            }}
          />

          <DoctorTalkModal
            isOpen={isDoctorTalkOpen}
            onClose={() => setIsDoctorTalkOpen(false)}
          />
        </div>
      ) : (
        /* =========================================================================
            VIEW B: PC ADMIN CONSOLE
           ========================================================================= */
        !adminEmail ? (
          <AdminLoginModal
            onLoginSuccess={handleAdminLogin}
            onBackToUserApp={() => setAppMode('user')}
            onShowToast={addToast}
          />
        ) : (
          <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <AdminSidebar
              activeTab={activeAdminTab}
              onChangeTab={setActiveAdminTab}
              pendingDepositsCount={pendingDepositsCount}
              adminEmail={adminEmail}
              onLogout={handleAdminLogout}
              onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
              onSwitchToUserApp={() => setAppMode('user')}
            />

            {/* Main Admin View Container */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Tena Holistic Administration Portal
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                  </button>
                  <button
                    onClick={() => setIsSupabaseModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                  >
                    Supabase Schema
                  </button>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                {activeAdminTab === 'dashboard' && (
                  <AdminDashboardTab onNavigate={setActiveAdminTab} />
                )}
                {activeAdminTab === 'deposits' && (
                  <AdminDepositsTab adminEmail={adminEmail} onShowToast={addToast} />
                )}
                {activeAdminTab === 'users' && (
                  <AdminUsersTab adminEmail={adminEmail} onShowToast={addToast} />
                )}
                {activeAdminTab === 'books' && (
                  <AdminBooksTab adminEmail={adminEmail} onShowToast={addToast} />
                )}
                {activeAdminTab === 'challenges' && (
                  <AdminChallengesTab adminEmail={adminEmail} onShowToast={addToast} />
                )}
                {activeAdminTab === 'youtube' && (
                  <AdminYouTubeTab adminEmail={adminEmail} onShowToast={addToast} />
                )}
                {activeAdminTab === 'vip' && (
                  <AdminVipTab adminEmail={adminEmail} onShowToast={addToast} />
                )}
                {activeAdminTab === 'payments' && (
                  <AdminPaymentSettingsTab adminEmail={adminEmail} onShowToast={addToast} />
                )}
                {activeAdminTab === 'logs' && (
                  <AdminLogsTab />
                )}
              </main>
            </div>

            {/* Supabase Setup / Schema Copier Modal */}
            <SupabaseSetupModal
              isOpen={isSupabaseModalOpen}
              onClose={() => setIsSupabaseModalOpen(false)}
              onShowToast={addToast}
            />
          </div>
        )
      )}
    </div>
  );
}
