import React, { useState } from 'react';
import { Youtube, Search, Play, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { YouTubeVideo } from '../../types';
import { dataService } from '../../services/dataService';
import { triggerHaptic } from '../../utils/telegram';

interface YouTubeTabProps {
  lang?: 'en' | 'am';
}

const CATEGORIES = [
  'All',
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

const ITEMS_PER_PAGE = 6; // 6 for responsive 2-column mobile grid (or 10 max per requirement)

export const YouTubeTab: React.FC<YouTubeTabProps> = ({ lang = 'en' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const allVideos = dataService.getActiveYouTubeVideos();

  const filteredVideos = allVideos.filter((video) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query) ||
      video.tags.some((t) => t.toLowerCase().includes(query));
    const matchCat = selectedCategory === 'All' || video.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE) || 1;
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    triggerHaptic('light');
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="user-youtube-tab" className="space-y-4 pb-24 animate-in fade-in">
      <header className="pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === 'am' ? 'የዩቲዩብ ትምህርታዊ ቪዲዮዎች' : 'Health Video Lessons'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Free evidence-based masterclasses and doctor talks
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl">
            <Youtube className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-red-700 dark:text-red-300">100% Free</span>
          </div>
        </div>
      </header>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          id="youtube-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search videos, topics, tags (e.g. glucose, walking)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              triggerHaptic('light');
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2-Column Mobile/Tablet Video Grid */}
      {paginatedVideos.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-6">
          <Youtube className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No videos found</h4>
          <p className="text-xs text-slate-400 mt-1">Try another search keyword or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {paginatedVideos.map((video) => (
            <a
              key={video.id}
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col group hover:border-red-400 transition-all"
            >
              <div className="relative h-28 w-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                  YouTube
                </span>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide block truncate mb-1">
                    {video.category}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-normal">
                    {video.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate">Watch Video</span>
                  <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-xl text-xs font-semibold transition-colors ${
                currentPage === page
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
