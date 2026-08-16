-- =============================================
-- 1. CREATE AUDIT LOG TABLE
-- =============================================
CREATE TABLE profile_audit_log (
    log_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    changed_fields TEXT[],
    old_values JSONB,
    new_values JSONB,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. BEFORE UPDATE TRIGGER (Logging Only)
-- =============================================

CREATE OR REPLACE FUNCTION before_update_profile_trigger()
RETURNS TRIGGER AS $$
DECLARE
    changed_fields TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- 1️⃣ Track changed fields
    IF OLD.name IS DISTINCT FROM NEW.name THEN
        changed_fields := array_append(changed_fields, 'name');
    END IF;
    IF OLD.email IS DISTINCT FROM NEW.email THEN
        changed_fields := array_append(changed_fields, 'email');
    END IF;
    IF OLD.age IS DISTINCT FROM NEW.age THEN
        changed_fields := array_append(changed_fields, 'age');
    END IF;
    IF OLD.gender IS DISTINCT FROM NEW.gender THEN
        changed_fields := array_append(changed_fields, 'gender');
    END IF;
    IF OLD.height IS DISTINCT FROM NEW.height THEN
        changed_fields := array_append(changed_fields, 'height');
    END IF;
    IF OLD.weight IS DISTINCT FROM NEW.weight THEN
        changed_fields := array_append(changed_fields, 'weight');
    END IF;

    -- 2️⃣ Validate new data before saving
    IF NEW.age < 0 OR NEW.age > 120 THEN
        RAISE EXCEPTION 'Invalid age: %. Age must be between 0 and 120.', NEW.age;
    END IF;

    IF NEW.height < 50 OR NEW.height > 250 THEN
        RAISE EXCEPTION 'Invalid height: %. Height must be between 50 cm and 250 cm.', NEW.height;
    END IF;

    IF NEW.weight < 10 OR NEW.weight > 300 THEN
        RAISE EXCEPTION 'Invalid weight: %. Weight must be between 10 kg and 300 kg.', NEW.weight;
    END IF;

    -- 3️⃣ Validate email format (basic check)
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format: %', NEW.email;
    END IF;

    -- 4️⃣ Log the changes (optional)
    INSERT INTO profile_audit_log (user_id, action_type, changed_fields, old_values, new_values)
    VALUES (
        NEW.user_id,
        'BEFORE_UPDATE',
        changed_fields,
        jsonb_build_object('old_data', to_jsonb(OLD)),
        jsonb_build_object('new_data', to_jsonb(NEW))
    );

    -- 5️⃣ Notify successful validation
    RAISE NOTICE 'Validated and logged BEFORE UPDATE for user % (changed fields: %)', 
        NEW.user_id, changed_fields;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_before_update_profile
    BEFORE UPDATE ON user_profile
    FOR EACH ROW
    EXECUTE FUNCTION before_update_profile_trigger();

-- =============================================
-- 3. AFTER UPDATE TRIGGER (BMI Calculation Only)
-- =============================================
CREATE OR REPLACE FUNCTION after_update_profile_trigger()
RETURNS TRIGGER AS $$
DECLARE
    changed_fields TEXT[] := ARRAY[]::TEXT[];
    old_bmi DECIMAL(5,2);
    new_bmi DECIMAL(5,2);
BEGIN
    -- Check which fields changed
    IF OLD.height IS DISTINCT FROM NEW.height THEN
        changed_fields := array_append(changed_fields, 'height');
    END IF;
    IF OLD.weight IS DISTINCT FROM NEW.weight THEN
        changed_fields := array_append(changed_fields, 'weight');
    END IF;
    
    -- Calculate BMI values
    IF OLD.height IS NOT NULL AND OLD.weight IS NOT NULL THEN
        old_bmi := OLD.weight / POWER(OLD.height / 100, 2);
    END IF;
    
    IF NEW.height IS NOT NULL AND NEW.weight IS NOT NULL THEN
        new_bmi := NEW.weight / POWER(NEW.height / 100, 2);
    END IF;
    
    -- Log the change with BMI calculation
    IF array_length(changed_fields, 1) > 0 THEN
        INSERT INTO profile_audit_log (user_id, action_type, changed_fields, old_values, new_values)
        VALUES (NEW.user_id, 'AFTER_UPDATE', changed_fields, 
                jsonb_build_object('bmi', old_bmi), 
                jsonb_build_object('bmi', new_bmi));
        
        RAISE NOTICE 'After Update Trigger: User % - BMI changed from % to %', 
            NEW.user_id, old_bmi, new_bmi;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_after_update_profile
    AFTER UPDATE ON user_profile
    FOR EACH ROW
    EXECUTE FUNCTION after_update_profile_trigger();
