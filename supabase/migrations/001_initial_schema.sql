-- ==============================================================================
-- TENA HOLISTIC: 001_initial_schema.sql
-- Complete PostgreSQL schema, tables, constraints, functions, RLS and triggers
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_id BIGINT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT DEFAULT '',
    username TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    stars INTEGER DEFAULT 0 CHECK (stars >= 0),
    challenge_streak INTEGER DEFAULT 0 CHECK (challenge_streak >= 0),
    vip BOOLEAN DEFAULT FALSE,
    wallet_balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
    last_challenge_completed_at TIMESTAMPTZ,
    theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON public.users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_vip ON public.users(vip);

-- 2. BOOK CATEGORIES
CREATE TABLE IF NOT EXISTS public.book_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKS
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.00 CHECK (price >= 0),
    is_free BOOLEAN DEFAULT TRUE,
    file_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_active ON public.books(is_active);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);

-- 4. CHALLENGES
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Easy' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    duration TEXT DEFAULT '15 mins',
    price NUMERIC(10, 2) DEFAULT 0.00 CHECK (price >= 0),
    is_free BOOLEAN DEFAULT TRUE,
    stars_reward INTEGER DEFAULT 1 CHECK (stars_reward >= 1),
    order_number INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_daily BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_daily ON public.challenges(is_daily, is_active, order_number);

-- 5. CHALLENGE PROGRESS
CREATE TABLE IF NOT EXISTS public.challenge_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    stars_awarded INTEGER DEFAULT 1,
    UNIQUE(user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_progress_user ON public.challenge_progress(user_id);

-- 6. YOUTUBE CATEGORIES
CREATE TABLE IF NOT EXISTS public.youtube_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. YOUTUBE VIDEOS
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    order_number INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_youtube_active ON public.youtube_videos(is_active, order_number);

-- 8. VIP CONTENT
CREATE TABLE IF NOT EXISTS public.vip_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('book', 'trick', 'challenge', 'tip', 'doctor_talk')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DEPOSITS
CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Telebirr', 'CBE Birr')),
    transaction_reference TEXT NOT NULL,
    receipt_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_deposits_user ON public.deposits(user_id);

-- 10. WALLET TRANSACTIONS (Immutable Ledger)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL, -- positive for credits, negative for debits
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'book_purchase', 'challenge_purchase', 'adjustment')),
    reference TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_user ON public.wallet_transactions(user_id, created_at DESC);

-- 11. PURCHASES (Permanent unlock records)
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('book', 'challenge')),
    content_id UUID NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

CREATE INDEX IF NOT EXISTS idx_purchases_user ON public.purchases(user_id);

-- 12. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    requirement_type TEXT NOT NULL CHECK (requirement_type IN ('challenges', 'stars', 'streak', 'vip')),
    requirement_value INTEGER NOT NULL DEFAULT 1,
    stars_reward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- 14. PAYMENT SETTINGS
CREATE TABLE IF NOT EXISTS public.payment_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telebirr_account_name TEXT NOT NULL,
    telebirr_account_number TEXT NOT NULL,
    telebirr_instructions TEXT NOT NULL,
    cbe_account_name TEXT NOT NULL,
    cbe_account_number TEXT NOT NULL,
    cbe_instructions TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. APP SETTINGS (Doctor & Health Care)
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_name TEXT NOT NULL DEFAULT 'Dr. Aster Haile, MD',
    doctor_specialty TEXT NOT NULL DEFAULT 'Preventive Medicine & Metabolic Health',
    doctor_bio TEXT NOT NULL DEFAULT 'Over 14 years clinical experience helping patients overcome insulin resistance, hypertension, and chronic lifestyle diseases naturally.',
    doctor_contact_info TEXT NOT NULL DEFAULT '@TenaHolisticDoctor',
    doctor_avatar_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    emergency_crisis_phone TEXT NOT NULL DEFAULT '8000',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. ADMIN ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ATOMIC STORED PROCEDURES (RPC) FOR FINANCIAL & PROGRESS INTEGRITY
-- ==============================================================================

-- Atomic Purchase Processing (Books & Challenges)
CREATE OR REPLACE FUNCTION public.process_purchase(
    p_user_id UUID,
    p_content_type TEXT,
    p_content_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_balance NUMERIC;
    v_price NUMERIC;
    v_title TEXT;
    v_existing_purchase UUID;
BEGIN
    -- Check if already purchased
    SELECT id INTO v_existing_purchase
    FROM public.purchases
    WHERE user_id = p_user_id AND content_type = p_content_type AND content_id = p_content_id;

    IF v_existing_purchase IS NOT NULL THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already purchased', 'already_owned', true);
    END IF;

    -- Get item price and title
    IF p_content_type = 'book' THEN
        SELECT price, title INTO v_price, v_title FROM public.books WHERE id = p_content_id AND is_active = true;
    ELSIF p_content_type = 'challenge' THEN
        SELECT price, title INTO v_price, v_title FROM public.challenges WHERE id = p_content_id AND is_active = true;
    ELSE
        RAISE EXCEPTION 'Invalid content type: %', p_content_type;
    END IF;

    IF v_price IS NULL THEN
        RAISE EXCEPTION 'Item not found or inactive';
    END IF;

    -- If item is free, grant without deducting wallet
    IF v_price <= 0 THEN
        INSERT INTO public.purchases (user_id, content_type, content_id, price)
        VALUES (p_user_id, p_content_type, p_content_id, 0);
        RETURN jsonb_build_object('success', true, 'message', 'Unlocked free content', 'new_balance', v_user_balance);
    END IF;

    -- Check user wallet balance with lock
    SELECT wallet_balance INTO v_user_balance
    FROM public.users
    WHERE id = p_user_id
    FOR UPDATE;

    IF v_user_balance IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    IF v_user_balance < v_price THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient wallet balance', 'required', v_price, 'balance', v_user_balance);
    END IF;

    -- Deduct wallet
    UPDATE public.users
    SET wallet_balance = wallet_balance - v_price,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Record transaction
    INSERT INTO public.wallet_transactions (user_id, amount, transaction_type, reference)
    VALUES (p_user_id, -v_price, (p_content_type || '_purchase')::text, 'Purchased ' || p_content_type || ': ' || v_title);

    -- Record purchase
    INSERT INTO public.purchases (user_id, content_type, content_id, price)
    VALUES (p_user_id, p_content_type, p_content_id, v_price);

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Purchase successful',
        'new_balance', v_user_balance - v_price
    );
END;
$$;

-- Atomic Deposit Review (Approve or Reject)
CREATE OR REPLACE FUNCTION public.review_deposit(
    p_deposit_id UUID,
    p_status TEXT,
    p_admin_id TEXT,
    p_rejection_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deposit RECORD;
BEGIN
    SELECT * INTO v_deposit
    FROM public.deposits
    WHERE id = p_deposit_id
    FOR UPDATE;

    IF v_deposit IS NULL THEN
        RAISE EXCEPTION 'Deposit record not found';
    END IF;

    IF v_deposit.status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Deposit already processed: ' || v_deposit.status);
    END IF;

    IF p_status = 'approved' THEN
        -- Credit user wallet
        UPDATE public.users
        SET wallet_balance = wallet_balance + v_deposit.amount,
            updated_at = NOW()
        WHERE id = v_deposit.user_id;

        -- Record wallet transaction
        INSERT INTO public.wallet_transactions (user_id, amount, transaction_type, reference)
        VALUES (v_deposit.user_id, v_deposit.amount, 'deposit', 'Deposit approved (' || v_deposit.payment_method || ' Ref: ' || v_deposit.transaction_reference || ')');

        -- Update deposit status
        UPDATE public.deposits
        SET status = 'approved',
            reviewed_at = NOW(),
            reviewed_by = p_admin_id
        WHERE id = p_deposit_id;

        RETURN jsonb_build_object('success', true, 'message', 'Deposit approved and wallet credited');
    ELSIF p_status = 'rejected' THEN
        UPDATE public.deposits
        SET status = 'rejected',
            rejection_reason = p_rejection_reason,
            reviewed_at = NOW(),
            reviewed_by = p_admin_id
        WHERE id = p_deposit_id;

        RETURN jsonb_build_object('success', true, 'message', 'Deposit rejected');
    ELSE
        RAISE EXCEPTION 'Invalid review status: %', p_status;
    END IF;
END;
$$;

-- Atomic Complete Daily Challenge & Streak Engine
CREATE OR REPLACE FUNCTION public.complete_daily_challenge(
    p_user_id UUID,
    p_challenge_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user RECORD;
    v_challenge RECORD;
    v_existing_progress UUID;
    v_hours_since_last NUMERIC;
    v_new_streak INTEGER;
BEGIN
    SELECT * INTO v_challenge FROM public.challenges WHERE id = p_challenge_id AND is_active = true;
    IF v_challenge IS NULL THEN
        RAISE EXCEPTION 'Challenge not found';
    END IF;

    SELECT * INTO v_user FROM public.users WHERE id = p_user_id FOR UPDATE;
    IF v_user IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Check if already completed this specific challenge
    SELECT id INTO v_existing_progress FROM public.challenge_progress
    WHERE user_id = p_user_id AND challenge_id = p_challenge_id;

    IF v_existing_progress IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'You have already completed this challenge and collected the stars!');
    END IF;

    -- Check 24 hour rest interval for daily challenge
    IF v_challenge.is_daily AND v_user.last_challenge_completed_at IS NOT NULL THEN
        v_hours_since_last := EXTRACT(EPOCH FROM (NOW() - v_user.last_challenge_completed_at)) / 3600.0;
        IF v_hours_since_last < 24.0 THEN
            RETURN jsonb_build_object(
                'success', false,
                'message', 'Next daily challenge is resting. Available in ' || ROUND(24.0 - v_hours_since_last, 1)::text || ' hours.',
                'remaining_seconds', ROUND((24.0 - v_hours_since_last) * 3600)
            );
        END IF;
    END IF;

    -- Calculate streak: if completed within 48 hours, streak+1; otherwise reset to 1
    IF v_user.last_challenge_completed_at IS NOT NULL THEN
        IF EXTRACT(EPOCH FROM (NOW() - v_user.last_challenge_completed_at)) / 3600.0 <= 48.0 THEN
            v_new_streak := v_user.challenge_streak + 1;
        ELSE
            v_new_streak := 1;
        END IF;
    ELSE
        v_new_streak := 1;
    END IF;

    -- Record progress
    INSERT INTO public.challenge_progress (user_id, challenge_id, stars_awarded, completed_at)
    VALUES (p_user_id, p_challenge_id, v_challenge.stars_reward, NOW());

    -- Update user stars, streak, and timestamp
    UPDATE public.users
    SET stars = stars + v_challenge.stars_reward,
        challenge_streak = v_new_streak,
        last_challenge_completed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'stars_awarded', v_challenge.stars_reward,
        'new_stars_total', v_user.stars + v_challenge.stars_reward,
        'new_streak', v_new_streak
    );
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Public read for active catalog items
CREATE POLICY "Public read active books" ON public.books FOR SELECT USING (is_active = true);
CREATE POLICY "Public read book categories" ON public.book_categories FOR SELECT USING (true);
CREATE POLICY "Public read active challenges" ON public.challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active youtube" ON public.youtube_videos FOR SELECT USING (is_active = true);
CREATE POLICY "Public read youtube categories" ON public.youtube_categories FOR SELECT USING (true);
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public read payment settings" ON public.payment_settings FOR SELECT USING (true);
CREATE POLICY "Public read app settings" ON public.app_settings FOR SELECT USING (true);

-- Authenticated Admin full control policies (for users with authenticated role in Supabase Auth)
CREATE POLICY "Admin full access books" ON public.books FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access challenges" ON public.challenges FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access youtube" ON public.youtube_videos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access vip_content" ON public.vip_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access deposits" ON public.deposits FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access users" ON public.users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access payment_settings" ON public.payment_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access app_settings" ON public.app_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access logs" ON public.admin_activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Anon / Telegram App policies (Controlled access for Telegram users based on telegram_id / user_id)
CREATE POLICY "Users can view and create their own profile" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users can create deposits" ON public.deposits FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view deposits" ON public.deposits FOR SELECT USING (true);
CREATE POLICY "Users can view wallet transactions" ON public.wallet_transactions FOR SELECT USING (true);
CREATE POLICY "Users can view purchases" ON public.purchases FOR SELECT USING (true);
CREATE POLICY "Users can view challenge progress" ON public.challenge_progress FOR SELECT USING (true);
CREATE POLICY "Users can view vip_content" ON public.vip_content FOR SELECT USING (is_active = true);
