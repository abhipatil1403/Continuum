-- =============================================
-- 1. View using COUNT - Count training records per user
-- Used in admin dashboard for set functions analytics
-- =============================================
CREATE OR REPLACE VIEW view_set_count AS
SELECT 
    up.name as user_name,
    COUNT(tr.record_id) as total_workouts,
    COUNT(DISTINCT tr.exercise_id) as unique_exercises
FROM user_profile up
LEFT JOIN training_records tr ON up.user_id = tr.user_id
GROUP BY up.user_id, up.name
HAVING COUNT(tr.record_id) > 0
ORDER BY total_workouts DESC;

-- =============================================
-- 2. View using SUM - Total sets and reps per user
-- Used in admin dashboard for set functions analytics
-- =============================================
CREATE OR REPLACE VIEW view_set_sum AS
SELECT 
    up.name as user_name,
    SUM(tr.sets) as total_sets,
    SUM(tr.reps) as total_reps,
    SUM(tr.duration_minutes) as total_duration_minutes
FROM user_profile up
JOIN training_records tr ON up.user_id = tr.user_id
GROUP BY up.user_id, up.name
ORDER BY total_sets DESC;

-- =============================================
-- 3. View using AVG - Average performance metrics
-- Used in admin dashboard for set functions analytics
-- =============================================
CREATE OR REPLACE VIEW view_set_avg AS
SELECT 
    e.exercise_name,
    e.muscle_group,
    ROUND(AVG(tr.sets), 2) as avg_sets,
    ROUND(AVG(tr.reps), 2) as avg_reps,
    ROUND(AVG(tr.weight_used), 2) as avg_weight,
    ROUND(AVG(tr.duration_minutes), 2) as avg_duration
FROM exercises e
JOIN training_records tr ON e.exercise_id = tr.exercise_id
GROUP BY e.exercise_id, e.exercise_name, e.muscle_group
HAVING COUNT(tr.record_id) >= 1
ORDER BY avg_weight DESC;

-- =============================================
-- 4. View using MAX and MIN - Performance ranges
-- Used in admin dashboard for set functions analytics
-- =============================================
CREATE OR REPLACE VIEW view_set_max_min AS
SELECT 
    e.exercise_name,
    MIN(tr.weight_used) as min_weight,
    MAX(tr.weight_used) as max_weight,
    MIN(tr.sets) as min_sets,
    MAX(tr.sets) as max_sets,
    MIN(tr.reps) as min_reps,
    MAX(tr.reps) as max_reps
FROM exercises e
JOIN training_records tr ON e.exercise_id = tr.exercise_id
WHERE tr.weight_used IS NOT NULL
GROUP BY e.exercise_id, e.exercise_name
ORDER BY max_weight DESC;

-- =============================================
-- 5. View showing muscle group statistics
-- Used in admin dashboard for muscle groups chart
-- =============================================
CREATE OR REPLACE VIEW view_set_muscle_group_stats AS
SELECT 
    e.muscle_group,
    COUNT(DISTINCT e.exercise_id) as exercise_count,
    COUNT(tr.record_id) as total_workouts,
    ROUND(AVG(tr.sets), 2) as avg_sets,
    ROUND(AVG(tr.reps), 2) as avg_reps,
    SUM(tr.duration_minutes) as total_minutes
FROM exercises e
LEFT JOIN training_records tr ON e.exercise_id = tr.exercise_id
GROUP BY e.muscle_group
HAVING COUNT(tr.record_id) > 0
ORDER BY total_workouts DESC;