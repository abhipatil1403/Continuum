(function () {
	function getSB() {
		try {
			return window.getSupabase ? window.getSupabase() : null;
		} catch (e) {
			return null;
		}
	}

	async function listViews() {
		const sb = getSB();
		if (!sb) return { data: [], error: null };
		return await sb.rpc('list_available_views');
	}

	async function fetchViewRows(viewName, limit) {
		const sb = getSB();
		if (!sb) return { data: [], error: null };
		return await sb.from(viewName).select('*').limit(limit || 50);
	}

	function renderSelectOptions(selectEl, views) {
		if (!selectEl) return;
		const current = selectEl.value;
		selectEl.innerHTML = '<option value="">Choose a report...</option>';
		
		// User-friendly names for the views
		const viewDisplayNames = {
			'v_user_training_summary': '📊 My Exercise Progress',
			'view_set_combined': '💪 Overall Performance Summary',
			'v_exercises_with_equipment': '🏋️ Exercise Catalog',
			'v_recipe_nutrition': '🥗 Nutrition & Recipes'
		};
		
		views.forEach(v => {
			const viewName = v.view_name || v;
			const opt = document.createElement('option');
			opt.value = viewName;
			opt.textContent = viewDisplayNames[viewName] || viewName;
			selectEl.appendChild(opt);
		});
		if (current) selectEl.value = current;
	}

	function renderTable(rows) {
		const thead = document.getElementById('views-thead');
		const tbody = document.getElementById('views-tbody');
		const container = document.getElementById('views-table-container');
		if (!thead || !tbody || !container) return;

		thead.innerHTML = '';
		tbody.innerHTML = '';

		if (!rows || rows.length === 0) {
			container.style.display = 'none';
			return;
		}

		const columns = Object.keys(rows[0]);
		const trHead = document.createElement('tr');
		columns.forEach(col => {
			const th = document.createElement('th');
			th.textContent = col;
			trHead.appendChild(th);
		});
		thead.appendChild(trHead);

		rows.forEach(row => {
			const tr = document.createElement('tr');
			columns.forEach(col => {
				const td = document.createElement('td');
				const val = row[col];
				td.textContent = val === null || val === undefined ? '' : (typeof val === 'object' ? JSON.stringify(val) : String(val));
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});

		container.style.display = '';
		const countEl = document.getElementById('views-count');
		if (countEl) countEl.textContent = (rows?.length || 0) + ' results';
	}

	async function refreshViewsList() {
		const selectEl = document.getElementById('views-select');
		if (!selectEl) return;
		const { data, error } = await listViews();
		if (error) {
			console.error('Failed to list views', error);
			renderSelectOptions(selectEl, []);
			return;
		}
		
		// Only show the 4 most useful views for users
		const allowedViews = [
			'v_user_training_summary',      // Personal exercise progress tracking
			'view_set_combined',            // Overall performance overview
			'v_exercises_with_equipment',   // Exercise catalog with equipment
			'v_recipe_nutrition'            // Nutrition information
		];
		
		const filteredData = (data || []).filter(view => {
			const viewName = view.view_name || view;
			return allowedViews.includes(viewName);
		});
		
		renderSelectOptions(selectEl, filteredData);
	}

	async function renderSelectedView() {
		const selectEl = document.getElementById('views-select');
		const titleEl = document.getElementById('views-title');
		if (!selectEl) return;
		const viewName = selectEl.value;
		if (!viewName) {
			renderTable([]);
			if (titleEl) titleEl.textContent = 'View Results';
			return;
		}
		if (titleEl) titleEl.textContent = 'View: ' + viewName;
		const { data, error } = await fetchViewRows(viewName, 50);
		if (error) {
			console.error('Failed to fetch view rows', error);
			renderTable([]);
			return;
		}
		renderTable(data || []);
	}

	function clearViewResults() {
		renderTable([]);
		const titleEl = document.getElementById('views-title');
		if (titleEl) titleEl.textContent = 'View Results';
	}

	function initViewsUI() {
		refreshViewsList();
	}

	// Expose globals used in HTML handlers
	window.refreshViewsList = refreshViewsList;
	window.renderSelectedView = renderSelectedView;
	window.clearViewResults = clearViewResults;
	window.initViewsUI = initViewsUI;

	// Try to init when DOM is ready (safe no-op if elements aren't present)
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initViewsUI);
	} else {
		initViewsUI();
	}
})();








