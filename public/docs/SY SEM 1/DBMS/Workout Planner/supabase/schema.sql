-- Workout Planner Database Schema
-- Demonstrates DBMS concepts: Normalization, Functional Dependencies, Normal Forms

-- =============================================
-- 1. USER_PROFILE Entity (Strong Entity)
-- =============================================
CREATE TABLE user_profile (
    user_id UUID PRIMARY KEY, -- Changed to UUID for Supabase Auth compatibility
    name VARCHAR(100) NOT NULL,
    age INTEGER CHECK (age > 0 AND age < 120),
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    height DECIMAL(5,2) CHECK (height > 0), -- in cm
    weight DECIMAL(5,2) CHECK (weight > 0), -- in kg
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. AVAILABLE_EQUIPMENTS Entity (Strong Entity)
-- =============================================
CREATE TABLE available_equipments (
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(100) NOT NULL UNIQUE,
    equipment_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. EXERCISES Entity (Strong Entity)
-- =============================================
CREATE TABLE exercises (
    exercise_id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(100) NOT NULL,
    muscle_group VARCHAR(50) NOT NULL,
    equipment_id INTEGER REFERENCES available_equipments(equipment_id) ON DELETE CASCADE,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. TRAINING_RECORDS Entity (Strong Entity)
-- =============================================
CREATE TABLE training_records (
    record_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profile(user_id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    sets INTEGER CHECK (sets > 0),
    reps INTEGER CHECK (reps > 0),
    weight_used DECIMAL(5,2) CHECK (weight_used >= 0),
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5. RECIPES Entity (Strong Entity)
-- =============================================
CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(100) NOT NULL,
    ingredients TEXT NOT NULL, -- Multivalued attribute stored as text
    type VARCHAR(10) CHECK (type IN ('Veg', 'Non-Veg')),
    time VARCHAR(20) CHECK (time IN ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
    calories DECIMAL(8,2) CHECK (calories >= 0),
    protein DECIMAL(8,2) CHECK (protein >= 0),
    carbs DECIMAL(8,2) CHECK (carbs >= 0),
    fats DECIMAL(8,2) CHECK (fats >= 0),
    prep_time_minutes INTEGER CHECK (prep_time_minutes > 0),
    servings INTEGER CHECK (servings > 0),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 6. DIET_RECOMMENDATION Entity (Strong Entity)
-- =============================================
CREATE TABLE diet_recommendation (
    diet_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profile(user_id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    recommended_on DATE NOT NULL,
    meal_type VARCHAR(20) CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Skipped')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. USER_SIGNUP_LOG Entity (Audit Table)
-- =============================================
-- Captures successful signup events for audit trail
CREATE TABLE IF NOT EXISTS user_signup_log (
    log_id SERIAL PRIMARY KEY,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES user_profile(user_id) ON DELETE CASCADE,
    email VARCHAR(100),
    action VARCHAR(50) NOT NULL DEFAULT 'signup',
    status VARCHAR(20) NOT NULL,
    message TEXT
);

-- =============================================
-- TRIGGERS for DBMS Concepts Demonstration
-- =============================================

-- Trigger 1: Update user's BMI when weight or height changes
CREATE OR REPLACE FUNCTION update_bmi()
RETURNS TRIGGER AS $$
BEGIN
    -- This demonstrates derived attributes concept
    -- BMI = weight(kg) / (height(m))^2
    -- We'll store this in a separate table or calculate on-the-fly
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bmi
    AFTER UPDATE OF weight, height ON user_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_bmi();

-- Trigger 2: Validate training record consistency
CREATE OR REPLACE FUNCTION validate_training_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM user_profile WHERE user_id = NEW.user_id) THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;
    
    -- Check if exercise exists
    IF NOT EXISTS (SELECT 1 FROM exercises WHERE exercise_id = NEW.exercise_id) THEN
        RAISE EXCEPTION 'Exercise does not exist';
    END IF;
    
    -- Check if date is not in the future
    IF NEW.date > CURRENT_DATE THEN
        RAISE EXCEPTION 'Training date cannot be in the future';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_training_record
    BEFORE INSERT OR UPDATE ON training_records
    FOR EACH ROW
    EXECUTE FUNCTION validate_training_record();

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert sample equipment
INSERT INTO available_equipments (equipment_name, equipment_type) VALUES
('Dumbbells', 'Free Weights'),
('Barbell', 'Free Weights'),
('Bench Press', 'Machines'),
('Pull-up Bar', 'Bodyweight'),
('Resistance Bands', 'Accessories'),
('Kettlebell', 'Free Weights'),
('Treadmill', 'Cardio'),
('Stationary Bike', 'Cardio');

-- Insert sample exercises
INSERT INTO exercises (exercise_name, muscle_group, equipment_id, difficulty_level, instructions) VALUES
('Bench Press', 'Chest', 3, 'Intermediate', 'Lie on bench, lower bar to chest, press up'),
('Squats', 'Legs', 2, 'Beginner', 'Stand with feet shoulder-width apart, lower down'),
('Pull-ups', 'Back', 4, 'Advanced', 'Hang from bar, pull body up until chin over bar'),
('Bicep Curls', 'Arms', 1, 'Beginner', 'Hold dumbbells, curl up with biceps'),
('Deadlifts', 'Back', 2, 'Advanced', 'Lift barbell from ground to hip level'),
('Push-ups', 'Chest', 4, 'Beginner', 'Lower body to ground, push back up'),
('Lunges', 'Legs', 1, 'Beginner', 'Step forward, lower back knee to ground'),
('Shoulder Press', 'Shoulders', 1, 'Intermediate', 'Press dumbbells overhead');

-- Insert sample recipes
INSERT INTO recipes (recipe_name, ingredients, type, time, calories, protein, carbs, fats, prep_time_minutes, servings, instructions) VALUES
('Protein Smoothie', 'Banana, Protein Powder, Milk, Berries', 'Veg', 'Breakfast', 350.0, 25.0, 30.0, 8.0, 5, 1, 'Blend all ingredients until smooth'),
('Grilled Chicken Breast', 'Chicken Breast, Olive Oil, Herbs', 'Non-Veg', 'Lunch', 250.0, 35.0, 0.0, 12.0, 20, 1, 'Season and grill chicken until cooked'),
('Quinoa Bowl', 'Quinoa, Vegetables, Chickpeas, Tahini', 'Veg', 'Lunch', 400.0, 15.0, 45.0, 12.0, 25, 1, 'Cook quinoa, mix with vegetables and dressing'),
('Greek Yogurt Parfait', 'Greek Yogurt, Granola, Honey, Berries', 'Veg', 'Snack', 280.0, 20.0, 35.0, 6.0, 10, 1, 'Layer yogurt, granola, and berries'),
('Salmon with Sweet Potato', 'Salmon, Sweet Potato, Broccoli, Lemon', 'Non-Veg', 'Dinner', 450.0, 30.0, 35.0, 18.0, 30, 1, 'Bake salmon and sweet potato, steam broccoli');