import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 pl-4 pr-3 py-3.5 rounded-xl shadow-2xl border
        animate-[slideIn_0.25s_ease-out] max-w-sm
        ${type === 'success'
          ? 'bg-navy-900/95 border-success/30 text-success'
          : 'bg-navy-900/95 border-danger/30 text-danger'}`}
    >
      {type === 'success'
        ? <CheckCircle className="w-5 h-5 shrink-0" />
        : <XCircle className="w-5 h-5 shrink-0" />}
      <span className="text-sm font-medium text-slate-200 flex-1">{message}</span>
      <button onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-150"
        aria-label="Dismiss notification">
        <X className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
}
