__author__ = 'kamal'

import os, sys

import cartoview_public_information

current_folder = os.path.dirname(cartoview_public_information.__file__)
sys.path.append(os.path.join(current_folder, 'libs'))
INSTALLED_APPS += (
    'deform' ,
)
