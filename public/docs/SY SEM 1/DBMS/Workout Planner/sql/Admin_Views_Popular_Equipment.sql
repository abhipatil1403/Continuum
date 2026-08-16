-- =============================================
-- POPULAR EQUIPMENT VIEW
-- =============================================
-- DBMS Concept: Aggregation with JOINs
-- Purpose: Show equipment popularity based on usage in training records
-- =============================================

CREATE OR REPLACE VIEW popular_equipment AS
SELECT 
    ae.equipment_id,
    ae.equipment_name,
    ae.equipment_type,
    -- Count exercises using this equipment
    COUNT(DISTINCT e.exercise_id) as exercise_count,
    -- Count total workouts using this equipment
    COUNT(tr.record_id) as total_workouts,
    -- Count unique users who used this equipment
    COUNT(DISTINCT tr.user_id) as unique_users,
    -- Calculate total reps performed with this equipment
    COALESCE(SUM(tr.sets * tr.reps), 0) as total_reps,
    -- Calculate average weight used
    ROUND(AVG(tr.weight_used), 2) as avg_weight_used,
    -- Calculate total volume (weight * sets)
    COALESCE(SUM(tr.weight_used * tr.sets), 0) as total_volume,
    -- Find first and last usage dates
    MIN(tr.date) as first_used_date,
    MAX(tr.date) as last_used_date
FROM available_equipments ae
LEFT JOIN exercises e ON ae.equipment_id = e.equipment_id
LEFT JOIN training_records tr ON e.exercise_id = tr.exercise_id
GROUP BY ae.equipment_id, ae.equipment_name, ae.equipment_type
HAVING COUNT(tr.record_id) > 0
ORDER BY total_workouts DESC, exercise_count DESC, ae.equipment_name;