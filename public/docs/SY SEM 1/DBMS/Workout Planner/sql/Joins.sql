-- =============================================
-- 1. USER WORKOUT HISTORY
-- Tables: user_profile + training_records
-- Purpose: Show all workouts for a specific user
-- =============================================
SELECT 
    u.user_id,
    u.name,
    u.email,
    tr.record_id,
    tr.date,
    tr.sets,
    tr.reps,
    tr.weight_used,
    tr.duration_minutes,
    tr.notes
FROM user_profile u
INNER JOIN training_records tr ON u.user_id = tr.user_id
ORDER BY tr.date DESC;

-- =============================================
-- 2. EXERCISE DETAILS WITH EQUIPMENT
-- Tables: exercises + available_equipments
-- Purpose: Show exercise information with required equipment
-- =============================================
SELECT 
    e.exercise_id,
    e.exercise_name,
    e.muscle_group,
    e.difficulty_level,
    eq.equipment_id,
    eq.equipment_name,
    eq.equipment_type,
    e.instructions
FROM exercises e
INNER JOIN available_equipments eq ON e.equipment_id = eq.equipment_id
ORDER BY e.muscle_group, e.exercise_name;

-- =============================================
-- 3. COMPLETE WORKOUT DETAILS
-- Tables: training_records + user_profile + exercises
-- Purpose: Show detailed workout information with user and exercise names
-- =============================================
SELECT 
    tr.record_id,
    u.user_id,
    u.name as user_name,
    u.email,
    e.exercise_id,
    e.exercise_name,
    e.muscle_group,
    e.difficulty_level,
    tr.date,
    tr.sets,
    tr.reps,
    tr.weight_used,
    tr.duration_minutes,
    tr.notes
FROM training_records tr
INNER JOIN user_profile u ON tr.user_id = u.user_id
INNER JOIN exercises e ON tr.exercise_id = e.exercise_id
ORDER BY tr.date DESC, u.name;

-- =============================================
-- 7. EXERCISE POPULARITY ANALYSIS
-- Tables: exercises + training_records
-- Purpose: Show how popular each exercise is among users
-- =============================================
SELECT 
    e.exercise_id,
    e.exercise_name,
    e.muscle_group,
    e.difficulty_level,
    COUNT(tr.record_id) as times_performed,
    COUNT(DISTINCT tr.user_id) as unique_users,
    AVG(tr.weight_used) as avg_weight,
    SUM(tr.sets * tr.reps) as total_reps
FROM exercises e
LEFT JOIN training_records tr ON e.exercise_id = tr.exercise_id
GROUP BY e.exercise_id, e.exercise_name, e.muscle_group, e.difficulty_level
ORDER BY times_performed DESC;

-- =============================================
-- 8. COMPLETE WORKOUT WITH EQUIPMENT
-- Tables: training_records + user_profile + exercises + available_equipments
-- Purpose: Show complete workout details including equipment information
-- =============================================
SELECT 
    tr.record_id,
    u.user_id,
    u.name as user_name,
    u.email,
    e.exercise_id,
    e.exercise_name,
    e.muscle_group,
    e.difficulty_level,
    eq.equipment_id,
    eq.equipment_name,
    eq.equipment_type,
    tr.date,
    tr.sets,
    tr.reps,
    tr.weight_used,
    tr.duration_minutes,
    tr.notes
FROM training_records tr
INNER JOIN user_profile u ON tr.user_id = u.user_id
INNER JOIN exercises e ON tr.exercise_id = e.exercise_id
INNER JOIN available_equipments eq ON e.equipment_id = eq.equipment_id
ORDER BY tr.date DESC, u.name;