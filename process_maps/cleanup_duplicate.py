#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Odoo Shell Script to Clean Up Duplicate Module Records
Run this in Odoo shell: python odoo-bin shell -d your_database_name < cleanup_duplicate.py
Or copy-paste these commands into Odoo shell
"""

# Delete duplicate ir.model.data record
duplicate_records = env['ir.model.data'].search([
    ('module', '=', 'base'),
    ('name', '=', 'module_process_maps')
])
if duplicate_records:
    print(f"Found {len(duplicate_records)} duplicate record(s), deleting...")
    duplicate_records.unlink()
    print("Deleted duplicate ir.model.data records")
else:
    print("No duplicate ir.model.data records found")

# Delete any leftover module records
module_records = env['ir.module.module'].search([('name', '=', 'process_maps')])
if module_records:
    print(f"Found {len(module_records)} module record(s), deleting...")
    module_records.unlink()
    print("Deleted module records")
else:
    print("No module records found")

# Commit changes
env.cr.commit()
print("Cleanup complete! You can now update Apps List and install the module.")
