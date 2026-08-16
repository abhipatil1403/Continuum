// Signup Logs Renderer
// Renders recent signup logs from database into an element with id 'signup-logs'
(function () {
	function getSupabaseClient() {
		try {
			return window.getSupabase ? window.getSupabase() : null;
		} catch (e) {
			return null;
		}
	}

	async function fetchSignupLogs(limit) {
		const supabase = getSupabaseClient();
		if (!supabase) return { data: [], error: null };
		return await supabase.rpc('fetch_signup_logs', { p_limit: limit || 10 });
	}

	function formatDate(dt) {
		try {
			return new Date(dt).toLocaleString();
		} catch (e) {
			return dt;
		}
	}

	function renderLogs(container, logs) {
		if (!container) return;
		if (!logs || logs.length === 0) {
			container.innerHTML = '<div class="log-empty">No signup logs yet.</div>';
			return;
		}

		const rows = logs.map(l => {
			const statusClass = l.status === 'success' ? 'log-status-success' : 'log-status-other';
			return (
				'<div class="log-row">' +
					'<div class="log-time">' + formatDate(l.event_time) + '</div>' +
					'<div class="log-email">' + (l.email || '') + '</div>' +
					'<div class="log-status ' + statusClass + '">' + l.status + '</div>' +
					'<div class="log-message">' + (l.message || '') + '</div>' +
				'</div>'
			);
		}).join('');

		container.innerHTML = (
			'<div class="log-header">' +
				'<div class="log-time">Time</div>' +
				'<div class="log-email">Email</div>' +
				'<div class="log-status">Status</div>' +
				'<div class="log-message">Message</div>' +
			'</div>' + rows
		);
	}

	async function refresh() {
		const container = document.getElementById('signup-logs');
		if (!container) return;
		container.innerHTML = '<div class="log-loading">Loading signup logs...</div>';
		const { data, error } = await fetchSignupLogs(10);
		if (error) {
			container.innerHTML = '<div class="log-error">Failed to load logs</div>';
			return;
		}
		renderLogs(container, data);
	}

	// Expose manual refresh
	window.refreshSignupLogs = refresh;

	// Auto-render on page load
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', refresh);
	} else {
		refresh();
	}
})();






