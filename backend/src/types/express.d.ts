import { SupabaseClient } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        [key: string]: any;
      };
      supabase: SupabaseClient;
    }
  }
}

export {};