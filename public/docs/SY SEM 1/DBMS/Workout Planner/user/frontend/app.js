// My Workout Planner - User-Focused Application JavaScript
// Demonstrates DBMS concepts through personal fitness tracking

class WorkoutPlanner {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.selectedEquipment = [];
        this.selectedExercises = [];
        this.workoutTimer = null;
        this.workoutStartTime = null;
        this.workoutDuration = 0;
        this.pausedDuration = 0;
        this.isPaused = false;
        this.init();
    }

    async init() {
        try {
            // Check authentication first
            if (!this.checkAuthentication()) {
                this.redirectToLogin();
                return;
            }

            // Wait a bit for scripts to load
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Initialize Supabase client
            this.supabase = window.getSupabase();
            if (!this.supabase) {
                console.warn('Supabase client not available - running in demo mode');
                this.showMessage('Running in demo mode - database features disabled', 'info');
                this.setupEventListeners();
                return;
            }

            // Setup event listeners
            this.setupEventListeners();
            
            // Load initial data
            await this.loadDashboardData();
            await this.loadAllData();
            
            console.log('Workout Planner initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showMessage('Failed to initialize application - running in demo mode', 'error');
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Modal close
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });

        // Recipe modal close
        document.getElementById('recipe-modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'recipe-modal-overlay') {
                this.closeRecipeModal();
            }
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to nav link
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    async loadSectionData(sectionName) {
        switch (sectionName) {
            case 'home':
                await this.loadHomeData();
                break;
            case 'workout':
                await this.loadEquipment();
                break;
            case 'progress':
                await this.loadUserProgress();
                break;
            case 'nutrition':
                await this.loadNutritionData();
                break;
            case 'profile':
                await this.loadUserProfile();
                break;
        }
    }

    async loadDashboardData() {
        // This method is no longer needed in the user-focused design
        // Dashboard data is now loaded in loadHomeData()
        return;
    }

    async loadAllData() {
        // Only load data for sections that exist in the user-focused design
        await Promise.all([
            this.loadHomeData(),
            this.loadEquipment(),
            this.loadRecipes()
        ]);
    }

    // =============================================
    // LEGACY ADMIN METHODS (No longer used in user-focused design)
    // =============================================

    calculateBMI(height, weight) {
        if (!height || !weight) return null;
        return weight / Math.pow(height / 100, 2);
    }

    // Legacy admin methods removed - not needed in user-focused design

    // Legacy exercise management methods removed - now handled in user-focused methods

    // Legacy training records methods removed - now handled in user progress methods

    // =============================================
    // RECIPE MANAGEMENT (User-focused)
    // =============================================
    async loadRecipes() {
        try {
            if (!this.supabase) {
                this.showDemoRecipes();
                return;
            }

            const { data, error } = await this.supabase
                .from('recipes')
                .select('*')
                .order('recipe_name');

            if (error) throw error;
            this.displayRecipesForUser(data);
        } catch (error) {
            console.error('Error loading recipes:', error);
            this.showDemoRecipes();
        }
    }

    displayRecipesForUser(recipes) {
        const grid = document.getElementById('recipes-grid');
        if (!grid) return;
        
        grid.innerHTML = '';

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.dataset.type = recipe.type || '';
            card.dataset.time = recipe.time || recipe.meal_type || '';
            
            card.innerHTML = `
                <h4>${recipe.recipe_name}</h4>
                <div class="meal-type">${recipe.time || recipe.meal_type || 'Meal'}</div>
                <div class="ingredients">${recipe.ingredients}</div>
                <div class="nutrition-info">
                    <div class="nutrition-item">
                        <span>Calories:</span>
                        <span>${recipe.calories}</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Protein:</span>
                        <span>${recipe.protein}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Carbs:</span>
                        <span>${recipe.carbs}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Fats:</span>
                        <span>${recipe.fats}g</span>
                    </div>
                </div>
                <div class="prep-time">Prep: ${recipe.prep_time_minutes} min</div>
            `;
            grid.appendChild(card);
        });
    }

    showDemoRecipes() {
        const grid = document.getElementById('recipes-grid');
        if (!grid) return;
        
        const demoRecipes = [
            {
                recipe_name: 'Protein Smoothie',
                ingredients: 'Banana, Protein Powder, Milk, Berries',
                type: 'Veg',
                time: 'Breakfast',
                calories: 350,
                protein: 25,
                carbs: 30,
                fats: 8,
                prep_time_minutes: 5,
                meal_type: 'Breakfast'
            },
            {
                recipe_name: 'Grilled Chicken Breast',
                ingredients: 'Chicken Breast, Olive Oil, Herbs',
                type: 'Non-Veg',
                time: 'Lunch',
                calories: 250,
                protein: 35,
                carbs: 0,
                fats: 12,
                prep_time_minutes: 20,
                meal_type: 'Lunch'
            },
            {
                recipe_name: 'Quinoa Salad Bowl',
                ingredients: 'Quinoa, Mixed Vegetables, Avocado, Lemon Dressing',
                type: 'Veg',
                time: 'Lunch',
                calories: 400,
                protein: 15,
                carbs: 45,
                fats: 18,
                prep_time_minutes: 15,
                meal_type: 'Lunch'
            },
            {
                recipe_name: 'Salmon with Sweet Potato',
                ingredients: 'Salmon Fillet, Sweet Potato, Broccoli, Olive Oil',
                type: 'Non-Veg',
                time: 'Dinner',
                calories: 450,
                protein: 40,
                carbs: 35,
                fats: 20,
                prep_time_minutes: 25,
                meal_type: 'Dinner'
            },
            {
                recipe_name: 'Greek Yogurt Parfait',
                ingredients: 'Greek Yogurt, Granola, Honey, Mixed Berries',
                type: 'Veg',
                time: 'Snack',
                calories: 200,
                protein: 20,
                carbs: 25,
                fats: 5,
                prep_time_minutes: 5,
                meal_type: 'Snack'
            },
            {
                recipe_name: 'Overnight Oats',
                ingredients: 'Rolled Oats, Almond Milk, Chia Seeds, Banana',
                type: 'Veg',
                time: 'Breakfast',
                calories: 300,
                protein: 12,
                carbs: 45,
                fats: 8,
                prep_time_minutes: 10,
                meal_type: 'Breakfast'
            }
        ];
        this.displayRecipesForUser(demoRecipes);
    }

    // Legacy diet recommendations methods removed - now handled in user nutrition methods

    // =============================================
    // USER-FOCUSED WORKOUT FUNCTIONALITY
    // =============================================

    // Home Dashboard
    async loadHomeData() {
        try {
            if (!this.supabase) {
                // Demo mode
                document.getElementById('user-workouts').textContent = '0';
                document.getElementById('user-calories').textContent = '0';
                document.getElementById('user-streak').textContent = '0';
                return;
            }

            // Load user statistics
            const userId = await this.getCurrentUserId();
            if (!userId) return;

            const { data: workouts } = await this.supabase
                .from('training_records')
                .select('*')
                .eq('user_id', userId);

            const totalWorkouts = workouts?.length || 0;
            const totalCalories = (workouts?.reduce((sum, w) => sum + (w.duration_minutes * 8), 0) || 0); // Approximate calories
            const streak = await this.calculateStreak(userId);

            document.getElementById('user-workouts').textContent = totalWorkouts;
            document.getElementById('user-calories').textContent = totalCalories;
            document.getElementById('user-streak').textContent = streak;
        } catch (error) {
            console.error('Error loading home data:', error);
        }
    }

    // Equipment Selection
    async loadEquipment() {
        try {
            if (!this.supabase) {
                this.showDemoEquipment();
                return;
            }

            const { data, error } = await this.supabase
                .from('available_equipments')
                .select('*')
                .order('equipment_name');

            if (error) throw error;
            this.displayEquipment(data);
        } catch (error) {
            console.error('Error loading equipment:', error);
            this.showDemoEquipment();
        }
    }

    displayEquipment(equipment) {
        const grid = document.getElementById('equipment-grid');
        grid.innerHTML = '';

        equipment.forEach(item => {
            const card = document.createElement('div');
            card.className = 'equipment-card';
            card.onclick = () => this.selectEquipment(item);
            
            // Map equipment names to PNG images
            const imageMap = {
                'Dumbbells': '../../images/dumbbell.0cab1a70.png',
                'Barbell': '../../images/barbell.50cb27fb.png',
                'Bench Press': '../../images/bench.15b24162.png',
                'Pull-up Bar': '../../images/pull-up-bar.5a1808c8.png',
                'Resistance Bands': '../../images/band.e40118b4.png',
                'Kettlebell': '../../images/kettlebell.9f01f239.png',
                'Weight Plates': '../../images/plate.ae3a3195.png',
                'Bodyweight': '../../images/bodyweight.e08c10a8.png',
                'Treadmill': '../../images/treadmill.50cb27fb.png',
                'Stationary Bike': '../../images/stationary-bike.50cb27fb.png'
            };
            
            const imageFile = imageMap[item.equipment_name] || '../../images/dumbbell.0cab1a70.png';
            
            card.innerHTML = `
                <img src="${imageFile}" alt="${item.equipment_name}" class="equipment-image">
                <h4>${item.equipment_name}</h4>
                <p>${item.equipment_type || 'Fitness Equipment'}</p>
            `;
            grid.appendChild(card);
        });
    }

    showDemoEquipment() {
        const demoEquipment = [
            { equipment_id: 1, equipment_name: 'Dumbbells', equipment_type: 'Free Weights' },
            { equipment_id: 2, equipment_name: 'Barbell', equipment_type: 'Free Weights' },
            { equipment_id: 3, equipment_name: 'Bench Press', equipment_type: 'Machines' },
            { equipment_id: 4, equipment_name: 'Pull-up Bar', equipment_type: 'Bodyweight' },
            { equipment_id: 5, equipment_name: 'Resistance Bands', equipment_type: 'Accessories' },
            { equipment_id: 6, equipment_name: 'Kettlebell', equipment_type: 'Free Weights' },
            { equipment_id: 7, equipment_name: 'Weight Plates', equipment_type: 'Free Weights' },
            { equipment_id: 8, equipment_name: 'Bodyweight', equipment_type: 'Bodyweight' },
            { equipment_id: 9, equipment_name: 'Treadmill', equipment_type: 'Cardio' },
            { equipment_id: 10, equipment_name: 'Stationary Bike', equipment_type: 'Cardio' }
        ];
        this.displayEquipment(demoEquipment);
    }

    selectEquipment(equipment) {
        const card = event.currentTarget;
        const isSelected = card.classList.contains('selected');
        
        if (isSelected) {
            // Remove from selection
            card.classList.remove('selected');
            this.selectedEquipment = this.selectedEquipment.filter(item => item.equipment_id !== equipment.equipment_id);
        } else {
            // Add to selection
            card.classList.add('selected');
            this.selectedEquipment.push(equipment);
        }

        // Enable/disable next button based on selection
        const nextButton = document.getElementById('next-to-exercises');
        nextButton.disabled = this.selectedEquipment.length === 0;
        
        // Update button text to show count
        if (this.selectedEquipment.length > 0) {
            nextButton.textContent = `Next: Choose Exercises (${this.selectedEquipment.length} selected)`;
        } else {
            nextButton.textContent = 'Next: Choose Exercises';
        }
    }

    async proceedToExercises() {
        if (this.selectedEquipment.length === 0) return;

        // Update selected equipment display
        const equipmentNames = this.selectedEquipment.map(eq => eq.equipment_name).join(', ');
        document.getElementById('selected-equipment-name').textContent = equipmentNames;

        // Hide equipment step, show exercises step
        document.getElementById('equipment-step').classList.remove('active');
        document.getElementById('exercises-step').classList.add('active');

        // Load exercises for selected equipment
        await this.loadExercisesForEquipment();
    }

    async loadExercisesForEquipment() {
        try {
            if (!this.supabase) {
                this.showDemoExercises();
                return;
            }

            // Get equipment IDs from selected equipment
            const equipmentIds = this.selectedEquipment.map(eq => eq.equipment_id);
            
            const { data, error } = await this.supabase
                .from('exercises')
                .select('*')
                .in('equipment_id', equipmentIds)
                .order('exercise_name');

            if (error) throw error;
            this.displayExercisesForSelection(data);
        } catch (error) {
            console.error('Error loading exercises:', error);
            this.showDemoExercises();
        }
    }

    displayExercisesForSelection(exercises) {
        const grid = document.getElementById('exercises-grid');
        grid.innerHTML = '';

        exercises.forEach(exercise => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.onclick = () => this.toggleExerciseSelection(exercise, card);
            card.innerHTML = `
                <h4>${exercise.exercise_name}</h4>
                <div class="muscle-group">${exercise.muscle_group}</div>
                <div class="difficulty ${exercise.difficulty_level.toLowerCase()}">${exercise.difficulty_level}</div>
                <div class="instructions">${exercise.instructions || 'No instructions available'}</div>
            `;
            grid.appendChild(card);
        });
    }

    showDemoExercises() {
        // Generate exercises based on selected equipment
        const demoExercises = [];
        
        this.selectedEquipment.forEach(equipment => {
            switch(equipment.equipment_name) {
                case 'Dumbbells':
                    demoExercises.push(
                        { exercise_id: 1, exercise_name: 'Dumbbell Bicep Curls', muscle_group: 'Arms', difficulty_level: 'Beginner', instructions: 'Hold dumbbells, curl up with biceps' },
                        { exercise_id: 2, exercise_name: 'Dumbbell Shoulder Press', muscle_group: 'Shoulders', difficulty_level: 'Intermediate', instructions: 'Press dumbbells overhead' },
                        { exercise_id: 3, exercise_name: 'Dumbbell Chest Press', muscle_group: 'Chest', difficulty_level: 'Intermediate', instructions: 'Press dumbbells from chest' }
                    );
                    break;
                case 'Barbell':
                    demoExercises.push(
                        { exercise_id: 4, exercise_name: 'Barbell Bench Press', muscle_group: 'Chest', difficulty_level: 'Intermediate', instructions: 'Lie on bench, lower bar to chest, press up' },
                        { exercise_id: 5, exercise_name: 'Barbell Squats', muscle_group: 'Legs', difficulty_level: 'Intermediate', instructions: 'Hold barbell on shoulders, squat down' },
                        { exercise_id: 6, exercise_name: 'Barbell Deadlift', muscle_group: 'Back', difficulty_level: 'Advanced', instructions: 'Lift barbell from ground to standing position' }
                    );
                    break;
                case 'Bench Press':
                    demoExercises.push(
                        { exercise_id: 7, exercise_name: 'Bench Press', muscle_group: 'Chest', difficulty_level: 'Intermediate', instructions: 'Lie on bench, lower bar to chest, press up' },
                        { exercise_id: 8, exercise_name: 'Incline Bench Press', muscle_group: 'Chest', difficulty_level: 'Intermediate', instructions: 'Press on inclined bench' }
                    );
                    break;
                case 'Pull-up Bar':
                    demoExercises.push(
                        { exercise_id: 9, exercise_name: 'Pull-ups', muscle_group: 'Back', difficulty_level: 'Intermediate', instructions: 'Hang from bar, pull body up' },
                        { exercise_id: 10, exercise_name: 'Chin-ups', muscle_group: 'Arms', difficulty_level: 'Intermediate', instructions: 'Pull-ups with palms facing you' }
                    );
                    break;
                case 'Resistance Bands':
                    demoExercises.push(
                        { exercise_id: 11, exercise_name: 'Band Chest Press', muscle_group: 'Chest', difficulty_level: 'Beginner', instructions: 'Press bands across chest' },
                        { exercise_id: 12, exercise_name: 'Band Rows', muscle_group: 'Back', difficulty_level: 'Beginner', instructions: 'Pull bands towards chest' }
                    );
                    break;
                case 'Kettlebell':
                    demoExercises.push(
                        { exercise_id: 13, exercise_name: 'Kettlebell Swings', muscle_group: 'Full Body', difficulty_level: 'Intermediate', instructions: 'Swing kettlebell between legs' },
                        { exercise_id: 14, exercise_name: 'Kettlebell Goblet Squats', muscle_group: 'Legs', difficulty_level: 'Beginner', instructions: 'Hold kettlebell, squat down' }
                    );
                    break;
                case 'Weight Plates':
                    demoExercises.push(
                        { exercise_id: 15, exercise_name: 'Plate Raises', muscle_group: 'Shoulders', difficulty_level: 'Beginner', instructions: 'Raise plate overhead' },
                        { exercise_id: 16, exercise_name: 'Plate Twists', muscle_group: 'Core', difficulty_level: 'Beginner', instructions: 'Hold plate, twist torso' }
                    );
                    break;
                case 'Bodyweight':
                    demoExercises.push(
                        { exercise_id: 17, exercise_name: 'Push-ups', muscle_group: 'Chest', difficulty_level: 'Beginner', instructions: 'Push body up from ground' },
                        { exercise_id: 18, exercise_name: 'Squats', muscle_group: 'Legs', difficulty_level: 'Beginner', instructions: 'Squat down and up' },
                        { exercise_id: 19, exercise_name: 'Plank', muscle_group: 'Core', difficulty_level: 'Beginner', instructions: 'Hold plank position' }
                    );
                    break;
                case 'Treadmill':
                    demoExercises.push(
                        { exercise_id: 20, exercise_name: 'Treadmill Running', muscle_group: 'Cardio', difficulty_level: 'Beginner', instructions: 'Run on treadmill at steady pace' },
                        { exercise_id: 21, exercise_name: 'Treadmill Walking', muscle_group: 'Cardio', difficulty_level: 'Beginner', instructions: 'Walk on treadmill' }
                    );
                    break;
                case 'Stationary Bike':
                    demoExercises.push(
                        { exercise_id: 22, exercise_name: 'Stationary Cycling', muscle_group: 'Cardio', difficulty_level: 'Beginner', instructions: 'Cycle on stationary bike' },
                        { exercise_id: 23, exercise_name: 'HIIT Cycling', muscle_group: 'Cardio', difficulty_level: 'Intermediate', instructions: 'High intensity interval cycling' }
                    );
                    break;
            }
        });
        
        this.displayExercisesForSelection(demoExercises);
    }

    toggleExerciseSelection(exercise, cardElement) {
        const isSelected = cardElement.classList.contains('selected');
        
        if (isSelected) {
            cardElement.classList.remove('selected');
            this.selectedExercises = this.selectedExercises.filter(e => e.exercise_id !== exercise.exercise_id);
        } else {
            cardElement.classList.add('selected');
            this.selectedExercises.push(exercise);
        }

        // Enable/disable next button
        document.getElementById('next-to-workout').disabled = this.selectedExercises.length === 0;
    }

    backToEquipment() {
        document.getElementById('exercises-step').classList.remove('active');
        document.getElementById('equipment-step').classList.add('active');
        this.selectedExercises = [];
        
        // Reset button text
        const nextButton = document.getElementById('next-to-exercises');
        if (this.selectedEquipment.length > 0) {
            nextButton.textContent = `Next: Choose Exercises (${this.selectedEquipment.length} selected)`;
            nextButton.disabled = false;
        } else {
            nextButton.textContent = 'Next: Choose Exercises';
            nextButton.disabled = true;
        }
    }

    async proceedToWorkout() {
        if (this.selectedExercises.length === 0) return;

        // Hide exercises step, show workout step
        document.getElementById('exercises-step').classList.remove('active');
        document.getElementById('active-workout-step').classList.add('active');

        // Display selected exercises for workout
        this.displayWorkoutExercises();
    }

    displayWorkoutExercises() {
        const container = document.getElementById('workout-exercises');
        container.innerHTML = '';

        this.selectedExercises.forEach((exercise, index) => {
            const item = document.createElement('div');
            item.className = 'workout-exercise-item';
            item.innerHTML = `
                <h4>${exercise.exercise_name}</h4>
                <div class="exercise-inputs">
                    <div>
                        <label>Sets</label>
                        <input type="number" id="sets-${index}" min="1" value="3" class="exercise-sets" onchange="app.updateWorkoutStats()">
                    </div>
                    <div>
                        <label>Reps</label>
                        <input type="number" id="reps-${index}" min="1" value="10" class="exercise-reps" onchange="app.updateWorkoutStats()">
                    </div>
                    <div>
                        <label>Weight (kg)</label>
                        <input type="number" id="weight-${index}" min="0" step="0.5" value="0" class="exercise-weight" onchange="app.updateWorkoutStats()">
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
        
        this.updateWorkoutStats();
    }

    // Workout Timer Functions
    startWorkoutTimer() {
        if (this.isPaused) {
            // Resume from pause
            this.workoutStartTime = new Date();
            this.isPaused = false;
        } else {
            // Start fresh
            this.workoutStartTime = new Date();
            this.pausedDuration = 0;
            this.workoutDuration = 0;
        }

        this.workoutTimer = setInterval(() => {
            this.updateTimer();
        }, 1000);

        this.updateTimerControls('running');
    }

    pauseWorkoutTimer() {
        if (this.workoutTimer) {
            clearInterval(this.workoutTimer);
            this.workoutTimer = null;
        }

        // Calculate paused duration
        if (this.workoutStartTime) {
            const now = new Date();
            const elapsed = Math.floor((now - this.workoutStartTime) / 1000);
            this.pausedDuration += elapsed;
        }

        this.isPaused = true;
        this.updateTimerControls('paused');
    }

    stopWorkoutTimer() {
        if (this.workoutTimer) {
            clearInterval(this.workoutTimer);
            this.workoutTimer = null;
        }

        // Reset all timer state
        this.workoutStartTime = null;
        this.pausedDuration = 0;
        this.workoutDuration = 0;
        this.isPaused = false;

        // Reset display
        document.getElementById('workout-time').textContent = '00:00';
        document.getElementById('calories-burned').textContent = '0';

        this.updateTimerControls('stopped');
    }

    updateTimerControls(state) {
        const startBtn = document.getElementById('start-timer');
        const pauseBtn = document.getElementById('pause-timer');
        const stopBtn = document.getElementById('stop-timer');
        const timerElement = document.querySelector('.workout-timer');

        // Remove all state classes
        timerElement.classList.remove('running', 'paused', 'stopped');
        
        // Add current state class
        timerElement.classList.add(state);

        switch (state) {
            case 'running':
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                stopBtn.disabled = false;
                startBtn.innerHTML = '<i class="fas fa-play"></i> Running...';
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                break;
            case 'paused':
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                stopBtn.disabled = false;
                startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Paused';
                break;
            case 'stopped':
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                stopBtn.disabled = true;
                startBtn.innerHTML = '<i class="fas fa-play"></i> Start Workout';
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                break;
        }
    }

    updateTimer() {
        if (!this.workoutStartTime) return;

        const now = new Date();
        const currentElapsed = Math.floor((now - this.workoutStartTime) / 1000);
        const totalElapsed = currentElapsed + this.pausedDuration;
        this.workoutDuration = totalElapsed;

        const minutes = Math.floor(totalElapsed / 60);
        const seconds = totalElapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('workout-time').textContent = timeString;
        
        // Update calories burned (rough estimate: 8 calories per minute)
        const caloriesBurned = Math.floor(totalElapsed / 60) * 8;
        document.getElementById('calories-burned').textContent = caloriesBurned;
    }

    updateWorkoutStats() {
        // Calculate total sets
        let totalSets = 0;
        this.selectedExercises.forEach((exercise, index) => {
            const setsInput = document.getElementById(`sets-${index}`);
            if (setsInput) {
                totalSets += parseInt(setsInput.value) || 0;
            }
        });
        
        // Update stats display
        document.getElementById('exercises-completed').textContent = this.selectedExercises.length;
        document.getElementById('sets-completed').textContent = totalSets;
        
        // Update calories if timer is running
        if (this.workoutStartTime && !this.isPaused) {
            const now = new Date();
            const currentElapsed = Math.floor((now - this.workoutStartTime) / 1000);
            const totalElapsed = currentElapsed + this.pausedDuration;
            const caloriesBurned = Math.floor(totalElapsed / 60) * 8;
            document.getElementById('calories-burned').textContent = caloriesBurned;
        }
    }

    async saveWorkout() {
        try {
            if (!this.supabase) {
                this.showMessage('Demo mode - workout not saved', 'info');
                return;
            }

            const userId = await this.getCurrentUserId();
            if (!userId) {
                this.showMessage('Please set up your profile first', 'error');
                return;
            }

            // Convert duration from seconds to minutes (minimum 1 minute)
            const durationInMinutes = Math.max(1, Math.floor(this.workoutDuration / 60));
            
            const workoutData = this.selectedExercises.map((exercise, index) => ({
                user_id: userId,
                exercise_id: exercise.exercise_id,
                date: new Date().toISOString().split('T')[0],
                sets: parseInt(document.getElementById(`sets-${index}`).value),
                reps: parseInt(document.getElementById(`reps-${index}`).value),
                weight_used: parseFloat(document.getElementById(`weight-${index}`).value),
                duration_minutes: durationInMinutes
            }));

            const { error } = await this.supabase
                .from('training_records')
                .insert(workoutData);

            if (error) throw error;

            this.showMessage('Workout saved successfully!', 'success');
            this.cancelWorkout();
        } catch (error) {
            console.error('Error saving workout:', error);
            this.showMessage('Failed to save workout', 'error');
        }
    }

    cancelWorkout() {
        // Stop timer and reset state
        this.stopWorkoutTimer();
        
        // Reset workout state
        this.selectedEquipment = [];
        this.selectedExercises = [];

        // Go back to equipment selection
        document.getElementById('active-workout-step').classList.remove('active');
        document.getElementById('equipment-step').classList.add('active');
        
        // Clear selections
        document.querySelectorAll('.equipment-card, .exercise-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset button text
        const nextButton = document.getElementById('next-to-exercises');
        nextButton.textContent = 'Next: Choose Exercises';
        nextButton.disabled = true;
    }

    // User Progress
    async loadUserProgress() {
        try {
            if (!this.supabase) {
                this.showDemoProgress();
                return;
            }

            const userId = await this.getCurrentUserId();
            if (!userId) return;

            // Load user's workout statistics
            const { data: workouts } = await this.supabase
                .from('training_records')
                .select(`
                    *,
                    exercises(exercise_name, muscle_group)
                `)
                .eq('user_id', userId)
                .order('date', { ascending: false });

            this.displayUserProgress(workouts || []);
        } catch (error) {
            console.error('Error loading user progress:', error);
            this.showDemoProgress();
        }
    }

    displayUserProgress(workouts) {
        // Update progress stats
        const totalWorkouts = workouts.length;
        const totalCalories = workouts.reduce((sum, w) => sum + (w.duration_minutes * 8), 0);
        const totalTime = workouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0);
        const streak = this.calculateStreakFromWorkouts(workouts);

        document.getElementById('total-workouts').textContent = totalWorkouts;
        document.getElementById('total-calories').textContent = totalCalories;
        document.getElementById('total-time').textContent = `${Math.floor(totalTime / 60)}h`;
        document.getElementById('current-streak').textContent = streak;

        // Display recent workouts
        this.displayRecentWorkouts(workouts.slice(0, 5));

        // Display exercise progress
        this.displayExerciseProgress(workouts);
    }

    displayRecentWorkouts(workouts) {
        const container = document.getElementById('recent-workouts-list');
        container.innerHTML = '';

        workouts.forEach(workout => {
            const item = document.createElement('div');
            item.className = 'workout-item';
            item.innerHTML = `
                <div class="workout-info">
                    <h4>${workout.exercises?.exercise_name || 'Exercise'}</h4>
                    <p>${new Date(workout.date).toLocaleDateString()}</p>
                </div>
                <div class="workout-stats">
                    <div>${workout.sets} sets × ${workout.reps} reps</div>
                    <div>${workout.weight_used}kg</div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    showDemoProgress() {
        document.getElementById('total-workouts').textContent = '0';
        document.getElementById('total-calories').textContent = '0';
        document.getElementById('total-time').textContent = '0h';
        document.getElementById('current-streak').textContent = '0';

        // Demo exercise progress
        const demoWorkouts = [
            { exercises: { exercise_name: 'Push-ups' }, sets: 3, reps: 12, weight_used: 0 },
            { exercises: { exercise_name: 'Dumbbell Bicep Curls' }, sets: 4, reps: 10, weight_used: 8 },
            { exercises: { exercise_name: 'Dumbbell Bicep Curls' }, sets: 4, reps: 10, weight_used: 10 },
            { exercises: { exercise_name: 'Barbell Squats' }, sets: 5, reps: 5, weight_used: 60 },
            { exercises: { exercise_name: 'Barbell Squats' }, sets: 5, reps: 5, weight_used: 70 },
            { exercises: { exercise_name: 'Plank' }, sets: 3, reps: 1, weight_used: 0 }
        ];
        this.displayExerciseProgress(demoWorkouts);
    }

    displayExerciseProgress(workouts) {
        const container = document.getElementById('exercise-progress-chart');
        if (!container) return;

        // Group by exercise name and compute a progress metric
        const exerciseMap = new Map();
        workouts.forEach(w => {
            const name = w.exercises?.exercise_name || 'Exercise';
            const entry = exerciseMap.get(name) || {
                exerciseName: name,
                sessions: 0,
                totalSets: 0,
                totalReps: 0,
                minWeight: Number.POSITIVE_INFINITY,
                maxWeight: 0
            };
            entry.sessions += 1;
            entry.totalSets += (w.sets || 0);
            entry.totalReps += (w.reps || 0);
            const weight = Number.isFinite(w.weight_used) ? (w.weight_used || 0) : 0;
            if (weight > entry.maxWeight) entry.maxWeight = weight;
            if (weight < entry.minWeight) entry.minWeight = weight;
            exerciseMap.set(name, entry);
        });

        const exercises = Array.from(exerciseMap.values());
        // Define metric: prefer weight progression; fall back to sessions if no weight data
        exercises.forEach(e => {
            const hasWeightData = Number.isFinite(e.maxWeight) && e.maxWeight > 0;
            const weightGain = hasWeightData ? Math.max(0, e.maxWeight - (Number.isFinite(e.minWeight) ? e.minWeight : 0)) : 0;
            e.metric = hasWeightData ? weightGain : e.sessions; // simple heuristic
        });

        // Determine scaling
        const maxMetric = exercises.reduce((m, e) => Math.max(m, e.metric || 0), 0) || 1;

        // Sort by metric desc and take top 8 for readability
        exercises.sort((a, b) => (b.metric || 0) - (a.metric || 0));
        const topExercises = exercises.slice(0, 8);

        // Render
        container.innerHTML = '';
        if (topExercises.length === 0) {
            container.innerHTML = '<p>No exercise data yet. Complete a workout to see progress.</p>';
            return;
        }

        topExercises.forEach(e => {
            const percent = Math.max(5, Math.round((e.metric / maxMetric) * 100));
            const subtitle = (e.maxWeight && e.maxWeight > 0)
                ? `${e.sessions} sessions • Max ${e.maxWeight}kg`
                : `${e.sessions} sessions • ${e.totalSets} sets`;

            const item = document.createElement('div');
            item.className = 'progress-item';
            item.innerHTML = `
                <div class="exercise-name">
                    <div>${e.exerciseName}</div>
                    <small>${subtitle}</small>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                </div>
                <div class="progress-value">${percent}%</div>
            `;
            container.appendChild(item);
        });
    }

    // Nutrition
    async loadNutritionData() {
        await this.loadRecipes();
        await this.loadUserRecommendations();
    }

    async loadUserRecommendations() {
        try {
            if (!this.supabase) {
                this.showDemoRecommendations();
                return;
            }

            const userId = await this.getCurrentUserId();
            if (!userId) return;

            const { data } = await this.supabase
                .from('diet_recommendation')
                .select(`
                    *,
                    recipes(recipe_name, calories, protein, carbs, fats)
                `)
                .eq('user_id', userId)
                .order('recommended_on', { ascending: false });

            this.displayRecommendations(data || []);
        } catch (error) {
            console.error('Error loading recommendations:', error);
            this.showDemoRecommendations();
        }
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations-list');
        container.innerHTML = '';

        recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recipe-card';
            item.innerHTML = `
                <h4>${rec.recipes?.recipe_name || 'Recipe'}</h4>
                <div class="nutrition-info">
                    <div class="nutrition-item">
                        <span>Calories:</span>
                        <span>${rec.recipes?.calories || 0}</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Protein:</span>
                        <span>${rec.recipes?.protein || 0}g</span>
                    </div>
                </div>
                <div class="prep-time">${rec.meal_type} - ${rec.status}</div>
            `;
            container.appendChild(item);
        });
    }

    showDemoRecommendations() {
        const container = document.getElementById('recommendations-list');
        container.innerHTML = '<p>No recommendations available in demo mode</p>';
    }

    // Profile Management
    async loadUserProfile() {
        try {
            if (!this.supabase) {
                this.showDemoProfile();
                return;
            }

            const userId = await this.getCurrentUserId();
            if (!userId) return;

            const { data: user } = await this.supabase
                .from('user_profile')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (user) {
                this.displayUserProfile(user);
            } else {
                this.showMessage('Please set up your profile first', 'info');
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.showDemoProfile();
        }
    }

    displayUserProfile(user) {
        const bmi = this.calculateBMI(user.height, user.weight);
        
        document.getElementById('user-name').textContent = user.name || this.currentUser?.user_metadata?.name || 'User';
        document.getElementById('user-email').textContent = user.email || this.currentUser?.email || 'user@example.com';
        document.getElementById('user-age').textContent = user.age || '-';
        document.getElementById('user-height').textContent = user.height ? `${user.height} cm` : '-';
        document.getElementById('user-weight').textContent = user.weight ? `${user.weight} kg` : '-';
        document.getElementById('user-bmi').textContent = bmi ? bmi.toFixed(1) : 'N/A';
    }

    showDemoProfile() {
        document.getElementById('user-name').textContent = 'Demo User';
        document.getElementById('user-email').textContent = 'demo@example.com';
        document.getElementById('user-age').textContent = '25';
        document.getElementById('user-height').textContent = '175 cm';
        document.getElementById('user-weight').textContent = '70 kg';
        document.getElementById('user-bmi').textContent = '22.9';
    }

    // =============================================
    // AUTHENTICATION METHODS
    // =============================================

    checkAuthentication() {
        // Check if user is logged in - check both sessionStorage and localStorage
        const rememberUser = localStorage.getItem('rememberUser') === 'true';
        const sessionUserStr = sessionStorage.getItem('currentUser');
        const localUserStr = localStorage.getItem('currentUser');
        
        // Prefer localStorage if remember me was used, otherwise use sessionStorage
        const stored = rememberUser ? localUserStr : sessionUserStr;
        
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
                return true;
            } catch (error) {
                console.error('Error parsing stored user:', error);
                // Clear invalid stored data
                sessionStorage.removeItem('currentUser');
                localStorage.removeItem('currentUser');
                return false;
            }
        }
        return false;
    }

    redirectToLogin() {
        // Redirect to login page
        window.location.href = 'login.html';
    }

    async logout() {
        try {
            // Clear Supabase session if available
            if (this.supabase) {
                await this.supabase.auth.signOut();
            }
        } catch (error) {
            console.error('Error signing out from Supabase:', error);
        }
        
        // Clear user session from both storage locations
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberUser');
        this.currentUser = null;
        
        // Small delay to ensure session is cleared
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect to login
        this.redirectToLogin();
    }

    // Utility Functions
    async getCurrentUserId() {
        if (this.currentUser) {
            // Return the user ID as-is (UUID string)
            return this.currentUser.id;
        }
        // Fallback for demo mode - use a demo UUID
        return '00000000-0000-0000-0000-000000000001';
    }

    async calculateStreak(userId) {
        // Calculate workout streak logic
        return 0; // Demo value
    }

    calculateStreakFromWorkouts(workouts) {
        // Calculate streak from workout data
        return 0; // Demo value
    }

    showNutritionTab(tabName) {
        // Hide all nutrition tabs
        document.querySelectorAll('.nutrition-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.nutrition-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Add active class to tab button
        const activeBtn = document.querySelector(`[onclick="app.showNutritionTab('${tabName}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    editProfile() {
        this.openProfileEditModal();
    }

    // Profile Edit Modal Functions
    openProfileEditModal() {
        // Load current profile data
        this.loadCurrentProfileForEdit();
        
        // Show the modal
        document.getElementById('profile-edit-modal').classList.add('active');
        
        // Setup form event listeners
        this.setupProfileEditForm();
    }

    closeProfileEdit() {
        document.getElementById('profile-edit-modal').classList.remove('active');
        this.clearProfileEditForm();
    }

    async loadCurrentProfileForEdit() {
        try {
            if (!this.supabase) {
                // Demo mode - load demo data
                this.loadDemoProfileForEdit();
                return;
            }

            const userId = await this.getCurrentUserId();
            if (!userId) return;

            const { data: user, error } = await this.supabase
                .from('user_profile')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;

            if (user) {
                this.populateProfileEditForm(user);
            } else {
                this.showMessage('Profile not found', 'error');
            }
        } catch (error) {
            console.error('Error loading profile for edit:', error);
            this.loadDemoProfileForEdit();
        }
    }

    loadDemoProfileForEdit() {
        const demoUser = {
            name: 'Demo User',
            email: 'demo@example.com',
            age: 25,
            gender: 'Male',
            height: 175,
            weight: 70
        };
        this.populateProfileEditForm(demoUser);
    }

    populateProfileEditForm(user) {
        document.getElementById('edit-name').value = user.name || '';
        document.getElementById('edit-email').value = user.email || '';
        document.getElementById('edit-age').value = user.age || '';
        document.getElementById('edit-gender').value = user.gender || '';
        document.getElementById('edit-height').value = user.height || '';
        document.getElementById('edit-weight').value = user.weight || '';
        
        // Update BMI preview
        this.updateBMIPreview();
    }

    setupProfileEditForm() {
        const form = document.getElementById('profile-edit-form');
        const heightInput = document.getElementById('edit-height');
        const weightInput = document.getElementById('edit-weight');
        
        // Remove existing listeners
        form.removeEventListener('submit', this.handleProfileUpdate);
        
        // Add form submission handler
        this.handleProfileUpdate = this.handleProfileUpdate.bind(this);
        form.addEventListener('submit', this.handleProfileUpdate);
        
        // Add BMI preview updates
        heightInput.addEventListener('input', () => this.updateBMIPreview());
        weightInput.addEventListener('input', () => this.updateBMIPreview());
        
        // Clear any existing errors
        this.clearProfileEditErrors();
    }

    updateBMIPreview() {
        const height = parseFloat(document.getElementById('edit-height').value);
        const weight = parseFloat(document.getElementById('edit-weight').value);
        
        if (height && weight) {
            const bmi = this.calculateBMI(height, weight);
            const category = this.getBMICategory(bmi);
            
            document.getElementById('bmi-preview').textContent = bmi.toFixed(1);
            document.getElementById('bmi-category').textContent = category;
            document.getElementById('bmi-category').className = `bmi-category ${category.toLowerCase().replace(' ', '-')}`;
        } else {
            document.getElementById('bmi-preview').textContent = '-';
            document.getElementById('bmi-category').textContent = '';
        }
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    async handleProfileUpdate(event) {
        event.preventDefault();
        
        const formData = this.getProfileEditFormData();
        
        // No validation - proceed directly to save
        this.setProfileEditLoading(true);

        try {
            if (!this.supabase) {
                // Demo mode - simulate update
                await this.simulateProfileUpdate(formData);
                return;
            }

            const userId = await this.getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Update profile in database (this will trigger our triggers)
            const { error } = await this.supabase
                .from('user_profile')
                .update({
                    name: formData.name,
                    email: formData.email,
                    age: formData.age,
                    gender: formData.gender,
                    height: formData.height,
                    weight: formData.weight
                })
                .eq('user_id', userId);

            if (error) throw error;

            this.showMessage('Profile updated successfully! Triggers executed and logged.', 'success');
            
            // Reload profile display
            await this.loadUserProfile();
            
            // Close modal
            this.closeProfileEdit();
            
            // Refresh trigger logs if modal is open
            if (document.getElementById('trigger-logs-modal').classList.contains('active')) {
                await this.loadTriggerLogs();
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            this.showMessage(`Failed to update profile: ${error.message}`, 'error');
        } finally {
            this.setProfileEditLoading(false);
        }
    }

    async simulateProfileUpdate(formData) {
        // Simulate database update delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate trigger execution
        console.log('Simulating trigger execution...');
        console.log('BMI Update Trigger: Calculating new BMI...');
        console.log('Validation Trigger: Profile validation passed');
        console.log('Notification Trigger: Profile change notification sent');
        
        this.showMessage('Demo profile updated! Triggers executed and logged.', 'success');
        
        // Update demo profile display
        this.displayUserProfile({
            name: formData.name,
            email: formData.email,
            age: formData.age,
            gender: formData.gender,
            height: formData.height,
            weight: formData.weight
        });
        
        this.closeProfileEdit();
    }

    getProfileEditFormData() {
        return {
            name: document.getElementById('edit-name').value.trim(),
            email: document.getElementById('edit-email').value.trim(),
            age: parseInt(document.getElementById('edit-age').value),
            gender: document.getElementById('edit-gender').value,
            height: parseFloat(document.getElementById('edit-height').value),
            weight: parseFloat(document.getElementById('edit-weight').value)
        };
    }

    validateProfileEditForm(formData) {
        // No validation - just return true
        // All validation removed as requested
        return true;
    }

    showProfileEditError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        errorDiv.textContent = message;
    }

    clearProfileEditErrors() {
        document.querySelectorAll('#profile-edit-form .form-group').forEach(group => {
            group.classList.remove('error');
            group.querySelector('.error-message').textContent = '';
        });
    }

    setProfileEditLoading(isLoading) {
        const button = document.getElementById('save-profile-btn');
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        if (isLoading) {
            button.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
        } else {
            button.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    clearProfileEditForm() {
        document.getElementById('profile-edit-form').reset();
        document.getElementById('bmi-preview').textContent = '-';
        document.getElementById('bmi-category').textContent = '';
        this.clearProfileEditErrors();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    // Trigger Logs Modal Functions
    viewTriggerLogs() {
        this.openTriggerLogsModal();
    }

    openTriggerLogsModal() {
        document.getElementById('trigger-logs-modal').classList.add('active');
        this.loadTriggerLogs();
    }

    closeTriggerLogs() {
        document.getElementById('trigger-logs-modal').classList.remove('active');
    }

    async loadTriggerLogs() {
        try {
            if (!this.supabase) {
                // Demo mode - show demo logs
                this.showDemoTriggerLogs();
                return;
            }

            const userId = await this.getCurrentUserId();
            if (!userId) return;

            // Load trigger summary
            await this.loadTriggerSummary(userId);
            
            // Load recent logs
            await this.loadRecentTriggerLogs(userId);

        } catch (error) {
            console.error('Error loading trigger logs:', error);
            this.showDemoTriggerLogs();
        }
    }

    async loadTriggerSummary(userId) {
        try {
            // Simple summary - just count logs by action type
            const { data: logs, error } = await this.supabase
                .from('profile_audit_log')
                .select('action_type, executed_at')
                .eq('user_id', userId)
                .order('executed_at', { ascending: false });

            if (error) throw error;
            
            // Create simple summary
            const summary = {};
            logs.forEach(log => {
                if (!summary[log.action_type]) {
                    summary[log.action_type] = {
                        count: 0,
                        last_executed: log.executed_at
                    };
                }
                summary[log.action_type].count++;
            });
            
            const summaryArray = Object.keys(summary).map(action => ({
                trigger_name: action,
                execution_count: summary[action].count,
                last_executed: summary[action].last_executed,
                success_rate: 100.0
            }));
            
            this.displayTriggerSummary(summaryArray);
        } catch (error) {
            console.error('Error loading trigger summary:', error);
            this.displayTriggerSummary([]);
        }
    }

    async loadRecentTriggerLogs(userId) {
        try {
            const { data: logs, error } = await this.supabase
                .rpc('get_profile_logs', { 
                    p_user_id: userId
                });

            if (error) throw error;
            
            this.displayTriggerLogs(logs || []);
        } catch (error) {
            console.error('Error loading trigger logs:', error);
            this.displayTriggerLogs([]);
        }
    }

    displayTriggerSummary(summary) {
        const container = document.getElementById('trigger-summary');
        container.innerHTML = '';

        if (summary.length === 0) {
            container.innerHTML = '<p>No trigger executions found.</p>';
            return;
        }

        summary.forEach(trigger => {
            const item = document.createElement('div');
            item.className = 'summary-item';
            item.innerHTML = `
                <div class="trigger-info">
                    <h5>${this.formatTriggerName(trigger.trigger_name)}</h5>
                    <p>Executions: ${trigger.execution_count}</p>
                </div>
                <div class="trigger-stats">
                    <div class="stat">
                        <span class="label">Last Run:</span>
                        <span>${new Date(trigger.last_executed).toLocaleString()}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Success Rate:</span>
                        <span class="success-rate">${trigger.success_rate.toFixed(1)}%</span>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    displayTriggerLogs(logs) {
        const container = document.getElementById('trigger-logs-list');
        container.innerHTML = '';

        if (logs.length === 0) {
            container.innerHTML = '<p>No recent trigger executions found.</p>';
            return;
        }

        logs.forEach(log => {
            const item = document.createElement('div');
            item.className = 'log-item';
            
            const actionIcon = this.getActionIcon(log.action_type);
            const triggerType = this.getTriggerType(log.action_type);
            
            item.innerHTML = `
                <div class="log-header">
                    <div class="log-action">
                        <i class="fas fa-${actionIcon}"></i>
                        <span class="action-type">${log.action_type}</span>
                        <span class="trigger-type">${triggerType}</span>
                    </div>
                    <div class="log-time">${new Date(log.executed_at).toLocaleString()}</div>
                </div>
                <div class="log-details">
                    <div class="changed-fields">
                        <strong>Changed Fields:</strong>
                        ${log.changed_fields ? log.changed_fields.join(', ') : 'None'}
                    </div>
                    ${this.formatLogValues(log)}
                </div>
            `;
            container.appendChild(item);
        });
    }

    formatLogValues(log) {
        let details = '';
        
        // Format old values
        if (log.old_values && Object.keys(log.old_values).length > 0) {
            details += '<div class="log-old-values"><strong>Before:</strong><pre>' + 
                      JSON.stringify(log.old_values, null, 2) + '</pre></div>';
        }
        
        // Format new values
        if (log.new_values && Object.keys(log.new_values).length > 0) {
            details += '<div class="log-new-values"><strong>After:</strong><pre>' + 
                      JSON.stringify(log.new_values, null, 2) + '</pre></div>';
        }
        
        return details;
    }

    formatTriggerName(triggerName) {
        return triggerName
            .replace('trigger_', '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    getActionIcon(actionType) {
        switch (actionType) {
            case 'BEFORE_UPDATE': return 'exclamation-triangle';
            case 'AFTER_UPDATE': return 'calculator';
            case 'INSERT': return 'plus-circle';
            case 'UPDATE': return 'edit';
            case 'DELETE': return 'trash';
            default: return 'database';
        }
    }

    getTriggerType(actionType) {
        switch (actionType) {
            case 'BEFORE_UPDATE': return 'Validation & Logging';
            case 'AFTER_UPDATE': return 'BMI Calculation';
            default: return 'System';
        }
    }


    showDemoTriggerLogs() {
        // Demo trigger summary
        const demoSummary = [
            {
                trigger_name: 'BEFORE_UPDATE',
                execution_count: 2,
                last_executed: new Date().toISOString(),
                success_rate: 100.0
            },
            {
                trigger_name: 'AFTER_UPDATE',
                execution_count: 2,
                last_executed: new Date().toISOString(),
                success_rate: 100.0
            }
        ];
        this.displayTriggerSummary(demoSummary);

        // Demo trigger logs
        const demoLogs = [
            {
                log_id: 1,
                action_type: 'BEFORE_UPDATE',
                changed_fields: ['weight', 'height'],
                old_values: { name: 'Demo User', age: 25, height: 175, weight: 70, gender: 'Male', email: 'demo@example.com' },
                new_values: { name: 'Demo User', age: 25, height: 180, weight: 75, gender: 'Male', email: 'demo@example.com' },
                executed_at: new Date().toISOString()
            },
            {
                log_id: 2,
                action_type: 'AFTER_UPDATE',
                changed_fields: ['height', 'weight'],
                old_values: { bmi: 22.86 },
                new_values: { bmi: 23.15 },
                executed_at: new Date().toISOString()
            },
            {
                log_id: 3,
                action_type: 'BEFORE_UPDATE',
                changed_fields: ['name'],
                old_values: { name: 'Demo User', age: 25, height: 180, weight: 75, gender: 'Male', email: 'demo@example.com' },
                new_values: { name: 'Updated Demo User', age: 25, height: 180, weight: 75, gender: 'Male', email: 'demo@example.com' },
                executed_at: new Date(Date.now() - 120000).toISOString()
            }
        ];
        this.displayTriggerLogs(demoLogs);
    }

    async refreshTriggerLogs() {
        await this.loadTriggerLogs();
        this.showMessage('Trigger logs refreshed', 'success');
    }

    clearTriggerLogs() {
        // In demo mode, just clear the display
        document.getElementById('trigger-summary').innerHTML = '<p>No trigger executions found.</p>';
        document.getElementById('trigger-logs-list').innerHTML = '<p>No recent trigger executions found.</p>';
        this.showMessage('Trigger logs cleared', 'info');
    }

    exportTriggerLogs() {
        // Create CSV export of trigger logs
        const logs = document.querySelectorAll('#trigger-logs-list .log-item');
        let csvContent = 'Timestamp,Action,Trigger,Changed Fields\n';
        
        logs.forEach(log => {
            const time = log.querySelector('.log-time').textContent;
            const action = log.querySelector('.action-type').textContent;
            const trigger = log.querySelector('.trigger-type').textContent;
            const fields = log.querySelector('.changed-fields').textContent.replace('Changed Fields: ', '');
            
            csvContent += `"${time}","${action}","${trigger}","${fields}"\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trigger_logs.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showMessage('Trigger logs exported successfully', 'success');
    }

    // =============================================
    // DELETE ACCOUNT FUNCTIONALITY
    // =============================================

    async deleteAccount() {
        // Show confirmation dialog with cascade warning
        const confirmed = confirm(
            '⚠️ WARNING: DELETE ACCOUNT\n\n' +
            'This action will permanently delete your account and ALL associated data:\n\n' +
            '• Your profile information\n' +
            '• All training records and workout history\n' +
            '• All trigger audit logs\n' +
            '• Any other data linked to your account\n\n' +
            'This operation uses CASCADE DELETE and CANNOT be undone.\n\n' +
            'Are you absolutely sure you want to proceed?'
        );

        if (!confirmed) {
            return;
        }

        // Second confirmation
        const doubleConfirm = confirm(
            'FINAL CONFIRMATION\n\n' +
            'Type your confirmation: Are you 100% sure?\n\n' +
            'Click OK to permanently delete your account and all data.'
        );

        if (!doubleConfirm) {
            return;
        }

        try {
            if (!this.supabase) {
                this.showMessage('Demo mode - account deletion not available', 'info');
                return;
            }

            const userId = await this.getCurrentUserId();
            if (!userId) {
                this.showMessage('Unable to identify user', 'error');
                return;
            }

            // Delete the user profile - CASCADE will handle related data
            const { error } = await this.supabase
                .from('user_profile')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;

            this.showMessage('Account deleted successfully. Redirecting...', 'success');
            
            // Clear all session data before redirecting
            try {
                // Sign out from Supabase
                if (this.supabase) {
                    await this.supabase.auth.signOut();
                }
            } catch (signOutError) {
                console.error('Error signing out:', signOutError);
            }
            
            // Clear user session from both storage locations
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberUser');
            this.currentUser = null;
            
            // Wait a moment then redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            console.error('Error deleting account:', error);
            this.showMessage('Failed to delete account: ' + error.message, 'error');
        }
    }

    // =============================================
    // DBMS CONCEPTS DEMONSTRATION
    // =============================================

    // Normalization Demonstrations
    demonstrateNormalization() {
        const output = `
NORMALIZATION DEMONSTRATION
==========================

1NF (First Normal Form):
- Eliminates repeating groups
- Ensures atomic values
- Example: User_Profile table has atomic values for each attribute

2NF (Second Normal Form):
- Removes partial dependencies
- All non-key attributes fully depend on primary key
- Example: Training_Records(record_id, user_id, exercise_id, date, sets, reps, weight)
  - record_id is the primary key
  - All other attributes fully depend on record_id

3NF (Third Normal Form):
- Removes transitive dependencies
- No non-key attribute depends on another non-key attribute
- Example: User_Profile table is in 3NF

BCNF (Boyce-Codd Normal Form):
- Every determinant is a candidate key
- Our schema satisfies BCNF

FUNCTIONAL DEPENDENCIES:
- user_id → name, age, gender, height, weight, email
- exercise_id → exercise_name, muscle_group, equipment_id
- record_id → user_id, exercise_id, date, sets, reps, weight_used
        `;
        this.showDBMSOutput(output);
    }

    demonstrateFunctionalDependencies() {
        const output = `
FUNCTIONAL DEPENDENCIES ANALYSIS
===============================

User_Profile Table:
- user_id → name, age, gender, height, weight, email, created_at
- email → user_id (unique constraint)

Exercises Table:
- exercise_id → exercise_name, muscle_group, equipment_id, difficulty_level, instructions
- equipment_id → (from Available_Equipments table)

Training_Records Table:
- record_id → user_id, exercise_id, date, sets, reps, weight_used, duration_minutes, notes
- (user_id, exercise_id, date) → record_id (composite key candidate)

Recipes Table:
- recipe_id → recipe_name, ingredients, calories, protein, carbs, fats, prep_time_minutes, servings

Diet_Recommendation Table:
- diet_id → user_id, recipe_id, recommended_on, meal_type, status
- (user_id, recommended_on, meal_type) → diet_id (composite key candidate)

CLOSURE ANALYSIS:
- user_id+ = {user_id, name, age, gender, height, weight, email, created_at}
- exercise_id+ = {exercise_id, exercise_name, muscle_group, equipment_id, difficulty_level, instructions}
        `;
        this.showDBMSOutput(output);
    }

    demonstrateTriggers() {
        const output = `
DATABASE TRIGGERS DEMONSTRATION
==============================

1. BMI Update Trigger:
   - Trigger: trigger_update_bmi
   - Event: AFTER UPDATE OF weight, height ON User_Profile
   - Purpose: Automatically updates BMI when user weight or height changes
   - Demonstrates: Derived attributes concept

2. Training Record Validation Trigger:
   - Trigger: trigger_validate_training_record
   - Event: BEFORE INSERT OR UPDATE ON Training_Records
   - Validations:
     * User must exist
     * Exercise must exist
     * Date cannot be in the future
   - Demonstrates: Data integrity constraints

TRIGGER EXECUTION FLOW:
1. User updates weight/height → BMI trigger fires
2. User adds training record → Validation trigger fires
3. Triggers ensure data consistency and business rules
        `;
        this.showDBMSOutput(output);
    }

    demonstrateProcedures() {
        const output = `
STORED PROCEDURES DEMONSTRATION
===============================

1. get_user_workout_summary(user_id, start_date, end_date):
   - Returns: total_workouts, total_sets, total_reps, avg_weight, favorite_exercise
   - Demonstrates: Aggregation functions, GROUP BY, ORDER BY
   - SQL Operations: COUNT, SUM, AVG, JOIN

2. calculate_user_bmi(user_id):
   - Returns: BMI value (weight / (height/100)²)
   - Demonstrates: Derived attribute calculation
   - Business Logic: BMI = weight(kg) / (height(m))²

PROCEDURE BENEFITS:
- Encapsulates complex business logic
- Improves performance (compiled)
- Ensures data consistency
- Reusable across applications
        `;
        this.showDBMSOutput(output);
    }

    demonstrateQueries() {
        const output = `
COMPLEX QUERIES DEMONSTRATION
============================

1. JOIN Operations:
   - INNER JOIN: Training_Records + User_Profile + Exercises
   - LEFT JOIN: Users with their training records
   - Demonstrates: Relationship traversal

2. Aggregation Functions:
   - COUNT: Total number of records
   - SUM: Total weight lifted
   - AVG: Average weight per exercise
   - MAX/MIN: Best/worst performance

3. Subqueries:
   - Users who have trained more than average
   - Exercises with highest frequency
   - Correlated subqueries for complex analysis

4. Window Functions:
   - ROW_NUMBER(): Rank users by performance
   - RANK(): Rank exercises by popularity
   - LAG/LEAD(): Compare consecutive workouts

QUERY OPTIMIZATION:
- Indexes on foreign keys
- Composite indexes for common queries
- Query execution plans
        `;
        this.showDBMSOutput(output);
    }

    // Individual DBMS concept demonstrations
    demonstrate1NF() {
        const output = `
1NF (FIRST NORMAL FORM) DEMONSTRATION
====================================

BEFORE 1NF (Violation):
User_Profile Table:
- user_id: 1
- name: "John Doe"
- contact_info: "john@email.com, 123-456-7890, 123 Main St" (Non-atomic)

AFTER 1NF (Compliant):
User_Profile Table:
- user_id: 1
- name: "John Doe"
- email: "john@email.com"
- phone: "123-456-7890"
- address: "123 Main St"

1NF RULES:
✓ No repeating groups
✓ All values are atomic
✓ Each cell contains single value
✓ No arrays or lists in single field
        `;
        this.showDBMSOutput(output);
    }

    demonstrate2NF() {
        const output = `
2NF (SECOND NORMAL FORM) DEMONSTRATION
======================================

BEFORE 2NF (Violation):
Training_Records Table:
- record_id (PK)
- user_id (FK)
- exercise_id (FK)
- exercise_name (depends on exercise_id, not record_id)
- user_name (depends on user_id, not record_id)

AFTER 2NF (Compliant):
Training_Records Table:
- record_id (PK)
- user_id (FK)
- exercise_id (FK)
- date, sets, reps, weight_used

Separate Tables:
- User_Profile: user_id → name, age, etc.
- Exercises: exercise_id → exercise_name, muscle_group, etc.

2NF RULES:
✓ Must be in 1NF
✓ No partial dependencies
✓ All non-key attributes fully depend on primary key
        `;
        this.showDBMSOutput(output);
    }

    demonstrate3NF() {
        const output = `
3NF (THIRD NORMAL FORM) DEMONSTRATION
=====================================

BEFORE 3NF (Violation):
User_Profile Table:
- user_id (PK)
- name, age, gender
- height, weight
- bmi (depends on height and weight, not user_id)

AFTER 3NF (Compliant):
User_Profile Table:
- user_id (PK)
- name, age, gender, height, weight

BMI is calculated as derived attribute:
BMI = weight / (height/100)²

3NF RULES:
✓ Must be in 2NF
✓ No transitive dependencies
✓ Non-key attributes don't depend on other non-key attributes
        `;
        this.showDBMSOutput(output);
    }

    demonstrateBCNF() {
        const output = `
BCNF (BOYCE-CODD NORMAL FORM) DEMONSTRATION
==========================================

BCNF is stricter than 3NF:
- Every determinant must be a candidate key
- No overlapping candidate keys

OUR SCHEMA BCNF ANALYSIS:

User_Profile:
- user_id (PK) → all attributes ✓
- email (unique) → user_id ✓
- BCNF Compliant ✓

Exercises:
- exercise_id (PK) → all attributes ✓
- BCNF Compliant ✓

Training_Records:
- record_id (PK) → all attributes ✓
- BCNF Compliant ✓

BCNF RULES:
✓ Must be in 3NF
✓ Every determinant is a candidate key
✓ No overlapping candidate keys
        `;
        this.showDBMSOutput(output);
    }

    // DBMS Tab Management
    showDBMSTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.dbms-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        const targetContent = document.getElementById(`${tabName}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Add active class to tab button
        const activeBtn = document.querySelector(`[onclick="showDBMSTab('${tabName}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

	showDBMSOutput(content, title = 'DBMS Demo') {
		// Render in modal for better UX
		const safe = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		this.showModal(title, `<pre>${safe}</pre>`);
	}

	// Functional Dependencies Detailed Demos
	analyzeUserFDs() {
		const output = `USER_PROFILE FUNCTIONAL DEPENDENCIES\n===================================\n\nSchema (simplified):\nUser_Profile(user_id PK, name, age, gender, height, weight, email UNIQUE, created_at)\n\nFD Set:\n1) user_id -> name, age, gender, height, weight, email, created_at\n2) email -> user_id\n\nCandidate Keys: { user_id } and { email } (because email -> user_id and user_id is a key)\n\nNormalization:\n- 1NF: Atomic attributes ✓\n- 2NF: PK is single attribute, no partial deps ✓\n- 3NF: Non-key attrs do not transitively determine other non-key attrs ✓\n- BCNF: Every determinant (user_id, email) is a key ✓`;
		this.showDBMSOutput(output, 'Functional Dependencies: User_Profile');
	}

	analyzeTrainingFDs() {
		const output = `TRAINING_RECORDS FUNCTIONAL DEPENDENCIES\n====================================\n\nSchema (simplified):\nTraining_Records(record_id PK, user_id FK, exercise_id FK, date, sets, reps, weight_used, duration_minutes, notes)\n\nFD Set:\n1) record_id -> user_id, exercise_id, date, sets, reps, weight_used, duration_minutes, notes\n2) (user_id, exercise_id, date) -> sets, reps, weight_used, duration_minutes, notes   (business rule: one entry per day per exercise)\n\nCandidate Keys:\n- Primary key: { record_id }\n- Alternate candidate (if enforced): { user_id, exercise_id, date }\n\nNormalization: In our design, non-key attributes depend on record_id only → 3NF/BCNF ✓`;
		this.showDBMSOutput(output, 'Functional Dependencies: Training_Records');
	}

	// Trigger Simulations - Actual Implementation
	testBeforeUpdateTrigger() {
		const output = `BEFORE UPDATE TRIGGER (ACTUAL IMPLEMENTATION)
===============================================

Table: user_profile
Trigger: trigger_before_update_profile
Function: before_update_profile_trigger()
Timing: BEFORE UPDATE

Purpose: Log all field changes before profile update

What it does:
1. Compares OLD vs NEW values for each field
2. Identifies changed fields (name, email, age, gender, height, weight)
3. Logs to profile_audit_log table with:
   - action_type = 'BEFORE_UPDATE'
   - old_values = complete OLD record (JSONB)
   - new_values = complete NEW record (JSONB)
   - changed_fields = array of field names that changed

Example Log Entry:
{
  "action_type": "BEFORE_UPDATE",
  "changed_fields": ["weight", "height"],
  "old_values": {"name": "John", "weight": 70, "height": 175},
  "new_values": {"name": "John", "weight": 75, "height": 180}
}`;
		this.showDBMSOutput(output, 'Trigger: BEFORE UPDATE (Actual)');
	}

	testAfterUpdateTrigger() {
		const output = `AFTER UPDATE TRIGGER (ACTUAL IMPLEMENTATION)
==============================================

Table: user_profile
Trigger: trigger_after_update_profile
Function: after_update_profile_trigger()
Timing: AFTER UPDATE

Purpose: Calculate BMI after height/weight changes

What it does:
1. Checks if height or weight changed
2. Calculates OLD BMI: old_weight / (old_height/100)²
3. Calculates NEW BMI: new_weight / (new_height/100)²
4. Logs BMI calculation to profile_audit_log table with:
   - action_type = 'AFTER_UPDATE'
   - old_values = {"bmi": old_bmi}
   - new_values = {"bmi": new_bmi}
   - changed_fields = ["height", "weight"]

Example Log Entry:
{
  "action_type": "AFTER_UPDATE",
  "changed_fields": ["height", "weight"],
  "old_values": {"bmi": 22.86},
  "new_values": {"bmi": 23.15}
}

BMI Calculation: weight(kg) / height(m)²`;
		this.showDBMSOutput(output, 'Trigger: AFTER UPDATE (Actual)');
	}

	// Stored Procedure Demonstrations - Actual Implementation
	testCreateRecipeProcedure() {
		const output = `CREATE RECIPE PROCEDURE (ACTUAL IMPLEMENTATION)
===============================================

Function: create_recipe()
Language: PL/pgSQL
Return Type: JSON
Purpose: Create new recipes with comprehensive validation

PARAMETERS:
- p_recipe_name VARCHAR(100) - Recipe name
- p_ingredients TEXT - List of ingredients
- p_type VARCHAR(10) - 'Veg' or 'Non-Veg'
- p_time VARCHAR(20) - 'Breakfast', 'Lunch', 'Dinner', 'Snack'
- p_calories DECIMAL(8,2) - Calorie count
- p_protein DECIMAL(8,2) - Protein in grams
- p_carbs DECIMAL(8,2) - Carbs in grams
- p_fats DECIMAL(8,2) - Fats in grams
- p_prep_time_minutes INTEGER - Preparation time
- p_servings INTEGER - Number of servings
- p_instructions TEXT - Cooking instructions (optional)
- p_user_id UUID - User who created recipe (optional)

VALIDATION LOGIC:
1. Recipe name: Required, non-empty
2. Ingredients: Required, non-empty
3. Type: Must be 'Veg' or 'Non-Veg'
4. Time: Must be valid meal time
5. Nutritional values: Must be non-negative
6. Prep time & servings: Must be positive integers
7. Duplicate check: Same name for same user
8. User validation: User must exist if user_id provided

ERROR HANDLING:
- Input validation with descriptive error messages
- Exception handling for database errors
- JSON response format for frontend integration

RETURN FORMAT:
{
  "success": true/false,
  "message": "Status message",
  "recipe_id": 123,
  "recipe_name": "Recipe Name"
}

EXAMPLE CALL:
SELECT create_recipe(
    'Healthy Oatmeal Bowl',
    'Oats, Banana, Honey, Almonds, Milk',
    'Veg',
    'Breakfast',
    320.0,
    12.0,
    45.0,
    8.0,
    10,
    1,
    'Mix all ingredients and blend',
    '00000000-0000-0000-0000-000000000001'
);

EXAMPLE SUCCESS RESPONSE:
{
  "success": true,
  "message": "Recipe created successfully",
  "recipe_id": 15,
  "recipe_name": "Healthy Oatmeal Bowl"
}

EXAMPLE ERROR RESPONSE:
{
  "success": false,
  "message": "Recipe name is required",
  "recipe_id": null
}`;
		this.showDBMSOutput(output, 'Procedure: Create Recipe');
	}





    // =============================================
    // UTILITY FUNCTIONS
    // =============================================

    async getCount(tableName) {
        try {
            const { count, error } = await this.supabase
                .from(tableName)
                .select('*', { count: 'exact', head: true });

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error(`Error getting count for ${tableName}:`, error);
            return 0;
        }
    }

    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-overlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Insert at the top of the main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(messageDiv, mainContent.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Search functions
    searchUsers() {
        const searchTerm = document.getElementById('user-search').value.toLowerCase();
        const rows = document.querySelectorAll('#users-table-body tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    clearUserSearch() {
        document.getElementById('user-search').value = '';
        this.searchUsers();
    }

    filterExercises() {
        const muscleGroup = document.getElementById('muscle-group-filter').value;
        const equipment = document.getElementById('equipment-filter').value;
        const rows = document.querySelectorAll('#exercises-table-body tr');
        
        rows.forEach(row => {
            const muscleCell = row.cells[2]?.textContent || '';
            const equipmentCell = row.cells[3]?.textContent || '';
            
            const muscleMatch = !muscleGroup || muscleCell.includes(muscleGroup);
            const equipmentMatch = !equipment || equipmentCell.includes(equipment);
            
            row.style.display = muscleMatch && equipmentMatch ? '' : 'none';
        });
    }

    filterTrainingRecords() {
        const user = document.getElementById('training-user-filter').value;
        const dateFrom = document.getElementById('training-date-from').value;
        const dateTo = document.getElementById('training-date-to').value;
        const rows = document.querySelectorAll('#training-table-body tr');
        
        rows.forEach(row => {
            const userCell = row.cells[1]?.textContent || '';
            const dateCell = row.cells[3]?.textContent || '';
            
            const userMatch = !user || userCell.includes(user);
            const dateMatch = this.checkDateRange(dateCell, dateFrom, dateTo);
            
            row.style.display = userMatch && dateMatch ? '' : 'none';
        });
    }

    filterDietRecommendations() {
        const user = document.getElementById('diet-user-filter').value;
        const mealType = document.getElementById('meal-type-filter').value;
        const rows = document.querySelectorAll('#diet-table-body tr');
        
        rows.forEach(row => {
            const userCell = row.cells[1]?.textContent || '';
            const mealCell = row.cells[4]?.textContent || '';
            
            const userMatch = !user || userCell.includes(user);
            const mealMatch = !mealType || mealCell.includes(mealType);
            
            row.style.display = userMatch && mealMatch ? '' : 'none';
        });
    }

    checkDateRange(dateString, fromDate, toDate) {
        if (!fromDate && !toDate) return true;
        
        try {
            const date = new Date(dateString);
            const from = fromDate ? new Date(fromDate) : new Date('1900-01-01');
            const to = toDate ? new Date(toDate) : new Date('2100-12-31');
            
            return date >= from && date <= to;
        } catch {
            return true;
        }
    }

    searchRecipes() {
        this.applyRecipeFilters();
    }

    filterRecipes() {
        this.applyRecipeFilters();
    }


    applyRecipeFilters() {
        const searchTerm = document.getElementById('recipe-search')?.value?.toLowerCase() || '';
        const typeFilter = document.getElementById('type-filter')?.value || '';
        const mealType = document.getElementById('meal-type-filter')?.value || '';
        const recipeCards = document.querySelectorAll('#recipes-grid .recipe-card');
        
        recipeCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardType = card.dataset.type || '';
            const cardTime = card.dataset.time || '';
            
            // Check search term match
            const searchMatch = !searchTerm || cardText.includes(searchTerm);
            
            // Check type filter match
            const typeMatch = !typeFilter || cardType === typeFilter;
            
            // Check meal type match  
            const mealTypeMatch = !mealType || cardTime === mealType;
            
            // Show card only if all filters match
            const shouldShow = searchMatch && typeMatch && mealTypeMatch;
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    // =============================================
    // RECIPE CREATION FUNCTIONALITY
    // =============================================

    showCreateRecipeForm() {
        const modal = document.getElementById('recipe-modal-overlay');
        modal.classList.add('active');
        
        // Reset form
        document.getElementById('recipe-form').reset();
        
        // Focus on first input
        document.getElementById('recipe-name').focus();
    }

    closeRecipeModal() {
        const modal = document.getElementById('recipe-modal-overlay');
        modal.classList.remove('active');
        
        // Reset form
        document.getElementById('recipe-form').reset();
    }

    async createRecipe(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Add loading state
        form.classList.add('form-submitting');
        
        try {
            // Get current user ID
            const userId = await this.getCurrentUserId();

            // Prepare recipe data
            const recipeData = {
                recipe_name: formData.get('recipe_name'),
                ingredients: formData.get('ingredients'),
                type: formData.get('type'),
                time: formData.get('time'),
                calories: parseFloat(formData.get('calories')),
                protein: parseFloat(formData.get('protein')),
                carbs: parseFloat(formData.get('carbs')),
                fats: parseFloat(formData.get('fats')),
                prep_time_minutes: parseInt(formData.get('prep_time_minutes')),
                servings: parseInt(formData.get('servings')),
                instructions: formData.get('instructions') || null,
                user_id: userId
            };

            let result;
            
            if (!this.supabase) {
                // Demo mode - simulate success
                result = {
                    success: true,
                    message: 'Recipe created successfully (Demo Mode)',
                    recipe_id: Math.floor(Math.random() * 1000) + 1,
                    recipe_name: recipeData.recipe_name
                };
            } else {
                // Try stored procedure first, fallback to direct insert
                try {
                const { data, error } = await this.supabase.rpc('create_recipe', recipeData);
                
                if (error) {
                    throw new Error(error.message);
                }
                
                result = data;
                } catch (rpcError) {
                    console.warn('RPC failed, trying direct insert:', rpcError.message);
                    
                    // Fallback to direct table insert (without user_id for now)
                    const insertData = {
                        recipe_name: recipeData.recipe_name,
                        ingredients: recipeData.ingredients,
                        type: recipeData.type,
                        time: recipeData.time,
                        calories: recipeData.calories,
                        protein: recipeData.protein,
                        carbs: recipeData.carbs,
                        fats: recipeData.fats,
                        prep_time_minutes: recipeData.prep_time_minutes,
                        servings: recipeData.servings,
                        instructions: recipeData.instructions || 'No instructions provided'
                    };
                    
                    // Only add user_id if the column exists (we'll add it later)
                    // insertData.user_id = recipeData.user_id;
                    
                    const { data, error } = await this.supabase
                        .from('recipes')
                        .insert([insertData])
                        .select('recipe_id, recipe_name')
                        .single();
                    
                    if (error) {
                        throw new Error(error.message);
                    }
                    
                    result = {
                        success: true,
                        message: 'Recipe created successfully',
                        recipe_id: data.recipe_id,
                        recipe_name: data.recipe_name
                    };
                }
            }

            if (result.success) {
                this.showMessage(`Recipe "${result.recipe_name}" created successfully!`, 'success');
                this.closeRecipeModal();
                
                // Reload recipes to show the new one
                await this.loadRecipes();
            } else {
                this.showMessage(result.message || 'Failed to create recipe', 'error');
            }
            
        } catch (error) {
            console.error('Error creating recipe:', error);
            this.showMessage('Failed to create recipe: ' + error.message, 'error');
        } finally {
            // Remove loading state
            form.classList.remove('form-submitting');
        }
    }

    // Enhanced recipe display with delete functionality
    displayRecipesForUser(recipes) {
        const grid = document.getElementById('recipes-grid');
        if (!grid) return;
        
        grid.innerHTML = '';

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.dataset.type = recipe.type || '';
            card.dataset.time = recipe.time || recipe.meal_type || '';
            
            card.innerHTML = `
                <div class="recipe-header">
                    <h4>${recipe.recipe_name}</h4>
                    <div class="recipe-actions">
                        <button class="btn btn-sm btn-danger" onclick="app.deleteRecipe(${recipe.recipe_id}, '${recipe.recipe_name}')" title="Delete Recipe">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="meal-type">${recipe.time || recipe.meal_type || 'Meal'}</div>
                <div class="ingredients">${recipe.ingredients}</div>
                <div class="nutrition-info">
                    <div class="nutrition-item">
                        <span>Calories:</span>
                        <span>${recipe.calories}</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Protein:</span>
                        <span>${recipe.protein}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Carbs:</span>
                        <span>${recipe.carbs}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Fats:</span>
                        <span>${recipe.fats}g</span>
                    </div>
                </div>
                <div class="prep-time">Prep: ${recipe.prep_time_minutes} min • Serves: ${recipe.servings}</div>
                ${recipe.instructions ? `<div class="instructions">${recipe.instructions}</div>` : ''}
            `;
            grid.appendChild(card);
        });
    }

    async deleteRecipe(recipeId, recipeName) {
        if (!confirm(`Are you sure you want to delete the recipe "${recipeName}"?`)) {
            return;
        }

        try {
            if (!this.supabase) {
                this.showMessage('Demo mode - recipe not actually deleted', 'info');
                return;
            }

            const { error } = await this.supabase
                .from('recipes')
                .delete()
                .eq('recipe_id', recipeId);

            if (error) {
                throw new Error(error.message);
            }

            this.showMessage(`Recipe "${recipeName}" deleted successfully!`, 'success');
            
            // Reload recipes
            await this.loadRecipes();
            
        } catch (error) {
            console.error('Error deleting recipe:', error);
            this.showMessage('Failed to delete recipe: ' + error.message, 'error');
        }
    }

    // Join functionality methods
    async executeJoin() {
        const joinSelect = document.getElementById('join-select');
        const joinType = joinSelect.value;
        
        if (!joinType) {
            this.updateJoinDescription('Please select a join type from the dropdown.');
            return;
        }

        this.hideJoinResults();

        try {
            const results = await this.performJoin(joinType);
            this.displayJoinResults(results, joinType);
        } catch (error) {
            console.error('Join execution error:', error);
            this.showMessage('Failed to execute join query', 'error');
        }
    }

    async performJoin(joinType) {
        if (!this.supabase) {
            throw new Error('Supabase client not available');
        }

        try {
            switch (joinType) {
                case '1': // User Workout History
                    return await this.getUserWorkoutHistory();
                case '2': // Exercise Details with Equipment
                    return await this.getExerciseEquipmentDetails();
                case '3': // Complete Workout Details
                    return await this.getCompleteWorkoutDetails();
                case '4': // User Diet Recommendations
                    return await this.getUserDietRecommendations();
                case '5': // Complete Diet Details
                    return await this.getCompleteDietDetails();
                case '6': // All Users with Workouts (LEFT JOIN)
                    return await this.getAllUsersWithWorkouts();
                case '7': // Exercise Popularity Analysis
                    return await this.getExercisePopularityAnalysis();
                case '8': // Complete Workout with Equipment
                    return await this.getCompleteWorkoutWithEquipment();
                default:
                    throw new Error('Invalid join type');
            }
        } catch (error) {
            console.error('Join execution error:', error);
            throw error;
        }
    }

    // Individual join methods using Supabase client
    async getUserWorkoutHistory() {
        const userId = await this.getCurrentUserId();
        
        const { data: user, error: userError } = await this.supabase
            .from('user_profile')
            .select('user_id, name, email')
            .eq('user_id', userId)
            .single();

        if (userError) throw userError;

        const { data: workouts, error: workoutError } = await this.supabase
            .from('training_records')
            .select('record_id, user_id, date, sets, reps, weight_used, duration_minutes, notes')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(50);

        if (workoutError) throw workoutError;

        // Join the data manually
        return workouts.map(workout => {
            return {
                user_id: workout.user_id,
                name: user?.name || 'Unknown',
                email: user?.email || 'N/A',
                record_id: workout.record_id,
                date: workout.date,
                sets: workout.sets,
                reps: workout.reps,
                weight_used: workout.weight_used,
                duration_minutes: workout.duration_minutes,
                notes: workout.notes
            };
        });
    }

    async getExerciseEquipmentDetails() {
        const { data: exercises, error: exerciseError } = await this.supabase
            .from('exercises')
            .select('exercise_id, exercise_name, muscle_group, difficulty_level, equipment_id, instructions');

        if (exerciseError) throw exerciseError;

        const { data: equipment, error: equipmentError } = await this.supabase
            .from('available_equipments')
            .select('equipment_id, equipment_name, equipment_type');

        if (equipmentError) throw equipmentError;

        // Join the data manually
        return exercises.map(exercise => {
            const equip = equipment.find(e => e.equipment_id === exercise.equipment_id);
            return {
                exercise_id: exercise.exercise_id,
                exercise_name: exercise.exercise_name,
                muscle_group: exercise.muscle_group,
                difficulty_level: exercise.difficulty_level,
                equipment_id: exercise.equipment_id,
                equipment_name: equip?.equipment_name || 'Unknown',
                equipment_type: equip?.equipment_type || 'N/A',
                instructions: exercise.instructions
            };
        });
    }

    async getCompleteWorkoutDetails() {
        const userId = await this.getCurrentUserId();
        
        const { data: workouts, error: workoutError } = await this.supabase
            .from('training_records')
            .select('record_id, user_id, exercise_id, date, sets, reps, weight_used, duration_minutes, notes')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(50);

        if (workoutError) throw workoutError;

        const { data: user, error: userError } = await this.supabase
            .from('user_profile')
            .select('user_id, name, email')
            .eq('user_id', userId)
            .single();

        if (userError) throw userError;

        const { data: exercises, error: exerciseError } = await this.supabase
            .from('exercises')
            .select('exercise_id, exercise_name, muscle_group, difficulty_level');

        if (exerciseError) throw exerciseError;

        // Join the data manually
        return workouts.map(workout => {
            const exercise = exercises.find(e => e.exercise_id === workout.exercise_id);
            return {
                record_id: workout.record_id,
                user_id: workout.user_id,
                user_name: user?.name || 'Unknown',
                email: user?.email || 'N/A',
                exercise_id: workout.exercise_id,
                exercise_name: exercise?.exercise_name || 'Unknown',
                muscle_group: exercise?.muscle_group || 'N/A',
                difficulty_level: exercise?.difficulty_level || 'N/A',
                date: workout.date,
                sets: workout.sets,
                reps: workout.reps,
                weight_used: workout.weight_used,
                duration_minutes: workout.duration_minutes,
                notes: workout.notes
            };
        });
    }

    async getUserDietRecommendations() {
        const userId = await this.getCurrentUserId();
        
        const { data: user, error: userError } = await this.supabase
            .from('user_profile')
            .select('user_id, name, email')
            .eq('user_id', userId)
            .single();

        if (userError) throw userError;

        const { data: diets, error: dietError } = await this.supabase
            .from('diet_recommendation')
            .select('diet_id, user_id, recommended_on, meal_type, status, created_at')
            .eq('user_id', userId)
            .order('recommended_on', { ascending: false })
            .limit(50);

        if (dietError) throw dietError;

        // Join the data manually
        return diets.map(diet => {
            return {
                user_id: diet.user_id,
                name: user?.name || 'Unknown',
                email: user?.email || 'N/A',
                diet_id: diet.diet_id,
                recommended_on: diet.recommended_on,
                meal_type: diet.meal_type,
                status: diet.status,
                created_at: diet.created_at
            };
        });
    }

    async getCompleteDietDetails() {
        const userId = await this.getCurrentUserId();
        
        const { data: diets, error: dietError } = await this.supabase
            .from('diet_recommendation')
            .select('diet_id, user_id, recipe_id, recommended_on, meal_type, status')
            .eq('user_id', userId)
            .order('recommended_on', { ascending: false })
            .limit(50);

        if (dietError) throw dietError;

        const { data: user, error: userError } = await this.supabase
            .from('user_profile')
            .select('user_id, name, email')
            .eq('user_id', userId)
            .single();

        if (userError) throw userError;

        const { data: recipes, error: recipeError } = await this.supabase
            .from('recipes')
            .select('recipe_id, recipe_name, ingredients, calories, protein, carbs, fats, prep_time_minutes, servings');

        if (recipeError) throw recipeError;

        // Join the data manually
        return diets.map(diet => {
            const recipe = recipes.find(r => r.recipe_id === diet.recipe_id);
            return {
                diet_id: diet.diet_id,
                user_id: diet.user_id,
                user_name: user?.name || 'Unknown',
                email: user?.email || 'N/A',
                recipe_id: diet.recipe_id,
                recipe_name: recipe?.recipe_name || 'Unknown',
                ingredients: recipe?.ingredients || 'N/A',
                calories: recipe?.calories || 0,
                protein: recipe?.protein || 0,
                carbs: recipe?.carbs || 0,
                fats: recipe?.fats || 0,
                prep_time_minutes: recipe?.prep_time_minutes || 0,
                servings: recipe?.servings || 0,
                recommended_on: diet.recommended_on,
                meal_type: diet.meal_type,
                status: diet.status
            };
        });
    }

    async getAllUsersWithWorkouts() {
        const { data: users, error: userError } = await this.supabase
            .from('user_profile')
            .select('user_id, name, email, age, gender');

        if (userError) throw userError;

        const { data: workouts, error: workoutError } = await this.supabase
            .from('training_records')
            .select('user_id, record_id, date, sets, reps, weight_used');

        if (workoutError) throw workoutError;

        // Group workouts by user and calculate statistics
        const userStats = {};
        workouts.forEach(workout => {
            if (!userStats[workout.user_id]) {
                userStats[workout.user_id] = {
                    total_workouts: 0,
                    total_reps: 0,
                    total_weight: 0,
                    dates: []
                };
            }
            userStats[workout.user_id].total_workouts++;
            userStats[workout.user_id].total_reps += (workout.sets || 0) * (workout.reps || 0);
            userStats[workout.user_id].total_weight += workout.weight_used || 0;
            userStats[workout.user_id].dates.push(workout.date);
        });

        // Join user data with statistics
        return users.map(user => {
            const stats = userStats[user.user_id] || {
                total_workouts: 0,
                total_reps: 0,
                total_weight: 0,
                dates: []
            };
            
            return {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                total_workouts: stats.total_workouts,
                last_workout: stats.dates.length > 0 ? Math.max(...stats.dates) : null,
                first_workout: stats.dates.length > 0 ? Math.min(...stats.dates) : null,
                total_reps: stats.total_reps,
                avg_weight: stats.total_workouts > 0 ? (stats.total_weight / stats.total_workouts).toFixed(2) : 0
            };
        }).sort((a, b) => b.total_workouts - a.total_workouts);
    }

    async getExercisePopularityAnalysis() {
        const { data: exercises, error: exerciseError } = await this.supabase
            .from('exercises')
            .select('exercise_id, exercise_name, muscle_group, difficulty_level');

        if (exerciseError) throw exerciseError;

        const { data: workouts, error: workoutError } = await this.supabase
            .from('training_records')
            .select('exercise_id, user_id, sets, reps, weight_used');

        if (workoutError) throw workoutError;

        // Group workouts by exercise and calculate statistics
        const exerciseStats = {};
        workouts.forEach(workout => {
            if (!exerciseStats[workout.exercise_id]) {
                exerciseStats[workout.exercise_id] = {
                    times_performed: 0,
                    unique_users: new Set(),
                    total_weight: 0,
                    total_reps: 0
                };
            }
            exerciseStats[workout.exercise_id].times_performed++;
            exerciseStats[workout.exercise_id].unique_users.add(workout.user_id);
            exerciseStats[workout.exercise_id].total_weight += workout.weight_used || 0;
            exerciseStats[workout.exercise_id].total_reps += (workout.sets || 0) * (workout.reps || 0);
        });

        // Join exercise data with statistics
        return exercises.map(exercise => {
            const stats = exerciseStats[exercise.exercise_id] || {
                times_performed: 0,
                unique_users: new Set(),
                total_weight: 0,
                total_reps: 0
            };
            
            return {
                exercise_id: exercise.exercise_id,
                exercise_name: exercise.exercise_name,
                muscle_group: exercise.muscle_group,
                difficulty_level: exercise.difficulty_level,
                times_performed: stats.times_performed,
                unique_users: stats.unique_users.size,
                avg_weight: stats.times_performed > 0 ? (stats.total_weight / stats.times_performed).toFixed(2) : 0,
                total_reps: stats.total_reps
            };
        }).sort((a, b) => b.times_performed - a.times_performed);
    }

    async getCompleteWorkoutWithEquipment() {
        const userId = await this.getCurrentUserId();
        
        const { data: workouts, error: workoutError } = await this.supabase
            .from('training_records')
            .select('record_id, user_id, exercise_id, date, sets, reps, weight_used, duration_minutes, notes')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(50);

        if (workoutError) throw workoutError;

        const { data: user, error: userError } = await this.supabase
            .from('user_profile')
            .select('user_id, name, email')
            .eq('user_id', userId)
            .single();

        if (userError) throw userError;

        const { data: exercises, error: exerciseError } = await this.supabase
            .from('exercises')
            .select('exercise_id, exercise_name, muscle_group, difficulty_level, equipment_id');

        if (exerciseError) throw exerciseError;

        const { data: equipment, error: equipmentError } = await this.supabase
            .from('available_equipments')
            .select('equipment_id, equipment_name, equipment_type');

        if (equipmentError) throw equipmentError;

        // Join the data manually
        return workouts.map(workout => {
            const exercise = exercises.find(e => e.exercise_id === workout.exercise_id);
            const equip = equipment.find(eq => eq.equipment_id === exercise?.equipment_id);
            
            return {
                record_id: workout.record_id,
                user_id: workout.user_id,
                user_name: user?.name || 'Unknown',
                email: user?.email || 'N/A',
                exercise_id: workout.exercise_id,
                exercise_name: exercise?.exercise_name || 'Unknown',
                muscle_group: exercise?.muscle_group || 'N/A',
                difficulty_level: exercise?.difficulty_level || 'N/A',
                equipment_id: exercise?.equipment_id || 0,
                equipment_name: equip?.equipment_name || 'Unknown',
                equipment_type: equip?.equipment_type || 'N/A',
                date: workout.date,
                sets: workout.sets,
                reps: workout.reps,
                weight_used: workout.weight_used,
                duration_minutes: workout.duration_minutes,
                notes: workout.notes
            };
        });
    }

    displayJoinResults(results, joinType) {
        const joinTitles = {
            '1': 'User Workout History',
            '2': 'Exercise Details with Equipment',
            '3': 'Complete Workout Details',
            '4': 'User Diet Recommendations',
            '5': 'Complete Diet Details',
            '6': 'All Users with Workouts (LEFT JOIN)',
            '7': 'Exercise Popularity Analysis',
            '8': 'Complete Workout with Equipment'
        };

        const joinDescriptions = {
            '1': 'Shows all workouts for users with their personal details.',
            '2': 'Displays exercise information along with required equipment details.',
            '3': 'Complete workout information including user and exercise names.',
            '4': 'Shows meal recommendations for users.',
            '5': 'Detailed meal recommendations with recipe information.',
            '6': 'Shows all users including those who haven\'t worked out yet.',
            '7': 'Analyzes how popular each exercise is among users.',
            '8': 'Complete workout details including equipment information.'
        };

        // Update description
        this.updateJoinDescription(joinDescriptions[joinType]);

        // Show results
        const container = document.getElementById('results-table-container');
        const title = document.getElementById('join-title');
        const thead = document.getElementById('results-thead');
        const tbody = document.getElementById('results-tbody');
        const count = document.getElementById('results-count');

        title.textContent = joinTitles[joinType];
        count.textContent = `${results.length} results`;

        // Clear previous results
        thead.innerHTML = '';
        tbody.innerHTML = '';

        if (results.length === 0) {
            tbody.innerHTML = '<tr><td colspan="100%" style="text-align: center; padding: 20px;">No results found</td></tr>';
            container.style.display = 'block';
            return;
        }

        // Create table headers
        const headers = Object.keys(results[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.replace(/_/g, ' ').toUpperCase();
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create table rows
        results.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                const value = row[header];
                td.textContent = value === null ? 'N/A' : value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        container.style.display = 'block';
    }

    updateJoinDescription(description) {
        const descElement = document.getElementById('join-description');
        if (descElement) {
            descElement.innerHTML = `<p>${description}</p>`;
            descElement.style.display = description ? 'block' : 'none';
        }
    }


    hideJoinResults() {
        const container = document.getElementById('results-table-container');
        if (container) container.style.display = 'none';
        const descElement = document.getElementById('join-description');
        if (descElement) descElement.style.display = 'none';
    }

    exportJoinResults() {
        const table = document.getElementById('results-table');
        if (!table) return;

        const rows = Array.from(table.querySelectorAll('tr'));
        const csvContent = rows.map(row => 
            Array.from(row.querySelectorAll('th, td')).map(cell => 
                `"${cell.textContent.replace(/"/g, '""')}"`
            ).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'join_results.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    clearJoinResults() {
        const container = document.getElementById('results-table-container');
        const thead = document.getElementById('results-thead');
        const tbody = document.getElementById('results-tbody');
        const count = document.getElementById('results-count');
        
        if (container) container.style.display = 'none';
        if (thead) thead.innerHTML = '';
        if (tbody) tbody.innerHTML = '';
        if (count) count.textContent = '0 results';
        
        const select = document.getElementById('join-select');
        if (select) select.value = '';
        
        this.updateJoinDescription('Select a join type from the dropdown to see the results.');
    }
}

// Global functions for HTML onclick handlers
function demonstrateNormalization() {
    app.demonstrateNormalization();
}

function demonstrateFunctionalDependencies() {
    app.demonstrateFunctionalDependencies();
}

function demonstrateTriggers() {
    app.demonstrateTriggers();
}

function demonstrateProcedures() {
    app.demonstrateProcedures();
}

function demonstrateQueries() {
    app.demonstrateQueries();
}

function demonstrate1NF() {
    app.demonstrate1NF();
}

function demonstrate2NF() {
    app.demonstrate2NF();
}

function demonstrate3NF() {
    app.demonstrate3NF();
}

function demonstrateBCNF() {
    app.demonstrateBCNF();
}

// DBMS detailed demo handlers
function analyzeUserFDs() {
	app.analyzeUserFDs();
}

function analyzeTrainingFDs() {
	app.analyzeTrainingFDs();
}

function testBeforeUpdateTrigger() {
	app.testBeforeUpdateTrigger();
}

function testAfterUpdateTrigger() {
	app.testAfterUpdateTrigger();
}

function testCreateRecipeProcedure() {
	app.testCreateRecipeProcedure();
}

function showDBMSTab(tabName) {
    app.showDBMSTab(tabName);
}

function closeModal() {
    app.closeModal();
}

function searchRecipes() {
    app.searchRecipes();
}

function filterRecipes() {
    app.filterRecipes();
}

// Join functionality
function executeJoin() {
    app.executeJoin();
}

function exportJoinResults() {
    app.exportJoinResults();
}

function clearJoinResults() {
    app.clearJoinResults();
}

// Recipe modal functions
function closeRecipeModal() {
    app.closeRecipeModal();
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WorkoutPlanner();
});


