import React, { useState } from 'react';
import { Youtube, Plus, Edit2, Play, Check, X, ExternalLink } from 'lucide-react';
import { YouTubeVideo } from '../../types';
import { dataService } from '../../services/dataService';

interface AdminYouTubeTabProps {
  adminEmail: string;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const CATEGORIES = [
  'Diabetes',
  'Weight Loss',
  'Sugar',
  'Walking',
  'Exercise',
  'Nutrition',
  'Cancer Awareness',
  'Metabolic Health',
  'Lifestyle',
  'Doctor Talk'
];

export const AdminYouTubeTab: React.FC<AdminYouTubeTabProps> = ({ adminEmail, onShowToast }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState<string>('');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  const videos = dataService.getYouTubeVideos();

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setYoutubeUrl('');
    setThumbnailUrl('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setTagsInput('health, nutrition, prevention');
    setIsActive(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (v: YouTubeVideo) => {
    setEditingId(v.id);
    setTitle(v.title);
    setYoutubeUrl(v.youtube_url);
    setThumbnailUrl(v.thumbnail_url);
    setDescription(v.description);
    setCategory(v.category);
    setTagsInput(v.tags.join(', '));
    setIsActive(v.is_active);
    setIsEditing(true);
  };

  // Helper to extract YouTube video thumbnail automatically if empty
  const handleUrlBlur = () => {
    if (youtubeUrl && !thumbnailUrl) {
      const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        setThumbnailUrl(`https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !youtubeUrl.trim()) {
      onShowToast('error', 'Validation Error', 'Title and YouTube URL are required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: Partial<YouTubeVideo> = {
      title,
      youtube_url: youtubeUrl,
      thumbnail_url: thumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=80',
      description,
      category,
      tags,
      is_active: isActive
    };

    if (editingId) {
      dataService.updateYouTubeVideo(editingId, payload, adminEmail);
      onShowToast('success', 'Video Updated', `"${title}" has been updated.`);
    } else {
      dataService.createYouTubeVideo(payload as Omit<YouTubeVideo, 'id' | 'created_at'>, adminEmail);
      onShowToast('success', 'Video Published', `"${title}" has been published.`);
    }

    setIsEditing(false);
  };

  const handleTogglePublish = (v: YouTubeVideo) => {
    dataService.updateYouTubeVideo(v.id, { is_active: !v.is_active }, adminEmail);
    onShowToast(
      'info',
      !v.is_active ? 'Video Published' : 'Video Unpublished',
      `"${v.title}" visibility changed.`
    );
  };

  return (
    <div id="admin-youtube-tab" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">YouTube Health Masterclasses</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish free educational video resources that stream on YouTube
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video</span>
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v) => (
          <div
            key={v.id}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/70 text-white rounded-full text-[10px] font-bold">
                  {v.category}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-mono">
                  YouTube
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">{v.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{v.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {v.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 mt-2">
              <button
                onClick={() => handleTogglePublish(v)}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
              >
                {v.is_active ? 'Unpublish' : 'Publish'}
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={v.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-600 p-1"
                  title="Open Link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => handleOpenEdit(v)}
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

      {/* Video Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingId ? 'Edit YouTube Lesson' : 'Add New YouTube Video'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Reverse Insulin Resistance: The 3 Food Order Rules"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">YouTube URL *</label>
                <input
                  type="url"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
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
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Auto-extracted or custom URL"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of health findings discussed in the lecture..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="glucose, walking, diabetes, metabolism"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
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
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Publish Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
