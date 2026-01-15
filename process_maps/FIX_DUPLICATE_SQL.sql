-- SQL Script to Fix Duplicate Key Error
-- Run this in your PostgreSQL database (DEMO)

-- Step 1: Delete the duplicate ir.model.data record
DELETE FROM ir_model_data 
WHERE module = 'base' AND name = 'module_process_maps';

-- Step 2: Delete any leftover process_maps module records
DELETE FROM ir_module_module 
WHERE name = 'process_maps';

-- Step 3: Verify deletion (optional - check if records were deleted)
SELECT * FROM ir_model_data 
WHERE module = 'base' AND name = 'module_process_maps';
-- Should return 0 rows

SELECT * FROM ir_module_module 
WHERE name = 'process_maps';
-- Should return 0 rows

-- If you see any records, the module might be installed - uninstall it first in Odoo UI
