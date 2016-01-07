from django.db import models
from uuidfield import UUIDField

from cartoview.app_manager.models import AppInstance
from . import APP_NAME

# Create your models here.

class BasicEsriApp(AppInstance):
    # this model has all geonode resource fields and cartoview app instance fields.
    # override relation field to add unique related_name
    appinstance_ptr = models.OneToOneField(AppInstance, related_name='%s_basic_esri_app' % APP_NAME)

    # web map id used by most esri templates
    web_map_id = UUIDField()
    # json configuration needed by esri templates
    config = models.TextField(null=True, blank=True)
