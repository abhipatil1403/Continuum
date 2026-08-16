CREATE OR REPLACE FUNCTION create_recipe(
    p_recipe_name VARCHAR(100),
    p_ingredients TEXT,
    p_type VARCHAR(10),
    p_time VARCHAR(20),
    p_calories DECIMAL(8,2),
    p_protein DECIMAL(8,2),
    p_carbs DECIMAL(8,2),
    p_fats DECIMAL(8,2),
    p_prep_time_minutes INTEGER,
    p_servings INTEGER,
    p_instructions TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_recipe_id INTEGER;
    v_result JSON;
    v_error_message TEXT;
BEGIN
    -- Input validation
    IF p_recipe_name IS NULL OR TRIM(p_recipe_name) = '' THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Recipe name is required',
            'recipe_id', null
        );
    END IF;
    
    IF p_ingredients IS NULL OR TRIM(p_ingredients) = '' THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Ingredients are required',
            'recipe_id', null
        );
    END IF;
    
    IF p_type NOT IN ('Veg', 'Non-Veg') THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Recipe type must be either Veg or Non-Veg',
            'recipe_id', null
        );
    END IF;
    
    IF p_time NOT IN ('Breakfast', 'Lunch', 'Dinner', 'Snack') THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Meal time must be Breakfast, Lunch, Dinner, or Snack',
            'recipe_id', null
        );
    END IF;
    
    IF p_calories IS NULL OR p_calories < 0 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Calories must be a non-negative number',
            'recipe_id', null
        );
    END IF;
    
    IF p_protein IS NULL OR p_protein < 0 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Protein must be a non-negative number',
            'recipe_id', null
        );
    END IF;
    
    IF p_carbs IS NULL OR p_carbs < 0 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Carbs must be a non-negative number',
            'recipe_id', null
        );
    END IF;
    
    IF p_fats IS NULL OR p_fats < 0 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Fats must be a non-negative number',
            'recipe_id', null
        );
    END IF;
    
    IF p_prep_time_minutes IS NULL OR p_prep_time_minutes <= 0 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Prep time must be a positive number',
            'recipe_id', null
        );
    END IF;
    
    IF p_servings IS NULL OR p_servings <= 0 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Servings must be a positive number',
            'recipe_id', null
        );
    END IF;
    
    -- Check for duplicate recipe name
    IF EXISTS (SELECT 1 FROM recipes WHERE LOWER(recipe_name) = LOWER(TRIM(p_recipe_name))) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'A recipe with this name already exists',
            'recipe_id', null
        );
    END IF;
    
    BEGIN
        -- Insert the new recipe
        INSERT INTO recipes (
            recipe_name,
            ingredients,
            type,
            time,
            calories,
            protein,
            carbs,
            fats,
            prep_time_minutes,
            servings,
            instructions
        ) VALUES (
            TRIM(p_recipe_name),
            TRIM(p_ingredients),
            p_type,
            p_time,
            p_calories,
            p_protein,
            p_carbs,
            p_fats,
            p_prep_time_minutes,
            p_servings,
            COALESCE(TRIM(p_instructions), 'No instructions provided')
        ) RETURNING recipe_id INTO v_recipe_id;
        
        -- Return success response
        RETURN json_build_object(
            'success', true,
            'message', 'Recipe created successfully',
            'recipe_id', v_recipe_id,
            'recipe_name', TRIM(p_recipe_name)
        );
        
END;
$$ LANGUAGE plpgsql;