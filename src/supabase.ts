import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://akpoqcqliqtxnmzadyvl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcG9xY3FsaXF0eG5temFkeXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDc4MDYsImV4cCI6MjA5NTcyMzgwNn0.UJw8nVJjQv4vFhf9BX6iSZRbmPT9pbLCP97YRxryYGQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
