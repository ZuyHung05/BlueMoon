-- Migration script to populate change_history for existing residents
-- This creates history records for all residents currently in households

-- Insert history records for all existing residents who have a household
INSERT INTO change_history (resident_id, household_id, change_type, date)
SELECT 
    r.resident_id,
    r.household_id,
    1 as change_type,  -- 1 = THÊM_THÀNH_VIÊN (Add member)
    CURRENT_DATE as date  -- Use current date, or you can use household.start_day if preferred
FROM residents r
WHERE r.household_id IS NOT NULL
  AND NOT EXISTS (
      -- Only insert if history doesn't already exist for this resident-household pair
      SELECT 1 
      FROM change_history ch 
      WHERE ch.resident_id = r.resident_id 
        AND ch.household_id = r.household_id
  );

-- Optional: If you want to use household's start_day instead of current date, use this instead:
/*
INSERT INTO change_history (resident_id, household_id, change_type, date)
SELECT 
    r.resident_id,
    r.household_id,
    1 as change_type,
    COALESCE(h.start_day, CURRENT_DATE) as date
FROM residents r
INNER JOIN household h ON r.household_id = h.household_id
WHERE r.household_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 
      FROM change_history ch 
      WHERE ch.resident_id = r.resident_id 
        AND ch.household_id = r.household_id
  );
*/

-- Verify the migration
SELECT COUNT(*) as total_history_records FROM change_history;
