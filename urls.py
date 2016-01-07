from django.conf.urls import patterns, url

import views
from . import APP_NAME

urlpatterns = patterns('',
                       url(r'^new/$', views.new, name='%s.new' % APP_NAME),
                       url(r'^view/(?P<resource_id>\d+)/$', views.view, name='%s.view' % APP_NAME),
                       url(r'^edit/(?P<resource_id>\d+)/$', views.edit, name='%s.edit' % APP_NAME),
                       )
