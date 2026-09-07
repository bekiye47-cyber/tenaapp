export interface UserProfile {
  id: string;
  telegram_id: number | string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  stars: number;
  challenge_streak: number;
  vip: boolean;
  wallet_balance: number;
  last_challenge_completed_at?: string | null;
  theme_preference: 'light' | 'dark' | 'auto';
  language?: 'en' | 'am';
  created_at: string;
  updated_at?: string;
  last_seen_at?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  category: string;
  price: number; // in ETB
  is_free: boolean;
  file_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  image_url: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  price: number; // in ETB
  is_free: boolean;
  stars_reward: number;
  order_number: number;
  is_active: boolean;
  is_daily: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ChallengeProgress {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_at: string;
  stars_awarded: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  category: string;
  tags: string[];
  is_active: boolean;
  order_number: number;
  created_at: string;
  updated_at?: string;
}

export type VipContentType = 'book' | 'trick' | 'challenge' | 'tip' | 'doctor_talk';

export interface VipContent {
  id: string;
  title: string;
  description: string;
  image_url: string;
  content: string;
  content_type: VipContentType;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type DepositStatus = 'pending' | 'approved' | 'rejected';
export type PaymentMethod = 'Telebirr' | 'CBE Birr';

export interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  payment_method: PaymentMethod;
  transaction_reference: string;
  receipt_url: string;
  status: DepositStatus;
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  // Joined user details for admin display
  user?: {
    telegram_id: number | string;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  };
}

export type TransactionType = 'deposit' | 'book_purchase' | 'challenge_purchase' | 'adjustment';

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: TransactionType;
  reference: string;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  content_type: 'book' | 'challenge';
  content_id: string;
  price: number;
  purchased_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  requirement_type: 'challenges' | 'stars' | 'streak' | 'vip';
  requirement_value: number;
  stars_reward: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface PaymentSettings {
  id: string;
  telebirr_account_name: string;
  telebirr_account_number: string;
  telebirr_instructions: string;
  cbe_account_name: string;
  cbe_account_number: string;
  cbe_instructions: string;
  updated_at: string;
}

export interface AppSettings {
  id: string;
  doctor_name: string;
  doctor_specialty: string;
  doctor_bio: string;
  doctor_contact_info: string;
  doctor_avatar_url: string;
  emergency_crisis_phone: string;
  updated_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  details: string;
  created_at: string;
}

export type UserTab = 'home' | 'challenges' | 'library' | 'youtube' | 'profile';
export type AdminTab = 'dashboard' | 'users' | 'deposits' | 'wallet' | 'books' | 'challenges' | 'youtube' | 'vip' | 'payments' | 'logs' | 'settings';
