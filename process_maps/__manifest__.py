# -*- coding: utf-8 -*-
{
    'name': 'Process Maps',
    'version': '17.0.1.0.4',
    'category': 'Business',
    'summary': 'Display and manage process maps for employees and managers',
    'description': """
Process Maps Module
==================
This module allows organizations to:
* Create and manage process maps
* Display process maps for easy employee consultation
* Enable managers to quickly update process maps
* Track versions and changes
* Organize processes by categories
    """,
    'author': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'depends': ['base', 'web'],
    'data': [
        'data/ir_model_data.xml',
        'security/ir.model.access.csv',
        'security/process_map_security.xml',
        'views/process_map_views.xml',
        'views/menu_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'process_maps/static/src/js/process_map_widget.js',
            'process_maps/static/src/xml/process_map_widget.xml',
            'process_maps/static/src/css/process_map.css',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
