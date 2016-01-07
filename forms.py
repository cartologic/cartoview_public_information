from codemirror import *
from django import forms

from cartoview.app_manager.forms import AppInstanceForm
from config import config_template
from models import BasicEsriApp


# configuration form to add/edit new instance.
class BasicAppForm(AppInstanceForm):
    class Meta(AppInstanceForm.Meta):
        model = BasicEsriApp
        # append new fields to typical app instance form fields.
        fields = AppInstanceForm.Meta.fields + ['web_map_id', 'config']
		
    # web_map_id added as hidden field and interfaced and set form client side(js).
    web_map_id = forms.CharField(widget=forms.HiddenInput)
    # esri json configuration with CodeMirror form field to be well presented.
    config = CodeMirrorFormField(initial=config_template)