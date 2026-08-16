// Tab functionality
function openTab(evt, tabName) {
    // Hide all tab content
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    // Remove active class from all tab buttons
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    // Show the current tab and add active class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Login function
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    
    // Simple client-side validation
    if (!username || !password) {
        errorMsg.textContent = 'Please enter both username and password';
        return;
    }
    
    // Check credentials (in a real app, this would be done server-side)
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Store login state in session storage
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        await loadDashboard();
    } else {
        errorMsg.textContent = 'Invalid username or password';
    }
}

// Logout function
function logout() {
    // Clear login state from session storage
    sessionStorage.removeItem('adminLoggedIn');
    
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('error-msg').textContent = '';
}

// Load dashboard data
async function loadDashboard() {
    try {
        await Promise.all([
            loadDashboardStats(),
            loadOverview(),
            loadEquipmentStats(),
            loadUsers(),
            loadTrainingRecords(),
            loadAnalytics()
        ]);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('Error loading dashboard data. Check console for details.');
    }
}

// Load dashboard statistics (top cards)
async function loadDashboardStats() {
    try {
        // Get total users
        const { count: userCount, error: userError } = await supabase
            .from('user_profile')
            .select('*', { count: 'exact', head: true });
        
        if (userError) throw userError;
        document.getElementById('total-users').textContent = userCount || 0;

        // Get total workouts
        const { count: workoutCount, error: workoutError } = await supabase
            .from('training_records')
            .select('*', { count: 'exact', head: true });
        
        if (workoutError) throw workoutError;
        document.getElementById('total-workouts').textContent = workoutCount || 0;

        // Get total equipment
        const { count: equipmentCount, error: equipmentError } = await supabase
            .from('available_equipments')
            .select('*', { count: 'exact', head: true });
        
        if (equipmentError) throw equipmentError;
        document.getElementById('total-equipment').textContent = equipmentCount || 0;

        // Get total exercises
        const { count: exerciseCount, error: exerciseError } = await supabase
            .from('exercises')
            .select('*', { count: 'exact', head: true });
        
        if (exerciseError) throw exerciseError;
        document.getElementById('total-exercises').textContent = exerciseCount || 0;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load overview tab
async function loadOverview() {
    await Promise.all([
        loadPopularEquipmentChart(),
        loadMuscleGroupsChart(),
        loadRecentActivity()
    ]);
}

// Load popular equipment chart (uses HAVING clause behind the scenes)
async function loadPopularEquipmentChart() {
    const container = document.getElementById('popular-equipment-chart');
    container.innerHTML = 'Loading...';
    
    try {
        const { data, error } = await supabase
            .from('popular_equipment')
            .select('*')
            .limit(5);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No data available</p>';
            return;
        }

        let html = `
            <div class="chart-list">
        `;
        
        data.forEach((item, index) => {
            const percentage = index === 0 ? 100 : Math.floor((item.usage_count / data[0].usage_count) * 100);
            html += `
                <div class="chart-item">
                    <div class="chart-label">
                        <span class="rank">#${index + 1}</span>
                        <span class="name">${escapeHtml(item.equipment_name)}</span>
                    </div>
                    <div class="chart-bar-container">
                        <div class="chart-bar" style="width: ${percentage}%"></div>
                        <span class="chart-value">${item.usage_count} uses</span>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading popular equipment:', error);
        container.innerHTML = '<p style="color: var(--danger-color);">Error loading data</p>';
    }
}

// Load muscle groups chart
async function loadMuscleGroupsChart() {
    const container = document.getElementById('muscle-groups-chart');
    container.innerHTML = 'Loading...';
    
    try {
        const { data, error } = await supabase
            .from('view_set_muscle_group_stats')
            .select('*')
            .limit(5);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No data available</p>';
            return;
        }

        let html = `<div class="chart-list">`;
        
        data.forEach((item, index) => {
            const percentage = index === 0 ? 100 : Math.floor((item.total_workouts / data[0].total_workouts) * 100);
            html += `
                <div class="chart-item">
                    <div class="chart-label">
                        <span class="rank">#${index + 1}</span>
                        <span class="name">${escapeHtml(item.muscle_group)}</span>
                    </div>
                    <div class="chart-bar-container">
                        <div class="chart-bar" style="width: ${percentage}%"></div>
                        <span class="chart-value">${item.total_workouts} workouts</span>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading muscle groups:', error);
        container.innerHTML = '<p style="color: var(--danger-color);">Error loading data</p>';
    }
}

// Load recent activity
async function loadRecentActivity() {
    const container = document.getElementById('recent-activity');
    container.innerHTML = 'Loading...';
    
    try {
        const { data: trainingData, error: trainingError } = await supabase
            .from('training_records')
            .select(`
                record_id,
                date,
                sets,
                reps,
                exercise_id,
                user_id
            `)
            .order('date', { ascending: false })
            .limit(5);
        
        if (trainingError) throw trainingError;
        
        if (!trainingData || trainingData.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No recent activity</p>';
            return;
        }

        const { data: exercisesData, error: exercisesError } = await supabase
            .from('exercises')
            .select('exercise_id, exercise_name');
        
        if (exercisesError) throw exercisesError;

        const exercisesMap = {};
        exercisesData.forEach(ex => {
            exercisesMap[ex.exercise_id] = ex.exercise_name;
        });

        const { data: usersData, error: usersError } = await supabase
            .from('user_profile')
            .select('user_id, name');
        
        if (usersError) throw usersError;

        const usersMap = {};
        usersData.forEach(user => {
            usersMap[user.user_id] = user.name;
        });

        let html = `
            <div class="activity-list">
        `;
        
        trainingData.forEach(record => {
            const recordDate = new Date(record.date);
            const exercise = exercisesMap[record.exercise_id] || 'Unknown';
            const user = usersMap[record.user_id] || 'Unknown';
            
            html += `
                <div class="activity-item">
                    <div class="activity-icon">💪</div>
                    <div class="activity-content">
                        <p class="activity-text"><strong>${escapeHtml(user)}</strong> completed <strong>${escapeHtml(exercise)}</strong></p>
                        <p class="activity-meta">${record.sets} sets × ${record.reps} reps • ${recordDate.toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading recent activity:', error);
        container.innerHTML = '<p style="color: var(--danger-color);">Error loading activity</p>';
    }
}

// Load equipment analytics (uses HAVING clause in SQL view)
async function loadEquipmentStats() {
    const container = document.getElementById('equipment-stats');
    container.innerHTML = 'Loading...';
    
    try {
        const { data, error } = await supabase
            .from('popular_equipment')
            .select('*');
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = 'No equipment usage data available.';
            return;
        }

        let html = `
            <div class="analytics-summary">
                <div class="summary-card">
                    <h4>Total Equipment Types</h4>
                    <p class="summary-value">${data.length}</p>
                </div>
                <div class="summary-card">
                    <h4>Most Popular</h4>
                    <p class="summary-value">${escapeHtml(data[0].equipment_name)}</p>
                </div>
                <div class="summary-card">
                    <h4>Total Uses</h4>
                    <p class="summary-value">${data.reduce((sum, item) => sum + item.usage_count, 0)}</p>
                </div>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Equipment</th>
                            <th>Usage Count</th>
                            <th>Popularity</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        const maxUsage = data[0].usage_count;
        data.forEach((item, index) => {
            const percentage = Math.floor((item.usage_count / maxUsage) * 100);
            html += `
                <tr>
                    <td><span class="rank-badge">#${index + 1}</span></td>
                    <td>${escapeHtml(item.equipment_name)}</td>
                    <td>${item.usage_count}</td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading equipment stats:', error);
        container.innerHTML = 'Error loading equipment statistics.';
    }
}

// Load users (uses ORDER BY in query)
async function loadUsers() {
    const container = document.getElementById('users-list');
    container.innerHTML = 'Loading...';
    
    try {
        const { data, error } = await supabase
            .from('user_profile')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = 'No users found.';
            return;
        }

        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        data.forEach(user => {
            const joinDate = new Date(user.created_at);
            const role = user.email === 'admin@example.com' ? 'Admin' : 'User';
            html += `
                <tr>
                    <td>${escapeHtml(user.name || 'N/A')}</td>
                    <td>${escapeHtml(user.email)}</td>
                    <td><span class="badge">${role}</span></td>
                    <td>${joinDate.toLocaleDateString()}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading users:', error);
        container.innerHTML = 'Error loading user data.';
    }
}

// Load training records (uses JOIN operations)
async function loadTrainingRecords() {
    const container = document.getElementById('training-records');
    container.innerHTML = 'Loading...';
    
    try {
        // First get all training records
        const { data: trainingData, error: trainingError } = await supabase
            .from('training_records')
            .select(`
                record_id,
                date,
                sets,
                reps,
                weight_used,
                duration_minutes,
                notes,
                exercise_id,
                user_id
            `)
            .order('date', { ascending: false });
        
        if (trainingError) throw trainingError;
        
        if (!trainingData || trainingData.length === 0) {
            container.innerHTML = 'No training records found.';
            return;
        }

        // Get all exercises with their equipment
        const { data: exercisesData, error: exercisesError } = await supabase
            .from('exercises')
            .select(`
                exercise_id,
                exercise_name,
                available_equipments(equipment_name)
            `);
        
        if (exercisesError) throw exercisesError;

        // Create a map for quick exercise lookup
        const exercisesMap = {};
        exercisesData.forEach(ex => {
            exercisesMap[ex.exercise_id] = {
                name: ex.exercise_name,
                equipment: ex.available_equipments?.equipment_name || 'N/A'
            };
        });

        // Get all users
        const { data: usersData, error: usersError } = await supabase
            .from('user_profile')
            .select('user_id, name, email');
        
        if (usersError) throw usersError;

        // Create a map for quick user lookup
        const usersMap = {};
        usersData.forEach(user => {
            usersMap[user.user_id] = user;
        });

        // Now build the HTML
        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>User</th>
                            <th>Exercise</th>
                            <th>Equipment</th>
                            <th>Sets x Reps</th>
                            <th>Weight (kg)</th>
                            <th>Duration (min)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        trainingData.forEach(record => {
            const recordDate = new Date(record.date);
            const exercise = exercisesMap[record.exercise_id] || { name: 'N/A', equipment: 'N/A' };
            const user = usersMap[record.user_id] || { name: 'N/A' };
            
            html += `
                <tr>
                    <td>${recordDate.toLocaleDateString()}</td>
                    <td>${escapeHtml(user.name)}</td>
                    <td>${escapeHtml(exercise.name)}</td>
                    <td>${escapeHtml(exercise.equipment)}</td>
                    <td>${record.sets} x ${record.reps}</td>
                    <td>${record.weight_used || '-'}</td>
                    <td>${record.duration_minutes || '-'}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading training records:', error);
        container.innerHTML = 'Error loading training records.';
    }
}

// Load performance analytics (uses aggregate functions: COUNT, SUM, AVG, MAX, MIN)
async function loadAnalytics() {
    const container = document.getElementById('analytics-content');
    container.innerHTML = 'Loading...';
    
    try {
        // Fetch data from SQL views demonstrating set functions
        const { data: countData, error: countError } = await supabase
            .from('view_set_count')
            .select('*');
        
        if (countError) throw countError;

        const { data: sumData, error: sumError } = await supabase
            .from('view_set_sum')
            .select('*');
        
        if (sumError) throw sumError;

        const { data: avgData, error: avgError } = await supabase
            .from('view_set_avg')
            .select('*');
        
        if (avgError) throw avgError;

        const { data: maxMinData, error: maxMinError } = await supabase
            .from('view_set_max_min')
            .select('*');
        
        if (maxMinError) throw maxMinError;

        const { data: combinedData, error: combinedError } = await supabase
            .from('view_set_combined')
            .select('*');
        
        if (combinedError) throw combinedError;

        let html = `
            <h3>Performance Analytics Dashboard</h3>
            <p class="section-description">Comprehensive workout statistics and user performance metrics</p>
            
            <div style="margin: 20px 0;">
                <h4>User Workout Statistics</h4>
                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Total Workouts</th>
                            <th>Unique Exercises</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        countData.forEach(row => {
            html += `
                <tr>
                    <td>${escapeHtml(row.user_name)}</td>
                    <td>${row.total_workouts}</td>
                    <td>${row.unique_exercises}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>

            <div style="margin: 20px 0;">
                <h4>Training Volume Summary</h4>
                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Total Sets</th>
                            <th>Total Reps</th>
                            <th>Total Duration (min)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        sumData.forEach(row => {
            html += `
                <tr>
                    <td>${escapeHtml(row.user_name)}</td>
                    <td>${row.total_sets || 0}</td>
                    <td>${row.total_reps || 0}</td>
                    <td>${row.total_duration_minutes || 0}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>

            <div style="margin: 20px 0;">
                <h4>Exercise Performance Averages</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Exercise</th>
                            <th>Muscle Group</th>
                            <th>Avg Sets</th>
                            <th>Avg Reps</th>
                            <th>Avg Weight (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        avgData.slice(0, 5).forEach(row => {
            html += `
                <tr>
                    <td>${escapeHtml(row.exercise_name)}</td>
                    <td>${escapeHtml(row.muscle_group)}</td>
                    <td>${row.avg_sets}</td>
                    <td>${row.avg_reps}</td>
                    <td>${row.avg_weight || '-'}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>

            <div style="margin: 20px 0;">
                <h4>Performance Range Analysis</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Exercise</th>
                            <th>Min Weight (kg)</th>
                            <th>Max Weight (kg)</th>
                            <th>Min Sets</th>
                            <th>Max Sets</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        maxMinData.slice(0, 5).forEach(row => {
            html += `
                <tr>
                    <td>${escapeHtml(row.exercise_name)}</td>
                    <td>${row.min_weight || '-'}</td>
                    <td>${row.max_weight || '-'}</td>
                    <td>${row.min_sets}</td>
                    <td>${row.max_sets}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>

            <div style="margin: 20px 0;">
                <h4>Advanced User Metrics</h4>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Workouts</th>
                            <th>Total Volume</th>
                            <th>Avg Weight</th>
                            <th>Max Weight</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        combinedData.slice(0, 5).forEach(row => {
            html += `
                <tr>
                    <td>${escapeHtml(row.user_name)}</td>
                    <td>${row.workout_count}</td>
                    <td>${row.total_volume || 0}</td>
                    <td>${row.avg_weight || '-'} kg</td>
                    <td>${row.max_weight || '-'} kg</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading set functions:', error);
        container.innerHTML = 'Error loading set functions data.';
    }
}

// Load database insights (demonstrates normalization, decomposition, and referential integrity)
async function loadDatabaseInsights() {
    const container = document.getElementById('database-content');
    container.innerHTML = 'Loading...';
    
    try {
        // Fetch data directly from tables (replacing removed views)
        const { data: view1nf, error: error1nf } = await supabase
            .from('user_profile')
            .select('user_id, name, age, gender, height, weight, email')
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (error1nf) throw error1nf;

        const { data: view2nf, error: error2nf } = await supabase
            .from('exercises')
            .select('exercise_id, exercise_name, muscle_group, difficulty_level, available_equipments(equipment_name)')
            .order('exercise_id')
            .limit(5);
        
        if (error2nf) throw error2nf;

        // Get equipment with exercise counts
        const { data: equipmentData, error: equipmentError } = await supabase
            .from('available_equipments')
            .select('equipment_id, equipment_name, equipment_type, exercises(exercise_id)');
        
        if (equipmentError) throw equipmentError;
        
        const view3nf = equipmentData.map(eq => ({
            equipment_id: eq.equipment_id,
            equipment_name: eq.equipment_name,
            equipment_type: eq.equipment_type,
            exercises_using_equipment: eq.exercises ? eq.exercises.length : 0
        })).sort((a, b) => b.exercises_using_equipment - a.exercises_using_equipment);

        const { data: trainingData, error: trainingError } = await supabase
            .from('training_records')
            .select(`
                record_id,
                sets,
                reps,
                weight_used,
                date,
                user_profile!inner(name, email),
                exercises!inner(exercise_name, available_equipments(equipment_name))
            `)
            .order('date', { ascending: false })
            .limit(10);
        
        if (trainingError) throw trainingError;
        
        const viewDecomp = trainingData.map(tr => ({
            record_id: tr.record_id,
            user_name: tr.user_profile?.name || '',
            user_email: tr.user_profile?.email || '',
            exercise_name: tr.exercises?.exercise_name || '',
            equipment_name: tr.exercises?.available_equipments?.equipment_name || null,
            sets: tr.sets,
            reps: tr.reps,
            weight_used: tr.weight_used,
            training_date: tr.date
        }));

        let html = `
            <h3>Database Structure & Integrity</h3>
            <p class="section-description">Database schema information and data integrity insights</p>
            
            <div style="margin: 20px 0;">
                <h4>User Profile Data</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Height (cm)</th>
                            <th>Weight (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        view1nf.forEach(user => {
            html += `
                <tr>
                    <td>${escapeHtml(user.name)}</td>
                    <td>${user.age}</td>
                    <td>${user.gender}</td>
                    <td>${user.height}</td>
                    <td>${user.weight}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>

            <div style="margin: 20px 0;">
                <h4>Exercise Catalog</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Exercise ID</th>
                            <th>Exercise Name</th>
                            <th>Muscle Group</th>
                            <th>Difficulty</th>
                            <th>Equipment</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        view2nf.forEach(ex => {
            const equipmentName = ex.available_equipments?.equipment_name || (Array.isArray(ex.available_equipments) && ex.available_equipments[0]?.equipment_name) || 'None';
            html += `
                <tr>
                    <td>${ex.exercise_id}</td>
                    <td>${escapeHtml(ex.exercise_name)}</td>
                    <td>${escapeHtml(ex.muscle_group)}</td>
                    <td>${escapeHtml(ex.difficulty_level)}</td>
                    <td>${escapeHtml(equipmentName)}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>

            <div style="margin: 20px 0;">
                <h4>Equipment Inventory</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Equipment ID</th>
                            <th>Equipment Name</th>
                            <th>Type</th>
                            <th>Exercises Using It</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        view3nf.forEach(eq => {
            html += `
                <tr>
                    <td>${eq.equipment_id}</td>
                    <td>${escapeHtml(eq.equipment_name)}</td>
                    <td>${escapeHtml(eq.equipment_type)}</td>
                    <td>${eq.exercises_using_equipment}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>

            <div style="margin: 20px 0;">
                <h4>Complete Workout Records</h4>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Exercise</th>
                            <th>Equipment</th>
                            <th>Sets x Reps</th>
                            <th>Weight</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        viewDecomp.slice(0, 5).forEach(rec => {
            html += `
                <tr>
                    <td>${escapeHtml(rec.user_name)}</td>
                    <td>${escapeHtml(rec.exercise_name)}</td>
                    <td>${escapeHtml(rec.equipment_name || 'None')}</td>
                    <td>${rec.sets} x ${rec.reps}</td>
                    <td>${rec.weight_used || '-'} kg</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading normalization:', error);
        container.innerHTML = 'Error loading normalization data.';
    }
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return unsafe.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Check login state on page load
function checkLoginState() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadDashboard();
    } else {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }
}

// Add event listener for Enter key in login form
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkLoginState();
    
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            login();
        }
    });
});
