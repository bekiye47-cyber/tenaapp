import React, { useState } from 'react';
import { Flame, Plus, Edit2, Check, X, Sparkles, Clock, Lock } from 'lucide-react';
import { Challenge } from '../../types';
import { dataService } from '../../services/dataService';

interface AdminChallengesTabProps {
  adminEmail: string;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const CATEGORIES = [
  'Walking',
  'Sugar Reduction',
  'Weight Loss',
  'Diabetes',
  'Nutrition',
  'Exercise',
  'Metabolic Health',
  'Lifestyle'
];

export const AdminChallengesTab: React.FC<AdminChallengesTabProps> = ({ adminEmail, onShowToast }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [duration, setDuration] = useState<string>('15 Mins');
  const [starsReward, setStarsReward] = useState<number>(10);
  const [isFree, setIsFree] = useState<boolean>(true);
  const [price, setPrice] = useState<number>(0);
  const [isDaily, setIsDaily] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  const challenges = dataService.getChallenges();

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setCategory(CATEGORIES[0]);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80');
    setDifficulty('Easy');
    setDuration('15 Mins');
    setStarsReward(10);
    setIsFree(true);
    setPrice(0);
    setIsDaily(false);
    setIsActive(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (c: Challenge) => {
    setEditingId(c.id);
    setTitle(c.title);
    setCategory(c.category);
    setDescription(c.description);
    setImageUrl(c.image_url);
    setDifficulty(c.difficulty);
    setDuration(c.duration);
    setStarsReward(c.stars_reward);
    setIsFree(c.is_free);
    setPrice(c.price);
    setIsDaily(c.is_daily);
    setIsActive(c.is_active);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('error', 'Validation Error', 'Challenge title is required.');
      return;
    }

    const payload: Partial<Challenge> = {
      title,
      category,
      description,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      difficulty,
      duration,
      stars_reward: Number(starsReward),
      is_free: isFree,
      price: isFree ? 0 : Number(price),
      is_daily: isDaily,
      is_active: isActive
    };

    if (editingId) {
      dataService.updateChallenge(editingId, payload, adminEmail);
      onShowToast('success', 'Challenge Updated', `"${title}" has been updated.`);
    } else {
      dataService.createChallenge(payload as Omit<Challenge, 'id' | 'created_at'>, adminEmail);
      onShowToast('success', 'Challenge Created', `"${title}" is now published.`);
    }

    setIsEditing(false);
  };

  const handleTogglePublish = (c: Challenge) => {
    dataService.updateChallenge(c.id, { is_active: !c.is_active }, adminEmail);
    onShowToast(
      'info',
      !c.is_active ? 'Challenge Published' : 'Challenge Unpublished',
      `"${c.title}" status changed.`
    );
  };

  const handleSetDaily = (c: Challenge) => {
    dataService.updateChallenge(c.id, { is_daily: true, is_active: true }, adminEmail);
    onShowToast('success', 'Daily Challenge Set', `"${c.title}" is now featured as the Daily Challenge on the user Home tab!`);
  };

  return (
    <div id="admin-challenges-tab" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Habit & Exercise Challenges</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create daily active movement routines, metabolic challenges, and paid masterclasses
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Challenge</span>
        </button>
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-full text-[10px] font-bold">
                    {c.category}
                  </span>
                  {c.is_daily && (
                    <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-extrabold shadow-xs">
                      ⭐ DAILY FEATURED
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white rounded text-[10px] font-mono">
                  {c.duration}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    +{c.stars_reward} Stars
                  </span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {c.is_free ? 'FREE' : `${c.price} ETB`}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{c.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{c.description}</p>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 mt-2">
              {!c.is_daily ? (
                <button
                  onClick={() => handleSetDaily(c)}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-700"
                >
                  Set as Daily
                </button>
              ) : (
                <span className="text-[11px] font-bold text-emerald-600">Active Daily</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublish(c)}
                  className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
                >
                  {c.is_active ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Challenge Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingId ? 'Edit Challenge' : 'Create New Health Challenge'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Challenge Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 15-Minute Post-Dinner Glucose Walk"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 15 Mins, 7 Days"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Stars Reward</label>
                  <input
                    type="number"
                    min={1}
                    value={starsReward}
                    onChange={(e) => setStarsReward(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructions & Guidance</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe exact protocol steps..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="challenge-is-free"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="challenge-is-free" className="font-bold text-slate-700 dark:text-slate-300">
                    Free Challenge
                  </label>
                </div>

                {!isFree && (
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Price (ETB)</label>
                    <input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Publish Challenge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
