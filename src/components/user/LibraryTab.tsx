import React, { useState } from 'react';
import { BookOpen, Search, Lock, Download, Eye, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Book } from '../../types';
import { dataService } from '../../services/dataService';
import { triggerHaptic } from '../../utils/telegram';

interface LibraryTabProps {
  user: UserProfile;
  onOpenBookReader: (book: Book) => void;
  onOpenDeposit: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  lang?: 'en' | 'am';
}

const CATEGORIES = [
  'All',
  'Sugar Reduction',
  'Weight Management',
  'Walking & Movement',
  'Diabetes Management',
  'Metabolic Health',
  'Lifestyle & Sleep'
];

export const LibraryTab: React.FC<LibraryTabProps> = ({
  user,
  onOpenBookReader,
  onOpenDeposit,
  onShowToast,
  lang = 'en'
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');

  const books = dataService.getActiveBooks();

  const filteredBooks = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || book.category === selectedCategory;
    const matchType =
      filterType === 'all' ||
      (filterType === 'free' && book.is_free) ||
      (filterType === 'paid' && !book.is_free);
    return matchSearch && matchCat && matchType;
  });

  const handleUnlockBook = (book: Book) => {
    triggerHaptic('medium');

    if ((user.wallet_balance || 0) < book.price) {
      triggerHaptic('warning');
      onShowToast(
        'error',
        'Insufficient Balance',
        `You have ${user.wallet_balance || 0} ETB. "${book.title}" costs ${book.price} ETB.`
      );
      return;
    }

    const result = dataService.purchaseContent(user.id, 'book', book.id);
    if (result.success) {
      triggerHaptic('success');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      onShowToast('success', 'Book Unlocked!', result.message);
    } else {
      triggerHaptic('warning');
      onShowToast('error', 'Purchase Failed', result.message);
    }
  };

  const handleDirectDownload = (book: Book) => {
    triggerHaptic('light');
    const link = document.createElement('a');
    link.href = book.file_url || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
    link.download = `${book.title.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="user-library-tab" className="space-y-4 pb-24 animate-in fade-in">
      <header className="pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === 'am' ? 'የህክምና መጽሐፍት' : 'Medical Library'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evidence-based lifestyle, nutrition, and metabolic protocols
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{books.length} Books</span>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          id="library-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search book titles, authors, topics..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Filter Tabs: Free vs Paid */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        {(['all', 'free', 'paid'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => {
              triggerHaptic('light');
              setFilterType(filter);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
              filterType === filter
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

      {/* Books List / Grid */}
      <div className="space-y-3.5">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-6">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No books found</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          filteredBooks.map((book) => {
            const isUnlocked = book.is_free || dataService.isContentPurchased(user.id, 'book', book.id);

            return (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row gap-4 transition-all hover:border-emerald-400"
              >
                <div className="flex gap-3.5 items-start">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-2xl shrink-0 shadow-sm border border-slate-100 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        {book.category}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          book.is_free
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                            : isUnlocked
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {book.is_free ? 'FREE' : isUnlocked ? 'UNLOCKED' : `${book.price} ETB`}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      By {book.author}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>

                {/* Actions: Read & Download or Unlock */}
                <div className="pt-2 sm:pt-0 sm:border-t-0 border-t border-slate-100 dark:border-slate-700 flex sm:flex-col items-center justify-end gap-2 shrink-0">
                  {isUnlocked ? (
                    <>
                      <button
                        onClick={() => {
                          triggerHaptic('light');
                          onOpenBookReader(book);
                        }}
                        className="flex-1 sm:w-28 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>READ</span>
                      </button>
                      <button
                        onClick={() => handleDirectDownload(book)}
                        className="flex-1 sm:w-28 py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>DOWNLOAD</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full sm:w-32 space-y-1.5">
                      <button
                        onClick={() => handleUnlockBook(book)}
                        className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock {book.price} ETB</span>
                      </button>
                      {(user.wallet_balance || 0) < book.price && (
                        <button
                          onClick={onOpenDeposit}
                          className="w-full text-center text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline block"
                        >
                          Deposit ETB →
                        </button>
                      )}
                    </div>
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
