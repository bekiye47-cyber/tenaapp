import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onClose, onDismiss }) => {
  if (toasts.length === 0) return null;

  const dismiss = (id: string) => {
    if (onClose) onClose(id);
    if (onDismiss) onDismiss(id);
  };

  return (
    <div id="toast-container" className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : toast.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-indigo-50 text-indigo-900 border-indigo-200'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-600" />}
          </div>
          <div className="flex-1">
            <div className="font-semibold">{toast.title}</div>
            {toast.message && <div className="text-xs mt-0.5 opacity-90">{toast.message}</div>}
          </div>
          <button
            id={`dismiss-toast-${toast.id}`}
            onClick={() => dismiss(toast.id)}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const Toast = ToastContainer;
