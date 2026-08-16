-- =============================================
-- AGGREGATION FUNCTIONS VIEW
-- =============================================
-- DBMS Concept: Aggregation Functions (COUNT, SUM, AVG, MAX, MIN)
-- Purpose: Provide a unified view of user workout statistics
-- =============================================

CREATE OR REPLACE VIEW view_set_combined AS
SELECT 
    up.user_id,
    up.name as user_name,
    up.email,
    -- COUNT aggregations
    COUNT(DISTINCT tr.record_id) as total_workouts,
    COUNT(DISTINCT tr.exercise_id) as unique_exercises,
    COUNT(DISTINCT tr.date) as unique_workout_dates,
    -- SUM aggregations
    COALESCE(SUM(tr.sets), 0) as total_sets,
    COALESCE(SUM(tr.reps), 0) as total_reps,
    COALESCE(SUM(tr.duration_minutes), 0) as total_duration_minutes,
    COALESCE(SUM(tr.weight_used * tr.sets), 0) as total_volume,
    -- AVG aggregations
    ROUND(AVG(tr.sets), 2) as avg_sets,
    ROUND(AVG(tr.reps), 2) as avg_reps,
    ROUND(AVG(tr.weight_used), 2) as avg_weight,
    ROUND(AVG(tr.duration_minutes), 2) as avg_duration,
    -- MIN aggregations
    MIN(tr.weight_used) as min_weight,
    MIN(tr.sets) as min_sets,
    MIN(tr.reps) as min_reps,
    MIN(tr.date) as first_workout_date,
    -- MAX aggregations
    MAX(tr.weight_used) as max_weight,
    MAX(tr.sets) as max_sets,
    MAX(tr.reps) as max_reps,
    MAX(tr.date) as last_workout_date
FROM user_profile up
LEFT JOIN training_records tr ON up.user_id = tr.user_id
GROUP BY up.user_id, up.name, up.email
HAVING COUNT(tr.record_id) > 0
ORDER BY total_workouts DESC, user_name;