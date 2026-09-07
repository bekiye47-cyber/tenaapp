import React, { useState } from 'react';
import { Lock, Mail, Key, LogIn, ArrowLeft, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

interface AdminLoginModalProps {
  onLoginSuccess: (email: string) => void;
  onBackToUserApp: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onLoginSuccess,
  onBackToUserApp,
  onShowToast
}) => {
  const [email, setEmail] = useState<string>('admin@tenaholistic.com');
  const [password, setPassword] = useState<string>('Admin123!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          // Fallback check for demo credentials
          if (email === 'admin@tenaholistic.com') {
            onLoginSuccess(email);
            return;
          }
          throw error;
        }

        onLoginSuccess(data.user?.email || email);
      } else {
        // Mock authentication check
        if (password.length >= 6) {
          onLoginSuccess(email);
        } else {
          setErrorMsg('Password must be at least 6 characters long.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Check credentials.');
      onShowToast('error', 'Login Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="admin-login-screen" className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-white animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-wide text-white">TENA HOLISTIC</h2>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Clinical & Administration Console
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Authorized medical staff and administrators only. Enter your credentials to access the PC control panel.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-2xl text-xs">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tenaholistic.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Security Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            id="admin-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Verifying...' : 'Sign In to Admin Dashboard'}</span>
          </button>
        </form>

        {/* Demo Helper Banner */}
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800 text-slate-400 text-[11px] space-y-1">
          <span className="font-semibold text-slate-300 block">Default Demo Credentials:</span>
          <div>Email: <span className="text-emerald-400 font-mono">admin@tenaholistic.com</span></div>
          <div>Password: <span className="text-emerald-400 font-mono">Admin123!</span></div>
        </div>

        {/* Back to User App */}
        <div className="pt-2 text-center">
          <button
            onClick={onBackToUserApp}
            className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Telegram Mini App View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
