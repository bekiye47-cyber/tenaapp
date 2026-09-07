import React, { useState } from 'react';
import { Database, Copy, Check, X, ExternalLink, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickSql = `-- TENA HOLISTIC COMPLETE DATABASE SETUP
-- Paste into Supabase Dashboard -> SQL Editor -> Run

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id BIGINT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  username TEXT,
  photo_url TEXT,
  wallet_balance NUMERIC(12,2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
  stars INTEGER DEFAULT 0,
  challenge_streak INTEGER DEFAULT 0,
  vip BOOLEAN DEFAULT FALSE,
  last_challenge_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Deposits Table
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL,
  transaction_reference TEXT UNIQUE NOT NULL,
  receipt_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Books Table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) DEFAULT 0.00,
  is_free BOOLEAN DEFAULT TRUE,
  file_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Challenges Table
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Easy',
  duration TEXT DEFAULT '15 Mins',
  price NUMERIC(10,2) DEFAULT 0.00,
  is_free BOOLEAN DEFAULT TRUE,
  stars_reward INTEGER DEFAULT 10,
  is_daily BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Atomic Purchase RPC Function
CREATE OR REPLACE FUNCTION process_purchase(
  p_user_id UUID,
  p_content_type TEXT,
  p_content_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_price NUMERIC;
  v_balance NUMERIC;
  v_title TEXT;
BEGIN
  IF p_content_type = 'book' THEN
    SELECT price, title INTO v_price, v_title FROM public.books WHERE id = p_content_id;
  ELSE
    SELECT price, title INTO v_price, v_title FROM public.challenges WHERE id = p_content_id;
  END IF;

  SELECT wallet_balance INTO v_balance FROM public.users WHERE id = p_user_id FOR UPDATE;

  IF v_balance < v_price THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient wallet balance');
  END IF;

  UPDATE public.users SET wallet_balance = wallet_balance - v_price, updated_at = NOW() WHERE id = p_user_id;
  INSERT INTO public.purchases (user_id, content_type, content_id, price_paid) VALUES (p_user_id, p_content_type, p_content_id, v_price);
  INSERT INTO public.wallet_transactions (user_id, amount, transaction_type, reference) VALUES (p_user_id, -v_price, 'purchase', 'Unlocked: ' || v_title);

  RETURN json_build_object('success', true, 'message', 'Purchase successful!');
END;
$$ LANGUAGE plpgsql;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quickSql);
    setCopied(true);
    onShowToast('success', 'SQL Copied to Clipboard', 'Paste this into your Supabase SQL Editor.');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Supabase Cloud Connection Guide</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isSupabaseConfigured
                  ? '✓ Connected to Supabase Cloud Instance'
                  : 'Currently running in resilient Offline/Local Mock mode with persistent local state'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Create your free Supabase Project</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
              Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-semibold">supabase.com</a>, create a free project named "Tena Holistic".
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Execute Database Migration SQL</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
              In your Supabase dashboard, click <strong>SQL Editor</strong>, click <strong>New Query</strong>, paste the schema below and click <strong>Run</strong>.
            </p>

            <div className="pt-2 pl-6">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Schema SQL'}</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Set Environment Variables</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
              Copy your Project URL and Anon Key from Project Settings &gt; API, and set them as:
            </p>
            <div className="pl-6 font-mono text-[11px] bg-slate-900 text-emerald-300 p-2.5 rounded-xl">
              VITE_SUPABASE_URL=https://your-project.supabase.co<br />
              VITE_SUPABASE_ANON_KEY=your-anon-key
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
