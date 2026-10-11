import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const rawUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim();
const url = rawUrl.replace(/\/rest\/v1\/?$/, '');
const anonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

export const supabase = url && anonKey
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        storage: AsyncStorage,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const hasSupabaseConnection = Boolean(supabase);
