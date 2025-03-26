import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../constants/config';

export const supabase = createClient(
  'https://iovdemdtzmkykamgdgcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvdmRlbWR0em1reWthbWdkZ2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTU5NzAsImV4cCI6MjA1NDI3MTk3MH0.EYuFtAwaPA0pYndfCqEr3nV_-CwbbvYn5bp5KN_DnhQ',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
); 