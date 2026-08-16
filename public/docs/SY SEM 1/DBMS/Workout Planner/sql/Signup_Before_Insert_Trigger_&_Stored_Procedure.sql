-- =============================================
-- 1. BEFORE INSERT TRIGGER FUNCTION
-- =============================================
-- Validates all mandatory fields before inserting user profile
CREATE OR REPLACE FUNCTION validate_user_profile_insert()
RETURNS TRIGGER AS $$
DECLARE
    missing_fields TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Check for mandatory fields (NOT NULL constraints)
    IF NEW.user_id IS NULL THEN
        missing_fields := array_append(missing_fields, 'user_id');
    END IF;
    
    IF NEW.name IS NULL OR TRIM(NEW.name) = '' THEN
        missing_fields := array_append(missing_fields, 'name');
    END IF;
    
    IF NEW.email IS NULL OR TRIM(NEW.email) = '' THEN
        missing_fields := array_append(missing_fields, 'email');
    END IF;
    
    -- Validate email format (basic validation)
    IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format: %', NEW.email;
    END IF;
    
    -- Check for workout planner required fields (age, gender, height, weight)
    -- These are needed for BMI calculation and workout recommendations
    IF NEW.age IS NULL THEN
        missing_fields := array_append(missing_fields, 'age');
    ELSIF NEW.age <= 0 OR NEW.age >= 120 THEN
        RAISE EXCEPTION 'Age must be between 1 and 119 years';
    END IF;
    
    IF NEW.gender IS NULL OR TRIM(NEW.gender) = '' THEN
        missing_fields := array_append(missing_fields, 'gender');
    ELSIF NEW.gender NOT IN ('Male', 'Female', 'Other') THEN
        RAISE EXCEPTION 'Gender must be one of: Male, Female, Other';
    END IF;
    
    IF NEW.height IS NULL THEN
        missing_fields := array_append(missing_fields, 'height');
    ELSIF NEW.height <= 0 THEN
        RAISE EXCEPTION 'Height must be greater than 0';
    END IF;
    
    IF NEW.weight IS NULL THEN
        missing_fields := array_append(missing_fields, 'weight');
    ELSIF NEW.weight <= 0 THEN
        RAISE EXCEPTION 'Weight must be greater than 0';
    END IF;
    
    -- Raise exception if any mandatory fields are missing
    IF array_length(missing_fields, 1) > 0 THEN
        RAISE EXCEPTION 'Missing mandatory fields: %', array_to_string(missing_fields, ', ');
    END IF;
    
    -- All validations passed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 1a. SIGNUP LOG TABLE
-- =============================================
-- Captures successful signup events (after INSERT)
CREATE TABLE IF NOT EXISTS user_signup_log (
    log_id SERIAL PRIMARY KEY,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID,
    email VARCHAR(100),
    action VARCHAR(50) NOT NULL DEFAULT 'signup',
    status VARCHAR(20) NOT NULL, -- e.g., 'success'
    message TEXT
);

-- =============================================
-- 2. CREATE THE BEFORE INSERT TRIGGER
-- =============================================
CREATE TRIGGER trigger_validate_user_profile_insert
    BEFORE INSERT ON user_profile
    FOR EACH ROW
    EXECUTE FUNCTION validate_user_profile_insert();

-- =============================================
-- 3. STORED PROCEDURE TO INSERT USER PROFILE
-- =============================================
-- This procedure encapsulates the insertion logic and can be called via RPC
CREATE OR REPLACE FUNCTION insert_user_profile(
    p_user_id UUID,
    p_name VARCHAR(100),
    p_age INTEGER,
    p_gender VARCHAR(10),
    p_height DECIMAL(5,2),
    p_weight DECIMAL(5,2),
    p_email VARCHAR(100)
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_result JSON;
    v_error_msg TEXT;
BEGIN
    -- Validate inputs before insertion
    -- The trigger will also validate, but we do basic checks here too
    
    IF p_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'user_id is required'
        );
    END IF;
    
    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'name is required'
        );
    END IF;
    
    IF p_email IS NULL OR TRIM(p_email) = '' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'email is required'
        );
    END IF;
    
    IF p_age IS NULL OR p_age <= 0 OR p_age >= 120 THEN
        RETURN json_build_object(
            'success', false,
            'error', 'age must be between 1 and 119'
        );
    END IF;
    
    IF p_gender IS NULL OR p_gender NOT IN ('Male', 'Female', 'Other') THEN
        RETURN json_build_object(
            'success', false,
            'error', 'gender must be one of: Male, Female, Other'
        );
    END IF;
    
    IF p_height IS NULL OR p_height <= 0 THEN
        RETURN json_build_object(
            'success', false,
            'error', 'height must be greater than 0'
        );
    END IF;
    
    IF p_weight IS NULL OR p_weight <= 0 THEN
        RETURN json_build_object(
            'success', false,
            'error', 'weight must be greater than 0'
        );
    END IF;
    
    -- Attempt to insert the user profile
    -- The trigger will perform additional validation
    BEGIN
        INSERT INTO user_profile (
            user_id,
            name,
            age,
            gender,
            height,
            weight,
            email
        ) VALUES (
            p_user_id,
            TRIM(p_name),
            p_age,
            p_gender,
            p_height,
            p_weight,
            LOWER(TRIM(p_email))
        )
        RETURNING user_id INTO v_user_id;
        
        -- Return success response
        RETURN json_build_object(
            'success', true,
            'user_id', v_user_id,
            'message', 'User profile created successfully'
        );
        
    EXCEPTION
        WHEN unique_violation THEN
            RETURN json_build_object(
                'success', false,
                'error', 'Email already exists. Please use a different email address.'
            );

    END;
END;
$$ LANGUAGE plpgsql;