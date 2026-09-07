import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Check, X, Eye, FileText, Upload } from 'lucide-react';
import { Book } from '../../types';
import { dataService } from '../../services/dataService';

interface AdminBooksTabProps {
  adminEmail: string;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const CATEGORIES = [
  'Sugar Reduction',
  'Weight Management',
  'Walking & Movement',
  'Diabetes Management',
  'Metabolic Health',
  'Lifestyle & Sleep'
];

export const AdminBooksTab: React.FC<AdminBooksTabProps> = ({ adminEmail, onShowToast }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('Dr. Aster Mengesha');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isFree, setIsFree] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(100);
  const [isActive, setIsActive] = useState<boolean>(true);

  const books = dataService.getBooks();

  const handleOpenCreate = () => {
    setEditingBookId(null);
    setTitle('');
    setAuthor('Dr. Aster Mengesha');
    setCategory(CATEGORIES[0]);
    setDescription('');
    setCoverUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80');
    setFileUrl('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf');
    setIsFree(false);
    setPrice(100);
    setIsActive(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (b: Book) => {
    setEditingBookId(b.id);
    setTitle(b.title);
    setAuthor(b.author);
    setCategory(b.category);
    setDescription(b.description);
    setCoverUrl(b.cover_url);
    setFileUrl(b.file_url || '');
    setIsFree(b.is_free);
    setPrice(b.price);
    setIsActive(b.is_active);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('error', 'Validation Error', 'Book title is required.');
      return;
    }

    const payload: Partial<Book> = {
      title,
      author,
      category,
      description,
      cover_url: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      file_url: fileUrl || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
      is_free: isFree,
      price: isFree ? 0 : Number(price),
      is_active: isActive
    };

    if (editingBookId) {
      dataService.updateBook(editingBookId, payload, adminEmail);
      onShowToast('success', 'Book Updated', `"${title}" has been successfully updated.`);
    } else {
      dataService.createBook(payload as Omit<Book, 'id' | 'created_at'>, adminEmail);
      onShowToast('success', 'Book Published', `"${title}" is now available in the library.`);
    }

    setIsEditing(false);
  };

  const handleTogglePublish = (b: Book) => {
    dataService.updateBook(b.id, { is_active: !b.is_active }, adminEmail);
    onShowToast(
      'info',
      !b.is_active ? 'Book Published' : 'Book Unpublished',
      `"${b.title}" visibility changed.`
    );
  };

  return (
    <div id="admin-books-tab" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Medical Books & Publications</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish, edit, price, and distribute clinical nutrition and lifestyle PDF guides
          </p>
        </div>

        <button
          id="admin-add-book-btn"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Books List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex gap-3">
                <img
                  src={b.cover_url}
                  alt={b.title}
                  className="w-16 h-22 object-cover rounded-xl shrink-0 shadow-xs border border-slate-100 dark:border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                      {b.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        b.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {b.is_active ? 'LIVE' : 'DRAFT'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">By {b.author}</p>
                  <span className="font-mono font-bold text-xs text-amber-600 block mt-1">
                    {b.is_free ? 'FREE' : `${b.price} ETB`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {b.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(b)}
                className={`text-xs font-semibold px-3 py-1 rounded-xl transition-colors ${
                  b.is_active
                    ? 'text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-700'
                    : 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60'
                }`}
              >
                {b.is_active ? 'Unpublish' : 'Publish'}
              </button>

              <button
                onClick={() => handleOpenEdit(b)}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 px-3 py-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-750 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingBookId ? 'Edit Medical Book' : 'Publish New Medical Book'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Science of Sugar Freedom"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

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
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Clinical insights, protocols covered, and key takeaways..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">PDF File URL</label>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://.../book.pdf"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="book-is-free"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="book-is-free" className="font-bold text-slate-700 dark:text-slate-300">
                    Free for All Users
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
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-mono text-slate-900 dark:text-white"
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
                  {editingBookId ? 'Save Changes' : 'Publish Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
