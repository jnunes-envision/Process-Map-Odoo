# Installation Guide - Process Maps Module

## Prerequisites
- Odoo Community Edition 17.0
- Python 3.8 or higher
- Access to Odoo server with module installation permissions

## Installation Steps

### 1. Copy Module to Addons Directory
Copy the `process_maps` folder to your Odoo addons directory:
```bash
# Example path (adjust to your Odoo installation)
cp -r process_maps /path/to/odoo/addons/
```

### 2. Update Apps List
1. Log in to Odoo as Administrator
2. Go to **Settings** (gear icon)
3. Enable **Developer Mode** (if not already enabled)
4. Go to **Apps** menu
5. Click **Update Apps List**

### 3. Install the Module
1. In the **Apps** menu, remove the "Apps" filter to show all modules
2. Search for "Process Maps"
3. Click on the module
4. Click **Install**

### 4. Configure Access Rights (Optional)
The module automatically sets up:
- **Employees**: Can view published process maps
- **Managers**: Can create, edit, and delete all process maps

To customize access rights:
1. Go to **Settings > Technical > Security > Access Rights**
2. Search for "process.map"
3. Modify groups as needed

## Post-Installation

### Create Categories (Recommended)
1. Go to **Process Maps > Categories**
2. Create categories to organize your processes (e.g., "HR", "Sales", "Operations")

### Create Your First Process Map
1. Go to **Process Maps > All Processes**
2. Click **Create**
3. Fill in the process details
4. Add your diagram (Mermaid, BPMN, or Image)
5. Click **Publish** when ready

## Troubleshooting

### Module Not Appearing
- Ensure the module is in the correct addons path
- Check that `__manifest__.py` is valid
- Restart Odoo server
- Clear browser cache

### Permission Errors
- Verify user has appropriate group memberships
- Check security rules in **Settings > Technical > Security > Record Rules**

### Diagram Not Rendering
- For Mermaid diagrams, ensure internet connection (loads from CDN)
- Check browser console for JavaScript errors
- Verify diagram syntax is correct

## Next Steps

1. **Train Users**: Show employees how to access and view process maps
2. **Create Processes**: Start documenting your key business processes
3. **Set Review Schedule**: Establish regular review cycles for process updates
4. **Link to Projects**: Connect process maps to relevant projects for context

## Support

For technical issues:
- Check Odoo logs: `/var/log/odoo/odoo.log`
- Review module README.md
- Contact your system administrator
