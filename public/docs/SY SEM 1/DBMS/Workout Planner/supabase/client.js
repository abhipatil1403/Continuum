// Minimal Supabase client wrapper (non-module)
// Expects window.SUPABASE_URL and window.SUPABASE_ANON_KEY
// Requires <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

// Define getSupabase function immediately to prevent "is not a function" errors
window.getSupabase = function() {
	if (!window.__sb) {
		console.warn('Supabase client not initialized. Check configuration and library loading.');
		// Try to initialize if config is available
		if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase && !window.__sb) {
			try {
				window.__sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
				console.log('Supabase client initialized on demand');
			} catch (e) {
				console.error('Failed to initialize Supabase client on demand:', e);
			}
		}
	}
	return window.__sb || null;
};

(function initSupabase() {
	function initializeClient() {
		try {
			// Check if Supabase library is loaded
			if (typeof window.supabase === 'undefined') {
				console.warn('Supabase library not loaded yet, retrying...');
				setTimeout(initializeClient, 100);
				return;
			}

			// Check if config is available
			if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
				console.error('Missing Supabase configuration (SUPABASE_URL or SUPABASE_ANON_KEY)');
				return;
			}

			console.log('Initializing Supabase client...');
			console.log('SUPABASE_URL:', window.SUPABASE_URL);
			console.log('SUPABASE_ANON_KEY:', window.SUPABASE_ANON_KEY ? 'Present' : 'Missing');
			
			// Create Supabase client
			window.__sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
			console.log('Supabase client initialized successfully');
		} catch (e) {
			console.error('Error initializing Supabase client:', e);
		}
	}

	// Try to initialize immediately, or wait for DOM/content to be ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initializeClient);
	} else {
		// DOM is already ready, but library might not be loaded yet
		initializeClient();
	}
})();
