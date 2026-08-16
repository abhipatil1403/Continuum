-- =============================================
-- CASCADE DELETE CONFIGURATION
-- =============================================
-- This script ensures that all foreign key constraints use CASCADE DELETE
-- so that when a user account is deleted, all related data is automatically removed.
--
-- DBMS Concept: Referential Integrity with CASCADE DELETE
-- Purpose: Maintain database consistency by automatically removing orphaned records
--
-- When a user_profile record is deleted, this will automatically delete:
-- 1. All training_records for that user
-- 2. All diet entries for that user
-- 3. All profile_audit_log entries for that user
-- =============================================

-- =============================================
-- 1. Verify Current CASCADE Configuration
-- =============================================
-- Check existing foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'user_profile'
ORDER BY tc.table_name;

-- =============================================
-- 2. Add CASCADE DELETE to profile_audit_log
-- =============================================
-- First, check if profile_audit_log table exists and has user_id column
DO $$
BEGIN
    -- Check if the table exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'profile_audit_log'
    ) THEN
        -- Drop existing foreign key constraint if it exists (without CASCADE)
        IF EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'profile_audit_log_user_id_fkey'
              AND table_name = 'profile_audit_log'
        ) THEN
            ALTER TABLE profile_audit_log 
            DROP CONSTRAINT profile_audit_log_user_id_fkey;
            
            RAISE NOTICE 'Dropped existing foreign key constraint on profile_audit_log';
        END IF;
        
        -- Add new foreign key constraint with CASCADE DELETE
        ALTER TABLE profile_audit_log
        ADD CONSTRAINT profile_audit_log_user_id_fkey
        FOREIGN KEY (user_id) 
        REFERENCES user_profile(user_id) 
        ON DELETE CASCADE;
        
        RAISE NOTICE 'Added CASCADE DELETE constraint to profile_audit_log';
    ELSE
        RAISE NOTICE 'profile_audit_log table does not exist yet';
    END IF;
END $$;

-- =============================================
-- 3. Verify All CASCADE DELETE Constraints
-- =============================================
-- This query shows all tables with foreign keys to user_profile
-- and confirms they all have CASCADE DELETE enabled
SELECT 
    tc.table_name AS "Table",
    kcu.column_name AS "Column",
    rc.delete_rule AS "Delete Rule",
    CASE 
        WHEN rc.delete_rule = 'CASCADE' THEN '✓ Configured'
        ELSE '✗ NOT Configured'
    END AS "Status"
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'user_id'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;