import { UserProfile } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          query_id?: string;
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
          auth_date?: number;
          hash?: string;
        };
        colorScheme?: 'light' | 'dark';
        themeParams?: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded?: boolean;
        viewportHeight?: number;
        viewportStableHeight?: number;
        ready: () => void;
        expand: () => void;
        close: () => void;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        openLink?: (url: string) => void;
        openTelegramLink?: (url: string) => void;
      };
    };
  }
}

export const isInsideTelegram = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.Telegram?.WebApp?.initData);
};

export const initTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    } catch (e) {
      console.warn('Could not initialize Telegram WebApp API:', e);
    }
  }
};

export const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'warning' = 'light') => {
  try {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      if (type === 'success' || type === 'warning') {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
      } else {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    }
  } catch {
    // Haptic not supported or failed silently
  }
};

export const DEFAULT_DEMO_USERS: UserProfile[] = [
  {
    id: 'user-001',
    telegram_id: 68492011,
    first_name: 'Bereket',
    last_name: 'Tekle',
    username: 'berekettk',
    photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    stars: 12,
    challenge_streak: 5,
    vip: true,
    wallet_balance: 350.00,
    last_challenge_completed_at: null,
    theme_preference: 'light',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    last_seen_at: new Date().toISOString()
  },
  {
    id: 'user-002',
    telegram_id: 92837461,
    first_name: 'Selamawit',
    last_name: 'Alemu',
    username: 'selam_health',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    stars: 4,
    challenge_streak: 2,
    vip: false,
    wallet_balance: 50.00,
    last_challenge_completed_at: null,
    theme_preference: 'light',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    last_seen_at: new Date().toISOString()
  }
];

export const getTelegramUser = (): {
  telegram_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
} => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    return {
      telegram_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || '',
      username: user.username || '',
      photo_url: user.photo_url || ''
    };
  }
  // Default demo user when opened in browser / desktop preview
  return {
    telegram_id: 68492011,
    first_name: 'Bereket',
    last_name: 'Tekle',
    username: 'berekettk',
    photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  };
};
