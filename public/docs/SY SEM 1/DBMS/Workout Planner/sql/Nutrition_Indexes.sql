-- Nutrition Section Indexing SQL Code
-- Indexes for type (Veg, Non-Veg) and time (Breakfast, Lunch, Dinner, Snack) columns

-- =============================================
-- INDEXES for RECIPES TABLE Performance Optimization
-- =============================================

-- Index for type column (Veg, Non-Veg)
CREATE INDEX idx_recipes_type ON recipes(type);

-- Index for time column (Breakfast, Lunch, Dinner, Snack)  
CREATE INDEX idx_recipes_time ON recipes(time);

-- Composite index for combined filtering on type and time
CREATE INDEX idx_recipes_type_time ON recipes(type, time);
