import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mwgsaryqhpjjpflvhymj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Z3NhcnlxaHBqanBmbHZoeW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNDQ2MDQsImV4cCI6MjA1ODcyMDYwNH0.-f4pA5emvGhWw8EV0-m2XbqI4SY2lGJFwhNOl4czdv4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);