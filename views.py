import json
import re
from string import rstrip
from urlparse import urljoin
from django.shortcuts import render, HttpResponse
from cartoview.app_manager.models import App, AppInstance
from django.conf import settings
from . import APP_NAME

VIEW_TPL = "%s/index.html" % APP_NAME
NEW_EDIT_TPL = "%s/new.html" % APP_NAME


def view(request, resource_id):
    # basic_app_obj = BasicEsriApp.objects.get(pk=resource_id)
    # config_json = json.loads(remove_json_comments(basic_app_obj.config))
    # config_json['webmap'] = str(basic_app_obj.web_map_id)
    # config_json['title'] = basic_app_obj.title
    # config_json['description'] = basic_app_obj.abstract
    # config_json['sharinghost'] = rstrip(str(urljoin(settings.SITEURL, reverse("arcportal_home"))), '/')
    #
    # context = {'config_json': json.dumps(config_json)}
    # return render(request, VIEW_TPL, context)

    instance = AppInstance.objects.get(pk=resource_id)
    context = dict(instance=instance)
    return render(request, VIEW_TPL, context)


def save(request, instance_id=None):
    res = dict(success=False, errors=dict())
    config_str = request.POST.get('config', None)
    config = json.loads(config_str)
    title = config['title']
    abstract = "" if 'summary' not in config else config['summary']
    required_fields = {
        'webmap': "Please Choose a webmap",
        'title': 'Please Enter a valid title'
    }
    valid = True
    for f in required_fields.keys():
        val = config.get(f, "").strip()
        if val == "":
            res["errors"][f] = required_fields[f]
            valid = False
    # if title.strip() == "":
    #     res['errors']["title"] = 'Please Enter a valid title'
    if valid:
        if instance_id is None:
            instance_obj = AppInstance()
            instance_obj.app = App.objects.get(name=APP_NAME)
            instance_obj.owner = request.user
        else:
            instance_obj = AppInstance.objects.get(pk=instance_id)
        instance_obj.title = title
        instance_obj.config = config_str
        instance_obj.abstract = abstract
        instance_obj.save()
        res.update(dict(success=True, id=instance_obj.id))
    return HttpResponse(json.dumps(res), content_type="text/json")
    # basic_app_obj = app_form.save(commit=False)
    # # get app by name and add it to app instance.
    # basic_app_obj.app = App.objects.get(name=APP_NAME)
    # # get current user and add it as app instance owner.
    # basic_app_obj.owner = request.user
    # basic_app_obj.save()
    # redirect to app instance details after saving instance.
    # return HttpResponseRedirect(reverse('appinstance_detail', kwargs={'appinstanceid': basic_app_obj.pk}))


#
def new(request):
    if request.method == 'POST':
        return save(request)

    context = {}
    return render(request, NEW_EDIT_TPL, context)


def edit(request, resource_id):

    if request.method == 'POST':
        return save(request, resource_id)

    instance = AppInstance.objects.get(pk=resource_id)
    context = dict(instance=instance)
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
