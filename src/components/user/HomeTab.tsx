import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Wallet, Crown, CheckCircle2, Clock, Play, BookOpen, ChevronRight, PhoneCall, Smile, Meh, Frown, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Challenge, Book, YouTubeVideo, UserTab } from '../../types';
import { dataService } from '../../services/dataService';
import { triggerHaptic } from '../../utils/telegram';

interface HomeTabProps {
  user: UserProfile;
  onChangeTab: (tab: UserTab) => void;
  onOpenDeposit: () => void;
  onOpenVip: () => void;
  onOpenDoctorTalk: () => void;
  onOpenBookReader: (book: Book) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  lang?: 'en' | 'am';
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  onChangeTab,
  onOpenDeposit,
  onOpenVip,
  onOpenDoctorTalk,
  onOpenBookReader,
  onShowToast,
  lang = 'en'
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [restSeconds, setRestSeconds] = useState<number>(0);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  const dailyChallenge = dataService.getDailyChallenge();
  const books = dataService.getActiveBooks().slice(0, 3);
  const videos = dataService.getActiveYouTubeVideos().slice(0, 4);

  const isCompleted = dailyChallenge ? dataService.isChallengeCompleted(user.id, dailyChallenge.id) : false;

  // Real-time 24-hour rest countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const remaining = dataService.getRemainingDailyRestSeconds(user);
      setRestSeconds(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [user.last_challenge_completed_at]);

  const formatCountdown = (totalSecs: number) => {
    if (totalSecs <= 0) return '00:00:00';
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartDailyChallenge = () => {
    if (!dailyChallenge) return;
    triggerHaptic('medium');

    if (isCompleted || restSeconds > 0) {
      onShowToast('info', 'Challenge Already Done', 'You have already completed your daily challenge. Enjoy resting!');
      return;
    }

    setIsCompleting(true);
    setTimeout(() => {
      const result = dataService.completeDailyChallenge(user.id, dailyChallenge.id);
      setIsCompleting(false);

      if (result.success) {
        triggerHaptic('success');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onShowToast('success', '🎉 Challenge Complete!', result.message);
      } else {
        triggerHaptic('warning');
        onShowToast('error', 'Notice', result.message);
      }
    }, 400);
  };

  const moods = [
    { label: 'Energetic', icon: '😄', color: 'hover:bg-amber-100 dark:hover:bg-amber-950/60' },
    { label: 'Balanced', icon: '🙂', color: 'hover:bg-emerald-100 dark:hover:bg-emerald-950/60' },
    { label: 'Tired', icon: '😴', color: 'hover:bg-blue-100 dark:hover:bg-blue-950/60' },
    { label: 'Stressed', icon: '😣', color: 'hover:bg-rose-100 dark:hover:bg-rose-950/60' },
    { label: 'Reflective', icon: '🧘', color: 'hover:bg-purple-100 dark:hover:bg-purple-950/60' }
  ];

  return (
    <div id="user-home-tab" className="space-y-5 pb-24 animate-in fade-in">
      {/* Top App Header & User Identity */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user.first_name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/80 shadow-sm"
            />
            {user.vip && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow">
                <Crown className="w-3 h-3" />
              </span>
            )}
          </div>
          <div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
              Tena Holistic
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {lang === 'am' ? 'ሰላም' : 'Hello'}, {user.first_name} 👋
            </h1>
          </div>
        </div>

        {/* VIP Pill */}
        <button
          id="vip-badge-header"
          onClick={() => {
            triggerHaptic('light');
            onOpenVip();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
            user.vip
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span>{user.vip ? 'VIP' : 'Get VIP'}</span>
        </button>
      </header>

      {/* Metrics Row: Stars, Streak, Wallet */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{user.stars}</span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'am' ? 'ኮከቦች' : 'Stars'}
          </span>
        </div>

        <div className="bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="flex items-center gap-1 text-orange-700 dark:text-orange-400 font-bold text-sm">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>{user.challenge_streak}d</span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'am' ? 'ተከታታይ' : 'Streak'}
          </span>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenDeposit();
          }}
          className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-400 transition-colors"
        >
          <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>{user.wallet_balance} ETB</span>
          </div>
          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-0.5">
            + Deposit
          </span>
        </button>
      </section>

      {/* Emotional Wellbeing Check (Inspired by uploaded designs) */}
      <section className="bg-white dark:bg-slate-800/80 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {lang === 'am' ? 'ዛሬ ምን ይሰማዎታል?' : 'How are you feeling today?'}
          </span>
          {selectedMood && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in">
              Logged: {selectedMood}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between px-1">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => {
                triggerHaptic('light');
                setSelectedMood(m.label);
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${m.color} ${
                selectedMood === m.label ? 'bg-emerald-50 dark:bg-emerald-950 scale-110' : ''
              }`}
            >
              <span className="text-2xl select-none">{m.icon}</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Immediate Crisis Support Action */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Need health guidance?</span>
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenDoctorTalk();
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 text-slate-800 dark:text-slate-200 hover:text-emerald-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-emerald-600" />
            <span>Talk to Doctor</span>
          </button>
        </div>
      </section>

      {/* Hero Card: Today's Challenge */}
      {dailyChallenge && (
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {lang === 'am' ? 'የዛሬው ውድድር' : "Today's Challenge"}
            </h2>
            <button
              onClick={() => onChangeTab('challenges')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 hover:underline"
            >
              <span>See all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-700 shadow-sm transition-all">
            <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <img
                src={dailyChallenge.image_url}
                alt={dailyChallenge.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shadow-xs">
                  {dailyChallenge.category}
                </span>
                <span className="px-2.5 py-0.5 bg-black/50 backdrop-blur-md rounded-full text-[11px] font-semibold text-white">
                  {dailyChallenge.duration}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1 text-amber-300 text-xs font-bold mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>+{dailyChallenge.stars_reward} Stars Reward</span>
                </div>
                <h3 className="text-base font-bold leading-snug drop-shadow-xs">{dailyChallenge.title}</h3>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {dailyChallenge.description}
              </p>

              {isCompleted || restSeconds > 0 ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>{lang === 'am' ? 'ተጠናቋል ✓' : 'COMPLETED ✓'}</span>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Great Job!</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>{lang === 'am' ? 'ቀጣይ ፈተና በ:' : 'Next challenge in:'}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {formatCountdown(restSeconds)}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  id="start-daily-challenge-btn"
                  onClick={handleStartDailyChallenge}
                  disabled={isCompleting}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isCompleting ? 'Completing...' : lang === 'am' ? 'ጀምር' : 'START CHALLENGE'}</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* VIP Exclusive Club Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-5 text-white shadow-sm">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 rounded-xl">
              <Crown className="w-5 h-5 text-white fill-white" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-100">
              💎 TENA HOLISTIC VIP
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-bold leading-tight">Elevate Your Cellular Health</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-amber-100/90 pt-1">
              <span>• Free books & guides</span>
              <span>• Free metabolic tricks</span>
              <span>• Free paid challenges</span>
              <span>• Talk to the doctor</span>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenVip();
            }}
            className="mt-1 px-4 py-2 bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>Explore VIP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Recommended Videos (2-column cards) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            {lang === 'am' ? 'የተመረጡ ቪዲዮዎች' : 'Recommended Videos'}
          </h2>
          <button
            onClick={() => onChangeTab('youtube')}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 hover:underline"
          >
            <span>Watch more</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {videos.map((vid) => (
            <a
              key={vid.id}
              href={vid.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-col group hover:border-emerald-400 transition-all"
            >
              <div className="relative h-24 w-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <img
                  src={vid.thumbnail_url}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5 block truncate">
                  {vid.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {vid.title}
                </h4>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Books Preview */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            {lang === 'am' ? 'መጽሐፍት' : 'Books & Medical Guides'}
          </h2>
          <button
            onClick={() => onChangeTab('library')}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 hover:underline"
          >
            <span>Library</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {books.map((book) => {
            const isPurchased = book.is_free || dataService.isContentPurchased(user.id, 'book', book.id);
            return (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center gap-3.5"
              >
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded-xl shrink-0 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {book.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    By {book.author}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        book.is_free
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                          : isPurchased
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {book.is_free ? 'FREE' : isPurchased ? 'OWNED' : `${book.price} ETB`}
                    </span>
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        if (isPurchased) {
                          onOpenBookReader(book);
                        } else {
                          onChangeTab('library');
                        }
                      }}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {isPurchased ? 'Read Now →' : 'Unlock →'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
