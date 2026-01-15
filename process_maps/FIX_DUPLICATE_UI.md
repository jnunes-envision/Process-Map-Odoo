# Fix Duplicate Key Error Using Odoo UI

## Method 1: Using Developer Mode (Easiest)

### Step 1: Enable Developer Mode
1. Log in to Odoo as Administrator
2. Go to **Settings** (gear icon)
3. Scroll down and click **Activate Developer Mode**

### Step 2: Delete Duplicate External Identifier
1. Go to **Settings → Technical → Database Structure → External Identifiers**
2. In the search bar, type: `module_process_maps`
3. Find the record where:
   - **Module**: `base`
   - **Name**: `module_process_maps`
4. Select it and click **Delete**
5. Confirm deletion

### Step 3: Check for Module Record
1. Go to **Settings → Technical → Database Structure → Modules**
2. Search for: `process_maps`
3. If found, select it and click **Delete** (or Uninstall if it's installed)

### Step 4: Clean Up
1. Go to **Apps** menu
2. Click **Update Apps List**
3. Search for **Process Maps**
4. Click **Install**

## Method 2: Using SQL Tools

If you have pgAdmin, DBeaver, or any PostgreSQL client:

1. Connect to your database: `DEMO`
2. Run the SQL commands from `FIX_DUPLICATE_SQL.sql`
3. Restart Odoo
4. Update Apps List and install

## Method 3: Using psql Command Line

```powershell
# Connect to PostgreSQL (adjust username/password as needed)
psql -U odoo -d DEMO

# Then run:
DELETE FROM ir_model_data WHERE module = 'base' AND name = 'module_process_maps';
DELETE FROM ir_module_module WHERE name = 'process_maps';
\q
```

## After Cleanup

1. **Restart Odoo server** (important!)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Log in to Odoo**
4. **Apps → Update Apps List**
5. **Search "Process Maps" → Install**

The duplicate key error should be resolved!
