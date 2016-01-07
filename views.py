import json
import re
from string import rstrip
from urlparse import urljoin

from django.http import HttpResponseRedirect
from django.shortcuts import render

from cartoview.app_manager.models import *
from forms import BasicAppForm
from geonode import settings
from .models import *
from . import APP_NAME

VIEW_TPL = "%s/index.html" % APP_NAME
NEW_EDIT_TPL = "%s/new.html" % APP_NAME


def view(request, resource_id):
    basic_app_obj = BasicEsriApp.objects.get(pk=resource_id)
    config_json = json.loads(remove_json_comments(basic_app_obj.config))
    config_json['webmap'] = str(basic_app_obj.web_map_id)
    config_json['title'] = basic_app_obj.title
    config_json['description'] = basic_app_obj.abstract
    config_json['sharinghost'] = rstrip(str(urljoin(settings.SITEURL, reverse("arcportal_home"))), '/')

    context = {'config_json': json.dumps(config_json)}
    return render(request, VIEW_TPL, context)


def save(request, app_form):
    basic_app_obj = app_form.save(commit=False)
    # get app by name and add it to app instance.
    basic_app_obj.app = App.objects.get(name=APP_NAME)
    # get current user and add it as app instance owner.
    basic_app_obj.owner = request.user
    basic_app_obj.save()
    # redirect to app instance details after saving instance.
    return HttpResponseRedirect(reverse('appinstance_detail', kwargs={'appinstanceid': basic_app_obj.pk}))


#
def new(request):
    if request.method == 'POST':
        app_form = BasicAppForm(request.POST, prefix='app_form')
        return save(request, app_form)

    else:
        # form is invalid.
        context = {'app_form': BasicAppForm(prefix='app_form')}
        return render(request, NEW_EDIT_TPL, context)


def edit(request, resource_id):
    basic_app_obj = BasicEsriApp.objects.get(pk=resource_id)
    if request.method == 'POST':
        app_form = BasicAppForm(request.POST, prefix='app_form', instance=basic_app_obj)
        return save(request, app_form)

    else:
        # form is invalid.
        context = {'app_form': BasicAppForm(prefix='app_form', instance=basic_app_obj)}
        return render(request, NEW_EDIT_TPL, context)


# ------------- Utility functions to handle json comments -------------

# Regular expression for comments
comment_re = re.compile(
        '(^)?[^\S\n]*/(?:\*(.*?)\*/[^\S\n]*|/[^\n]*)($)?',
        re.DOTALL | re.MULTILINE
)

comments_exception = {'http://': 'HTTP_PLACE_HOLDER', 'https://': 'HTTPS_PLACE_HOLDER',
                      'location.protocol + "//': 'LOCATION_PLACE_HOLDER'}


def remove_json_comments(json_string):
    """ Parse a JSON file
        First remove comments and then use the json module package
        Comments look like :
            // ...
        or
            /*
            ...
            */
    """

    content = json_string  # ''.join(json_string)

    for key in comments_exception:
        content = content.replace(key, comments_exception[key])

    # Looking for comments
    match = comment_re.search(content)
    while match:
        # single line comment
        content = content[:match.start()] + content[match.end():]
        match = comment_re.search(content)

    for key in comments_exception:
        content = content.replace(comments_exception[key], key)

    # Return json
    return content
