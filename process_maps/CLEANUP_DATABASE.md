# Database Cleanup - Fix Duplicate Key Error

## Problem
Error: `duplicate key value violates unique constraint "ir_model_data_module_name_uniq_index"`
Detail: `Key (module, name)=(base, module_process_maps) already exists.`

This happens when there's a leftover record in the database from a previous installation attempt.

## Solution 1: Using Odoo Shell (Recommended)

1. **Open Odoo Shell** (from command line):
```bash
cd "E:\Program Files\Odoo 17.0.20251215\server"
python odoo-bin shell -d your_database_name
```

2. **Run these commands in the shell**:
```python
# Delete the duplicate ir.model.data record
env['ir.model.data'].search([('module', '=', 'base'), ('name', '=', 'module_process_maps')]).unlink()

# Also check for any process_maps module records
env['ir.module.module'].search([('name', '=', 'process_maps')]).unlink()

# Exit shell
exit()
```

## Solution 2: Using SQL (PostgreSQL)

1. **Connect to your PostgreSQL database**:
```sql
psql -U odoo -d your_database_name
```

2. **Run these SQL commands**:
```sql
-- Delete the duplicate ir.model.data record
DELETE FROM ir_model_data WHERE module = 'base' AND name = 'module_process_maps';

-- Delete any leftover module records
DELETE FROM ir_module_module WHERE name = 'process_maps';

-- Commit
COMMIT;
```

## Solution 3: Using Odoo UI (If you have Developer Mode)

1. **Enable Developer Mode**: Settings → Activate Developer Mode
2. **Go to**: Settings → Technical → Database Structure → External Identifiers
3. **Search for**: `module_process_maps`
4. **Delete** any records found
5. **Also check**: Settings → Technical → Database Structure → Modules
6. **Search for**: `process_maps` and delete if found

## Solution 4: Complete Module Cleanup (Nuclear Option)

If the above doesn't work, completely remove the module:

1. **Uninstall the module** (if installed):
   - Apps → Search "Process Maps" → Uninstall

2. **Delete from database** (using SQL or shell):
```sql
-- Delete all process_maps related records
DELETE FROM ir_model_data WHERE module = 'process_maps' OR name LIKE '%process_map%';
DELETE FROM ir_module_module WHERE name = 'process_maps';
DELETE FROM ir_model WHERE model LIKE 'process.map%';
```

3. **Restart Odoo server**

4. **Update Apps List** and try installing again

## After Cleanup

1. **Restart Odoo server**
2. **Update Apps List** in Odoo
3. **Install the module** again

The module should now install without the duplicate key error.
