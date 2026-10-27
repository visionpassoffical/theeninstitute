import React, { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { AlertTriangle, X } from 'lucide-react';

export const SupabaseConfigBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (isSupabaseConfigured || dismissed) return null;

  return (
    <aside
      role="alert"
      aria-label="Database Configuration Notice"
      className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs flex items-center justify-between gap-3 z-50 sticky top-0 backdrop-blur-xs"
    >
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="font-medium text-start">
          <strong>Supabase Configuration Notice:</strong> Environment variables (<code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>) are not configured. Live database transactions, authentication, and application forms require valid Supabase project credentials.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 text-amber-700 dark:text-amber-300 hover:opacity-75 cursor-pointer shrink-0"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
