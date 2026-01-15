# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError


class ProcessMap(models.Model):
    _name = 'process.map'
    _description = 'Process Map'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'sequence, name'

    name = fields.Char(
        string='Process Name',
        required=True,
        tracking=True,
        help='Name of the process'
    )
    
    description = fields.Html(
        string='Description',
        help='Detailed description of the process'
    )
    
    diagram_data = fields.Text(
        string='Diagram Data',
        help='JSON or BPMN data for the process diagram'
    )
    
    diagram_type = fields.Selection(
        [
            ('bpmn', 'BPMN'),
            ('mermaid', 'Mermaid'),
            ('flowchart', 'Flowchart'),
            ('image', 'Image'),
        ],
        string='Diagram Type',
        default='mermaid',
        required=True,
        help='Type of diagram to display'
    )
    
    image = fields.Binary(
        string='Process Image',
        help='Upload an image of the process map'
    )
    
    image_filename = fields.Char(
        string='Image Filename'
    )
    
    category_id = fields.Many2one(
        'process.map.category',
        string='Category',
        tracking=True,
        help='Category of the process'
    )
    
    department_id = fields.Many2one(
        'hr.department',
        string='Department',
        help='Department this process belongs to'
    )
    
    version = fields.Char(
        string='Version',
        default='1.0',
        tracking=True,
        help='Version of the process map'
    )
    
    state = fields.Selection(
        [
            ('draft', 'Draft'),
            ('published', 'Published'),
            ('archived', 'Archived'),
        ],
        string='Status',
        default='draft',
        required=True,
        tracking=True,
        help='Status of the process map'
    )
    
    is_active = fields.Boolean(
        string='Active',
        default=True,
        help='Whether this process map is currently active'
    )
    
    sequence = fields.Integer(
        string='Sequence',
        default=10,
        help='Order in which processes appear'
    )
    
    responsible_user_id = fields.Many2one(
        'res.users',
        string='Responsible',
        default=lambda self: self.env.user,
        tracking=True,
        help='Person responsible for maintaining this process'
    )
    
    last_updated = fields.Datetime(
        string='Last Updated',
        default=fields.Datetime.now,
        tracking=True,
        readonly=True,
        help='When this process was last updated'
    )
    
    change_log_ids = fields.One2many(
        'process.map.change.log',
        'process_map_id',
        string='Change Log',
        readonly=True,
        help='History of changes to this process'
    )
    
    related_project_ids = fields.Many2many(
        'project.project',
        string='Related Projects',
        help='Projects related to this process'
    )
    
    tags_ids = fields.Many2many(
        'process.map.tag',
        string='Tags',
        help='Tags for categorizing processes'
    )
    
    access_count = fields.Integer(
        string='Access Count',
        default=0,
        help='Number of times this process has been viewed'
    )
    
    @api.model
    def create(self, vals):
        """Override create to set last_updated"""
        vals['last_updated'] = fields.Datetime.now()
        record = super(ProcessMap, self).create(vals)
        record._log_change('created', 'Process map created')
        return record
    
    def write(self, vals):
        """Override write to track changes and update timestamp"""
        if 'state' in vals and vals['state'] == 'published':
            vals['last_updated'] = fields.Datetime.now()
        
        # Log significant changes
        if any(field in vals for field in ['name', 'diagram_data', 'diagram_type', 'version']):
            changes = []
            for field in ['name', 'diagram_data', 'diagram_type', 'version']:
                if field in vals:
                    old_value = getattr(self, field, '')
                    changes.append(f"{field}: {old_value} → {vals[field]}")
            
            if changes:
                self._log_change('updated', '; '.join(changes))
        
        result = super(ProcessMap, self).write(vals)
        return result
    
    def _log_change(self, action, details):
        """Create a change log entry"""
        self.env['process.map.change.log'].create({
            'process_map_id': self.id,
            'action': action,
            'details': details,
            'user_id': self.env.user.id,
        })
    
    def action_publish(self):
        """Publish the process map"""
        self.write({
            'state': 'published',
            'is_active': True,
            'last_updated': fields.Datetime.now(),
        })
        self._log_change('published', 'Process map published')
    
    def action_archive(self):
        """Archive the process map"""
        self.write({
            'state': 'archived',
            'is_active': False,
        })
        self._log_change('archived', 'Process map archived')
    
    def action_increment_access(self):
        """Increment access count when viewed"""
        self.access_count += 1
    
    @api.constrains('version')
    def _check_version_format(self):
        """Validate version format"""
        for record in self:
            if record.version and not self._is_valid_version(record.version):
                raise ValidationError('Version should be in format X.Y or X.Y.Z (e.g., 1.0 or 1.2.3)')
    
    def _is_valid_version(self, version):
        """Check if version string is valid"""
        import re
        pattern = r'^\d+(\.\d+){1,2}$'
        return bool(re.match(pattern, version))


class ProcessMapCategory(models.Model):
    _name = 'process.map.category'
    _description = 'Process Map Category'
    _order = 'sequence, name'

    name = fields.Char(
        string='Category Name',
        required=True
    )
    
    description = fields.Text(
        string='Description'
    )
    
    sequence = fields.Integer(
        string='Sequence',
        default=10
    )
    
    process_map_ids = fields.One2many(
        'process.map',
        'category_id',
        string='Process Maps'
    )
    
    process_map_count = fields.Integer(
        string='Process Count',
        compute='_compute_process_map_count'
    )
    
    @api.depends('process_map_ids')
    def _compute_process_map_count(self):
        for category in self:
            category.process_map_count = len(category.process_map_ids)


class ProcessMapTag(models.Model):
    _name = 'process.map.tag'
    _description = 'Process Map Tag'
    _order = 'name'

    name = fields.Char(
        string='Tag Name',
        required=True
    )
    
    color = fields.Integer(
        string='Color',
        default=1
    )


class ProcessMapChangeLog(models.Model):
    _name = 'process.map.change.log'
    _description = 'Process Map Change Log'
    _order = 'create_date desc'

    process_map_id = fields.Many2one(
        'process.map',
        string='Process Map',
        required=True,
        ondelete='cascade'
    )
    
    action = fields.Char(
        string='Action',
        required=True
    )
    
    details = fields.Text(
        string='Details'
    )
    
    user_id = fields.Many2one(
        'res.users',
        string='User',
        required=True,
        default=lambda self: self.env.user
    )
    
    change_date = fields.Datetime(
        string='Change Date',
        default=fields.Datetime.now,
        required=True
    )
