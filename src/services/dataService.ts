import { supabase, isSupabaseConfigured } from './supabase';
import {
  INITIAL_BOOKS,
  INITIAL_CHALLENGES,
  INITIAL_YOUTUBE_VIDEOS,
  INITIAL_VIP_CONTENT,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_APP_SETTINGS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_DEPOSITS,
  INITIAL_TRANSACTIONS,
  INITIAL_PURCHASES,
  INITIAL_LOGS
} from './initialData';
import { DEFAULT_DEMO_USERS } from '../utils/telegram';
import {
  UserProfile,
  Book,
  Challenge,
  YouTubeVideo,
  VipContent,
  Deposit,
  WalletTransaction,
  Purchase,
  PaymentSettings,
  AppSettings,
  AdminActivityLog,
  Achievement
} from '../types';

// Persistent Local Store Keys
const STORE_USERS = 'TENA_USERS';
const STORE_BOOKS = 'TENA_BOOKS';
const STORE_CHALLENGES = 'TENA_CHALLENGES';
const STORE_YOUTUBE = 'TENA_YOUTUBE';
const STORE_VIP = 'TENA_VIP';
const STORE_DEPOSITS = 'TENA_DEPOSITS';
const STORE_TRANSACTIONS = 'TENA_TRANSACTIONS';
const STORE_PURCHASES = 'TENA_PURCHASES';
const STORE_PAYMENT_SETTINGS = 'TENA_PAYMENT_SETTINGS';
const STORE_APP_SETTINGS = 'TENA_APP_SETTINGS';
const STORE_LOGS = 'TENA_LOGS';
const STORE_PROGRESS = 'TENA_CHALLENGE_PROGRESS';

function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

class DataService {
  private users: UserProfile[] = loadStored(STORE_USERS, DEFAULT_DEMO_USERS);
  private books: Book[] = loadStored(STORE_BOOKS, INITIAL_BOOKS);
  private challenges: Challenge[] = loadStored(STORE_CHALLENGES, INITIAL_CHALLENGES);
  private youtube: YouTubeVideo[] = loadStored(STORE_YOUTUBE, INITIAL_YOUTUBE_VIDEOS);
  private vipContent: VipContent[] = loadStored(STORE_VIP, INITIAL_VIP_CONTENT);
  private deposits: Deposit[] = loadStored(STORE_DEPOSITS, INITIAL_DEPOSITS);
  private transactions: WalletTransaction[] = loadStored(STORE_TRANSACTIONS, INITIAL_TRANSACTIONS);
  private purchases: Purchase[] = loadStored(STORE_PURCHASES, INITIAL_PURCHASES);
  private paymentSettings: PaymentSettings = loadStored(STORE_PAYMENT_SETTINGS, INITIAL_PAYMENT_SETTINGS);
  private appSettings: AppSettings = loadStored(STORE_APP_SETTINGS, INITIAL_APP_SETTINGS);
  private logs: AdminActivityLog[] = loadStored(STORE_LOGS, INITIAL_LOGS);
  private progress: { userId: string; challengeId: string; completedAt: string }[] = loadStored(STORE_PROGRESS, []);

  private listeners: Set<() => void> = new Set();

  constructor() {
    // Sanitize loaded user objects ensuring numeric wallet balance and valid properties
    this.users = (this.users || []).map((u) => ({
      ...u,
      wallet_balance: typeof u.wallet_balance === 'number' && !isNaN(u.wallet_balance) ? u.wallet_balance : 0,
      stars: typeof u.stars === 'number' ? u.stars : 0,
      challenge_streak: typeof u.challenge_streak === 'number' ? u.challenge_streak : 0
    }));
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // --- USER IDENTIFICATION & SYNC ---
  public getOrCreateUser(telegramData?: {
    telegram_id?: number | string;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  } | null): UserProfile {
    const data = telegramData || {
      telegram_id: 68492011,
      first_name: 'Bereket',
      last_name: 'Tekle',
      username: 'berekettk',
      photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    const numericId = Number(data.telegram_id || 68492011);
    let user = this.users.find((u) => Number(u.telegram_id) === numericId);

    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        telegram_id: numericId,
        first_name: data.first_name || 'Bereket',
        last_name: data.last_name || '',
        username: data.username || '',
        photo_url: data.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        stars: 0,
        challenge_streak: 0,
        vip: false,
        wallet_balance: 0,
        theme_preference: 'light',
        created_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString()
      };
      this.users.unshift(user);
      saveStored(STORE_USERS, this.users);
      this.notify();
    } else {
      user.last_seen_at = new Date().toISOString();
      if (data.first_name) user.first_name = data.first_name;
      if (data.photo_url) user.photo_url = data.photo_url;
      if (typeof user.wallet_balance !== 'number' || isNaN(user.wallet_balance)) {
        user.wallet_balance = 0;
      }
      saveStored(STORE_USERS, this.users);
    }

    // Optional background sync with Supabase
    if (isSupabaseConfigured && supabase) {
      this.syncUserToSupabase(user, data).catch((e) => console.warn('Supabase sync error:', e));
    }

    return user;
  }

  private async syncUserToSupabase(user: UserProfile, data: { telegram_id?: number | string; first_name?: string; last_name?: string; username?: string; photo_url?: string }) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', user.telegram_id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('users')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase.from('users').insert({
          telegram_id: user.telegram_id,
          first_name: user.first_name,
          last_name: user.last_name || '',
          username: user.username || '',
          photo_url: user.photo_url || '',
          stars: user.stars || 0,
          challenge_streak: user.challenge_streak || 0,
          vip: !!user.vip,
          wallet_balance: user.wallet_balance || 0,
          theme_preference: user.theme_preference || 'light'
        });
      }
    } catch (e) {
      console.warn('Supabase background user sync error:', e);
    }
  }

  public getUsers(): UserProfile[] {
    return this.users;
  }

  public getUserById(userId: string): UserProfile | undefined {
    return this.users.find((u) => u.id === userId);
  }

  public updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const userIndex = this.users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates, updated_at: new Date().toISOString() };
      saveStored(STORE_USERS, this.users);
      this.notify();
    }
  }

  // --- BOOKS ---
  public getBooks(): Book[] {
    return this.books;
  }

  public getActiveBooks(): Book[] {
    return this.books.filter((b) => b.is_active);
  }

  public addBook(book: Omit<Book, 'id' | 'created_at'>, adminEmail?: string): Book {
    const newBook: Book = {
      ...book,
      id: `book-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.books.unshift(newBook);
    saveStored(STORE_BOOKS, this.books);
    this.logAdminAction('Created Book', `Created new book: ${newBook.title} (${newBook.is_free ? 'Free' : newBook.price + ' ETB'})`, adminEmail);
    this.notify();
    return newBook;
  }

  public createBook(book: Omit<Book, 'id' | 'created_at'>, adminEmail?: string): Book {
    return this.addBook(book, adminEmail);
  }

  public updateBook(id: string, updates: Partial<Book>, adminEmail?: string) {
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.books[idx] = { ...this.books[idx], ...updates, updated_at: new Date().toISOString() };
      saveStored(STORE_BOOKS, this.books);
      this.logAdminAction('Updated Book', `Updated book: ${this.books[idx].title}`, adminEmail);
      this.notify();
    }
  }

  public deleteBook(id: string) {
    const target = this.books.find((b) => b.id === id);
    this.books = this.books.filter((b) => b.id !== id);
    saveStored(STORE_BOOKS, this.books);
    if (target) {
      this.logAdminAction('Deleted Book', `Deleted book: ${target.title}`);
    }
    this.notify();
  }

  // --- CHALLENGES ---
  public getChallenges(): Challenge[] {
    return this.challenges;
  }

  public getActiveChallenges(): Challenge[] {
    return this.challenges.filter((c) => c.is_active);
  }

  public getDailyChallenge(): Challenge | undefined {
    const dailies = this.challenges.filter((c) => c.is_active && c.is_daily);
    if (dailies.length === 0) return this.challenges.find((c) => c.is_active);
    return dailies.sort((a, b) => a.order_number - b.order_number)[0];
  }

  public addChallenge(challenge: Omit<Challenge, 'id' | 'created_at'>, adminEmail?: string): Challenge {
    const newChallenge: Challenge = {
      ...challenge,
      id: `challenge-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.challenges.push(newChallenge);
    saveStored(STORE_CHALLENGES, this.challenges);
    this.logAdminAction('Created Challenge', `Created challenge: ${newChallenge.title}`, adminEmail);
    this.notify();
    return newChallenge;
  }

  public createChallenge(challenge: Omit<Challenge, 'id' | 'created_at'>, adminEmail?: string): Challenge {
    return this.addChallenge(challenge, adminEmail);
  }

  public updateChallenge(id: string, updates: Partial<Challenge>, adminEmail?: string) {
    const idx = this.challenges.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.challenges[idx] = { ...this.challenges[idx], ...updates, updated_at: new Date().toISOString() };
      saveStored(STORE_CHALLENGES, this.challenges);
      this.logAdminAction('Updated Challenge', `Updated challenge: ${this.challenges[idx].title}`, adminEmail);
      this.notify();
    }
  }

  public deleteChallenge(id: string) {
    const target = this.challenges.find((c) => c.id === id);
    this.challenges = this.challenges.filter((c) => c.id !== id);
    saveStored(STORE_CHALLENGES, this.challenges);
    if (target) {
      this.logAdminAction('Deleted Challenge', `Deleted challenge: ${target.title}`);
    }
    this.notify();
  }

  // --- DAILY CHALLENGE COMPLETION & 24H REST ENGINE ---
  public isChallengeCompleted(userId: string, challengeId: string): boolean {
    return this.progress.some((p) => p.userId === userId && p.challengeId === challengeId);
  }

  public getRemainingDailyRestSeconds(user: UserProfile): number {
    if (!user.last_challenge_completed_at) return 0;
    const completedAt = new Date(user.last_challenge_completed_at).getTime();
    const now = Date.now();
    const elapsedSeconds = (now - completedAt) / 1000;
    const restPeriod = 24 * 3600; // 24 hours
    if (elapsedSeconds >= restPeriod) return 0;
    return Math.ceil(restPeriod - elapsedSeconds);
  }

  public completeDailyChallenge(userId: string, challengeId: string): {
    success: boolean;
    message: string;
    starsAwarded?: number;
    newStarsTotal?: number;
    newStreak?: number;
  } {
    const user = this.getUserById(userId);
    const challenge = this.challenges.find((c) => c.id === challengeId);

    if (!user || !challenge) {
      return { success: false, message: 'User or challenge not found' };
    }

    if (this.isChallengeCompleted(userId, challengeId)) {
      return { success: false, message: 'You have already completed this challenge!' };
    }

    // Check rest period if daily
    if (challenge.is_daily) {
      const remainingSeconds = this.getRemainingDailyRestSeconds(user);
      if (remainingSeconds > 0) {
        const hours = ((Number(remainingSeconds) || 0) / 3600).toFixed(1);
        return {
          success: false,
          message: `Next daily challenge is resting. Available in ${hours} hours.`
        };
      }
    }

    // Calculate streak
    let newStreak = 1;
    if (user.last_challenge_completed_at) {
      const hoursSinceLast = (Date.now() - new Date(user.last_challenge_completed_at).getTime()) / (1000 * 3600);
      if (hoursSinceLast <= 48) {
        newStreak = (user.challenge_streak || 0) + 1;
      }
    }

    const starsEarned = challenge.stars_reward || 1;
    const newStars = (user.stars || 0) + starsEarned;

    // Record progress
    this.progress.push({
      userId,
      challengeId,
      completedAt: new Date().toISOString()
    });
    saveStored(STORE_PROGRESS, this.progress);

    // Update user
    this.updateUserProfile(userId, {
      stars: newStars,
      challenge_streak: newStreak,
      last_challenge_completed_at: new Date().toISOString()
    });

    return {
      success: true,
      message: `Great job! You earned +${starsEarned} Stars!`,
      starsAwarded: starsEarned,
      newStarsTotal: newStars,
      newStreak
    };
  }

  // --- YOUTUBE VIDEOS ---
  public getYouTubeVideos(): YouTubeVideo[] {
    return this.youtube;
  }

  public getActiveYouTubeVideos(): YouTubeVideo[] {
    return this.youtube.filter((y) => y.is_active).sort((a, b) => a.order_number - b.order_number);
  }

  public addYouTubeVideo(video: Omit<YouTubeVideo, 'id' | 'created_at'>, adminEmail?: string): YouTubeVideo {
    const newVid: YouTubeVideo = {
      ...video,
      id: `yt-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.youtube.unshift(newVid);
    saveStored(STORE_YOUTUBE, this.youtube);
    this.logAdminAction('Added YouTube Video', `Added: ${newVid.title} (${newVid.category})`, adminEmail);
    this.notify();
    return newVid;
  }

  public createYouTubeVideo(video: Omit<YouTubeVideo, 'id' | 'created_at'>, adminEmail?: string): YouTubeVideo {
    return this.addYouTubeVideo(video, adminEmail);
  }

  public updateYouTubeVideo(id: string, updates: Partial<YouTubeVideo>, adminEmail?: string) {
    const idx = this.youtube.findIndex((y) => y.id === id);
    if (idx !== -1) {
      this.youtube[idx] = { ...this.youtube[idx], ...updates, updated_at: new Date().toISOString() };
      saveStored(STORE_YOUTUBE, this.youtube);
      this.logAdminAction('Updated YouTube Video', `Updated: ${this.youtube[idx].title}`, adminEmail);
      this.notify();
    }
  }

  public deleteYouTubeVideo(id: string) {
    const target = this.youtube.find((y) => y.id === id);
    this.youtube = this.youtube.filter((y) => y.id !== id);
    saveStored(STORE_YOUTUBE, this.youtube);
    if (target) {
      this.logAdminAction('Deleted YouTube Video', `Deleted: ${target.title}`);
    }
    this.notify();
  }

  // --- VIP CONTENT ---
  public getVipContent(): VipContent[] {
    return this.vipContent;
  }

  public getActiveVipContent(): VipContent[] {
    return this.vipContent.filter((v) => v.is_active);
  }

  public addVipContent(content: Omit<VipContent, 'id' | 'created_at'>, adminEmail?: string): VipContent {
    const item: VipContent = {
      ...content,
      id: `vip-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.vipContent.unshift(item);
    saveStored(STORE_VIP, this.vipContent);
    this.logAdminAction('Added VIP Content', `Created VIP ${item.content_type}: ${item.title}`, adminEmail);
    this.notify();
    return item;
  }

  public createVipContent(content: Omit<VipContent, 'id' | 'created_at'>, adminEmail?: string): VipContent {
    return this.addVipContent(content, adminEmail);
  }

  public updateVipContent(id: string, updates: Partial<VipContent>, adminEmail?: string) {
    const idx = this.vipContent.findIndex((v) => v.id === id);
    if (idx !== -1) {
      this.vipContent[idx] = { ...this.vipContent[idx], ...updates, updated_at: new Date().toISOString() };
      saveStored(STORE_VIP, this.vipContent);
      this.logAdminAction('Updated VIP Content', `Updated: ${this.vipContent[idx].title}`, adminEmail);
      this.notify();
    }
  }

  public deleteVipContent(id: string) {
    const target = this.vipContent.find((v) => v.id === id);
    this.vipContent = this.vipContent.filter((v) => v.id !== id);
    saveStored(STORE_VIP, this.vipContent);
    if (target) {
      this.logAdminAction('Deleted VIP Content', `Deleted: ${target.title}`);
    }
    this.notify();
  }

  public setVipStatus(userId: string, isVip: boolean, adminEmail?: string): { success: boolean; message: string } {
    const user = this.getUserById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    this.updateUserProfile(userId, { vip: isVip });
    this.logAdminAction(
      isVip ? 'Granted VIP' : 'Revoked VIP',
      `${isVip ? 'Granted' : 'Revoked'} VIP membership for user ${user.first_name} (@${user.username || user.telegram_id})`,
      adminEmail
    );
    return {
      success: true,
      message: `${user.first_name} is ${isVip ? 'now a VIP member' : 'reverted to regular member'}.`
    };
  }

  public setUserVip(userId: string, isVip: boolean, adminEmail?: string): { success: boolean; message: string } {
    return this.setVipStatus(userId, isVip, adminEmail);
  }

  // --- DEPOSITS & WALLET LEDGER ---
  public getDeposits(): Deposit[] {
    return this.deposits;
  }

  public getUserDeposits(userId: string): Deposit[] {
    return this.deposits.filter((d) => d.user_id === userId);
  }

  public submitDeposit(deposit: Omit<Deposit, 'id' | 'status' | 'submitted_at'>): Deposit {
    const newDep: Deposit = {
      ...deposit,
      id: `dep-${Date.now()}`,
      status: 'pending',
      submitted_at: new Date().toISOString()
    };
    this.deposits.unshift(newDep);
    saveStored(STORE_DEPOSITS, this.deposits);
    this.notify();
    return newDep;
  }

  public reviewDeposit(depositId: string, status: 'approved' | 'rejected', adminId: string, rejectionReason?: string): {
    success: boolean;
    message: string;
  } {
    const depositIndex = this.deposits.findIndex((d) => d.id === depositId);
    if (depositIndex === -1) {
      return { success: false, message: 'Deposit not found' };
    }

    const deposit = this.deposits[depositIndex];
    if (deposit.status !== 'pending') {
      return { success: false, message: `Deposit already ${deposit.status}` };
    }

    const user = this.getUserById(deposit.user_id);
    if (!user) {
      return { success: false, message: 'User account not found' };
    }

    if (status === 'approved') {
      // 1. Credit user wallet balance
      const newBalance = Number(user.wallet_balance || 0) + Number(deposit.amount);
      this.updateUserProfile(user.id, { wallet_balance: newBalance });

      // 2. Insert immutable wallet ledger transaction
      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        user_id: user.id,
        amount: Number(deposit.amount),
        transaction_type: 'deposit',
        reference: `Deposit approved (${deposit.payment_method} Ref: ${deposit.transaction_reference})`,
        created_at: new Date().toISOString()
      };
      this.transactions.unshift(tx);
      saveStored(STORE_TRANSACTIONS, this.transactions);

      // 3. Mark deposit approved
      this.deposits[depositIndex] = {
        ...deposit,
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId
      };
      saveStored(STORE_DEPOSITS, this.deposits);

      this.logAdminAction(
        'Approved Deposit',
        `Approved ${deposit.amount} ETB via ${deposit.payment_method} for ${user.first_name} (Ref: ${deposit.transaction_reference})`
      );
      this.notify();
      return { success: true, message: 'Deposit approved and wallet credited successfully.' };
    } else {
      // Rejected
      this.deposits[depositIndex] = {
        ...deposit,
        status: 'rejected',
        rejection_reason: rejectionReason || 'Information does not match official bank record',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId
      };
      saveStored(STORE_DEPOSITS, this.deposits);

      this.logAdminAction(
        'Rejected Deposit',
        `Rejected ${deposit.amount} ETB for ${user.first_name} (Reason: ${rejectionReason || 'Unverified'})`
      );
      this.notify();
      return { success: true, message: 'Deposit marked as rejected.' };
    }
  }

  // --- PURCHASES & ATOMIC TRANSACTIONS ---
  public getUserPurchases(userId: string): Purchase[] {
    return this.purchases.filter((p) => p.user_id === userId);
  }

  public isContentPurchased(userId: string, contentType: 'book' | 'challenge', contentId: string): boolean {
    return this.purchases.some((p) => p.user_id === userId && p.content_type === contentType && p.content_id === contentId);
  }

  public purchaseContent(userId: string, contentType: 'book' | 'challenge', contentId: string): {
    success: boolean;
    message: string;
    newBalance?: number;
  } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'User not found' };

    if (this.isContentPurchased(userId, contentType, contentId)) {
      return { success: true, message: 'Content is already unlocked.' };
    }

    let itemTitle = '';
    let itemPrice = 0;

    if (contentType === 'book') {
      const book = this.books.find((b) => b.id === contentId);
      if (!book) return { success: false, message: 'Book not found' };
      itemTitle = book.title;
      itemPrice = book.is_free ? 0 : book.price;
    } else {
      const challenge = this.challenges.find((c) => c.id === contentId);
      if (!challenge) return { success: false, message: 'Challenge not found' };
      itemTitle = challenge.title;
      itemPrice = challenge.is_free ? 0 : challenge.price;
    }

    if (itemPrice > 0 && (user.wallet_balance || 0) < itemPrice) {
      return {
        success: false,
        message: `Insufficient wallet balance (${user.wallet_balance || 0} ETB). You need ${itemPrice} ETB.`
      };
    }

    const newBalance = (user.wallet_balance || 0) - itemPrice;

    // Deduct wallet if paid
    if (itemPrice > 0) {
      this.updateUserProfile(userId, { wallet_balance: newBalance });

      // Ledger transaction
      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        user_id: userId,
        amount: -itemPrice,
        transaction_type: `${contentType}_purchase` as any,
        reference: `Purchased ${contentType}: ${itemTitle}`,
        created_at: new Date().toISOString()
      };
      this.transactions.unshift(tx);
      saveStored(STORE_TRANSACTIONS, this.transactions);
    }

    // Create permanent purchase record
    const purchase: Purchase = {
      id: `pur-${Date.now()}`,
      user_id: userId,
      content_type: contentType,
      content_id: contentId,
      price: itemPrice,
      purchased_at: new Date().toISOString()
    };
    this.purchases.unshift(purchase);
    saveStored(STORE_PURCHASES, this.purchases);
    this.notify();

    return {
      success: true,
      message: `Successfully unlocked "${itemTitle}"!`,
      newBalance
    };
  }

  // --- WALLET TRANSACTIONS ---
  public getUserTransactions(userId: string): WalletTransaction[] {
    return this.transactions.filter((t) => t.user_id === userId);
  }

  public getAllTransactions(): WalletTransaction[] {
    return this.transactions;
  }

  // --- ACHIEVEMENTS ---
  public getAchievements(): Achievement[] {
    return INITIAL_ACHIEVEMENTS;
  }

  // --- SETTINGS ---
  public getPaymentSettings(): PaymentSettings {
    return this.paymentSettings;
  }

  public updatePaymentSettings(settings: Partial<PaymentSettings>, adminEmail?: string) {
    this.paymentSettings = { ...this.paymentSettings, ...settings, updated_at: new Date().toISOString() };
    saveStored(STORE_PAYMENT_SETTINGS, this.paymentSettings);
    this.logAdminAction('Updated Payment Settings', 'Updated Telebirr and CBE account credentials', adminEmail);
    this.notify();
  }

  public getAppSettings(): AppSettings {
    return this.appSettings;
  }

  public updateAppSettings(settings: Partial<AppSettings>, adminEmail?: string) {
    this.appSettings = { ...this.appSettings, ...settings, updated_at: new Date().toISOString() };
    saveStored(STORE_APP_SETTINGS, this.appSettings);
    this.logAdminAction('Updated App Settings', 'Updated doctor bio, contact, or emergency helpline', adminEmail);
    this.notify();
  }

  // --- ADMIN ACTIVITY LOGS ---
  public getLogs(): AdminActivityLog[] {
    return this.logs;
  }

  public getActivityLogs(): AdminActivityLog[] {
    return this.logs;
  }

  public logAdminAction(action: string, details: string, adminEmail = 'admin@tenaholistic.com') {
    const log: AdminActivityLog = {
      id: `log-${Date.now()}`,
      admin_id: 'admin-current',
      admin_email: adminEmail,
      action,
      details,
      created_at: new Date().toISOString()
    };
    this.logs.unshift(log);
    saveStored(STORE_LOGS, this.logs);
    this.notify();
  }
}

export const dataService = new DataService();
