# Process Maps Module for Odoo 17

A comprehensive module for managing and displaying process maps in Odoo Community 17. This module allows employees to easily consult process maps and enables managers to quickly update them.

## Features

### For All Employees
- **Easy Access**: Dedicated menu item "Process Maps" for quick access
- **View Published Processes**: View all published and active process maps
- **Search & Filter**: Search by name, category, department, or tags
- **Multiple Views**: Kanban, List, and Form views for different preferences
- **Access Tracking**: See how often processes are consulted

### For Managers
- **Full Control**: Create, edit, and manage all process maps
- **Quick Updates**: Easy-to-use form view for rapid changes
- **Version Control**: Track versions and changes with automatic change logging
- **Status Management**: Draft, Publish, or Archive process maps
- **Categorization**: Organize processes by categories and departments

## Key Features

### Process Map Management
- **Multiple Diagram Types**: Support for Mermaid, BPMN, Flowchart, and Image formats
- **Rich Descriptions**: HTML editor for detailed process descriptions
- **Categorization**: Organize processes by categories and departments
- **Tags**: Tag processes for better organization
- **Project Integration**: Link processes to related projects

### Version Control & Tracking
- **Version Numbers**: Track process versions (e.g., 1.0, 1.2.3)
- **Change Log**: Automatic tracking of all changes with user and timestamp
- **Access Count**: Track how many times each process is viewed
- **Last Updated**: Automatic timestamp on updates

### Security & Access Control
- **Employee Access**: Employees can view published processes and their own drafts
- **Manager Access**: Managers have full access to create, edit, and delete
- **Record Rules**: Automatic filtering based on user role

## Installation

1. Copy the `process_maps` folder to your Odoo addons directory
2. Update the app list in Odoo (Settings > Apps > Update Apps List)
3. Search for "Process Maps" and click Install
4. The module will be available in the main menu

## Usage

### Creating a Process Map

1. Go to **Process Maps > All Processes**
2. Click **Create**
3. Fill in the required information:
   - **Name**: Process name
   - **Category**: Optional category
   - **Version**: Version number (e.g., 1.0)
   - **Diagram Type**: Choose Mermaid, BPMN, Flowchart, or Image
   - **Diagram Data**: Enter your diagram code or upload an image
4. Click **Save** and then **Publish** when ready

### For Employees - Viewing Process Maps

1. Go to **Process Maps > All Processes**
2. Browse published processes using Kanban, List, or search
3. Click on any process to view details
4. View the diagram, description, and related information

### For Managers - Updating Process Maps

1. Go to **Process Maps > All Processes**
2. Find the process you want to update
3. Click to open and make your changes
4. Update the version number if needed
5. Click **Save** - changes are automatically logged

## Diagram Types

### Mermaid Diagrams
Use Mermaid syntax for flowcharts, sequence diagrams, and more:
```
graph TD
    A[Start] --> B[Process]
    B --> C[Decision]
    C -->|Yes| D[End]
    C -->|No| B
```

### BPMN
Enter BPMN XML format for business process modeling

### Flowchart
Enter flowchart text format

### Image
Upload an image file of your process map

## Technical Details

### Models
- `process.map`: Main process map model
- `process.map.category`: Process categories
- `process.map.tag`: Process tags
- `process.map.change.log`: Change history

### Security Groups
- **Employees** (`base.group_user`): Read-only access to published processes
- **Managers** (`base.group_user_manager`): Full access to all processes

### Views
- Form view with tabs for Diagram, Description, Related Info, and History
- List view with sorting and filtering
- Kanban view grouped by category
- Search view with filters and grouping options

## Customization

### Adding Custom Fields
You can extend the `process.map` model to add custom fields:
```python
class ProcessMap(models.Model):
    _inherit = 'process.map'
    
    custom_field = fields.Char(string='Custom Field')
```

### Customizing Views
Views can be customized by inheriting the existing views and adding your modifications.

## Support

For issues or questions, please contact your system administrator or refer to the Odoo documentation.

## License

LGPL-3
