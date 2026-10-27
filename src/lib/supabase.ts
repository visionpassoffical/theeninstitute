import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Checks whether valid Supabase environment variables have been supplied.
 * Strict check: must be present and not contain placeholder tokens.
 */
export const isSupabaseConfigured: boolean = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('placeholder.supabase.co') &&
  !rawKey.includes('placeholder-anon-key') &&
  rawUrl.startsWith('https://')
);

export const supabaseConfigError: string | null = isSupabaseConfigured
  ? null
  : 'Supabase integration credentials missing: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be configured in environment variables. Please supply valid credentials to enable live database connectivity.';

// Safe client instantiation: avoids throw during module import when env vars are missing
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? rawUrl : 'https://unconfigured-project.supabase.co',
  isSupabaseConfigured ? rawKey : 'unconfigured-anon-key',
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
    },
  }
);
