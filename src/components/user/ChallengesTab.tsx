import React, { useState } from 'react';
import { Flame, Sparkles, Lock, CheckCircle2, Play, Filter, Clock, Dumbbell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Challenge } from '../../types';
import { dataService } from '../../services/dataService';
import { triggerHaptic } from '../../utils/telegram';

interface ChallengesTabProps {
  user: UserProfile;
  onOpenDeposit: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  lang?: 'en' | 'am';
}

const CATEGORIES = [
  'All',
  'Walking',
  'Sugar Reduction',
  'Weight Loss',
  'Diabetes',
  'Nutrition',
  'Exercise',
  'Metabolic Health',
  'Lifestyle'
];

export const ChallengesTab: React.FC<ChallengesTabProps> = ({ user, onOpenDeposit, onShowToast, lang = 'en' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'paid'>('all');

  const challenges = dataService.getActiveChallenges();

  const filteredChallenges = challenges.filter((c) => {
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchType =
      activeFilter === 'all' ||
      (activeFilter === 'free' && c.is_free) ||
      (activeFilter === 'paid' && !c.is_free);
    return matchCat && matchType;
  });

  const handleUnlockChallenge = (challenge: Challenge) => {
    triggerHaptic('medium');

    // Check if sufficient wallet
    if ((user.wallet_balance || 0) < challenge.price) {
      triggerHaptic('warning');
      onShowToast(
        'error',
        'Insufficient Balance',
        `You have ${user.wallet_balance || 0} ETB. This challenge costs ${challenge.price} ETB.`
      );
      return;
    }

    const result = dataService.purchaseContent(user.id, 'challenge', challenge.id);
    if (result.success) {
      triggerHaptic('success');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      onShowToast('success', 'Challenge Unlocked!', result.message);
    } else {
      triggerHaptic('warning');
      onShowToast('error', 'Could Not Unlock', result.message);
    }
  };

  const handleCompleteChallenge = (challenge: Challenge) => {
    triggerHaptic('medium');
    const result = dataService.completeDailyChallenge(user.id, challenge.id);
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
      onShowToast('info', 'Notice', result.message);
    }
  };

  return (
    <div id="user-challenges-tab" className="space-y-4 pb-24 animate-in fade-in">
      <header className="pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === 'am' ? 'የጤና ተግዳሮቶች' : 'Health Challenges'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Build daily metabolic discipline and earn stars
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl">
            <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">{user.stars} Stars</span>
          </div>
        </div>
      </header>

      {/* Filter Tabs: Free vs Paid */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        {(['all', 'free', 'paid'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => {
              triggerHaptic('light');
              setActiveFilter(filter);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
              activeFilter === filter
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Category Horizontal Scrolling Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              triggerHaptic('light');
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Challenges Card List */}
      <div className="space-y-3.5">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-6">
            <Flame className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No challenges found</h4>
            <p className="text-xs text-slate-400 mt-1">Try changing the category or filter above.</p>
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const isCompleted = dataService.isChallengeCompleted(user.id, challenge.id);
            const isUnlocked = challenge.is_free || dataService.isContentPurchased(user.id, 'challenge', challenge.id);

            return (
              <div
                key={challenge.id}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col transition-all hover:border-emerald-400"
              >
                <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={challenge.image_url}
                    alt={challenge.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-xs">
                      {challenge.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs ${
                        challenge.difficulty === 'Easy'
                          ? 'bg-emerald-600'
                          : challenge.difficulty === 'Medium'
                          ? 'bg-amber-600'
                          : 'bg-rose-600'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-xs ${
                        challenge.is_free
                          ? 'bg-emerald-500 text-white'
                          : isUnlocked
                          ? 'bg-indigo-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {challenge.is_free ? 'FREE' : isUnlocked ? 'UNLOCKED' : `${challenge.price} ETB`}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                    <div>
                      <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        +{challenge.stars_reward} Stars
                      </span>
                      <h3 className="text-base font-bold leading-tight drop-shadow-xs">{challenge.title}</h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-lg text-slate-200 shrink-0">
                      {challenge.duration}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {challenge.description}
                  </p>

                  {/* Actions depending on lock & completion state */}
                  {isCompleted ? (
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completed ✓</span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-600">+{challenge.stars_reward} Stars Awarded</span>
                    </div>
                  ) : !isUnlocked ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleUnlockChallenge(challenge)}
                        className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock for {challenge.price} ETB</span>
                      </button>
                      {(user.wallet_balance || 0) < challenge.price && (
                        <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Wallet: {user.wallet_balance || 0} ETB</span>
                          <button
                            onClick={onOpenDeposit}
                            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                          >
                            Deposit ETB →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCompleteChallenge(challenge)}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Complete & Earn +{challenge.stars_reward} Stars</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
