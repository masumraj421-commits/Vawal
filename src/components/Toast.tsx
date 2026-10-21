import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#14422D] text-white px-4 py-3 rounded-lg shadow-xl border border-emerald-900/40 flex items-center gap-3 transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <p className="text-sm font-medium leading-snug">{toast}</p>
    </div>
  );
};
