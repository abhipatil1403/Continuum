// Supabase Configuration
window.SUPABASE_URL = 'https://brywevpyidvhezbhlmxp.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeXdldnB5aWR2aGV6YmhsbXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5ODU1MTgsImV4cCI6MjA3NTU2MTUxOH0.tzoRfdb2NVXMnoVWhd-Fh7MtCRA6P0AeBNoCvRMNHSc';

// Initialize Supabase client
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Hardcoded admin credentials (for demo only - in production, use proper authentication)
window.ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin'
};