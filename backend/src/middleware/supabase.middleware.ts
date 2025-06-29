import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function attachSupabase(req: Request, res: Response, next: NextFunction) {
  req.supabase = createClient(supabaseUrl, supabaseServiceKey);
  next();
}