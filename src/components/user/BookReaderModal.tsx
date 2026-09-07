import React, { useState } from 'react';
import { ArrowLeft, Download, ZoomIn, ZoomOut, BookOpen, Share2 } from 'lucide-react';
import { Book } from '../../types';
import { triggerHaptic } from '../../utils/telegram';

interface BookReaderModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({ book, isOpen, onClose }) => {
  const [zoom, setZoom] = useState<number>(100);

  if (!isOpen) return null;

  const handleDownload = () => {
    triggerHaptic('medium');
    const link = document.createElement('a');
    link.href = book.file_url || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
    link.download = `${book.title.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="book-reader-modal" className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white animate-in fade-in">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            id="reader-back-button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <div className="max-w-[200px] sm:max-w-md truncate">
            <h2 className="text-sm font-semibold text-white truncate">{book.title}</h2>
            <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="reader-zoom-out"
            onClick={() => setZoom((z) => Math.max(70, z - 15))}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 px-1 font-mono">{zoom}%</span>
          <button
            id="reader-zoom-in"
            onClick={() => setZoom((z) => Math.min(150, z + 15))}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="reader-download-button"
            onClick={handleDownload}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </header>

      {/* Document Reader Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-slate-950">
        <div
          className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 sm:p-12 transition-all space-y-6"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Header of Book Page */}
          <div className="border-b border-slate-200 pb-6 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tena Holistic Health Publication</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{book.title}</h1>
            <p className="text-sm font-medium text-slate-500">By {book.author}</p>
          </div>

          {/* Book Content / Document Sample Text */}
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 font-serif">
            <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-emerald-700 first-letter:float-left first-letter:mr-2">
              {book.description}
            </p>

            <h3 className="font-sans font-bold text-lg text-slate-900 pt-4">Chapter 1: The Foundations of Metabolic Balance</h3>
            <p>
              When we examine the physiology of cellular respiration and insulin dynamics, one consistent truth emerges: human biology was engineered for rhythm. From the timing of daylight entering the retina to the muscular uptake of glycogen during simple walking, small daily anchors produce compound systemic health.
            </p>
            <p>
              In our modern environment, ultra-processed ingredients, concentrated sugars, and prolonged sedentary periods bypass natural satiety checkpoints. By introducing structured daily micro-habits—such as post-meal movement and mineral hydration—we deactivate chronic inflammatory pathways.
            </p>

            <div className="my-6 p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 font-sans text-xs text-emerald-900">
              <span className="font-bold block mb-1">Clinical Practice Recommendation:</span>
              Target 15 minutes of gentle walking after your carbohydrate-containing meals. This stimulates GLUT4 transporters in muscle tissue directly, bypassing insulin resistance and blunting blood sugar spikes.
            </div>

            <h3 className="font-sans font-bold text-lg text-slate-900 pt-2">Chapter 2: Hormonal Harmony & Sustainable Longevity</h3>
            <p>
              Hormones are not enemies to be fought with extreme calorie restriction; they are messengers responding to environmental cues. Ghrelin, leptin, cortisol, and insulin operate in continuous feedback loops. Prioritize restful sleep and natural whole foods to let your body balance itself.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-sans">
            Page 1 of 24 • Tena Holistic Medical Library • Version 1.0
          </div>
        </div>
      </div>
    </div>
  );
};
