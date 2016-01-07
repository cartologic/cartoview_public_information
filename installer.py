from django.contrib.contenttypes.models import ContentType

# This info object used by cartoview app manager to show app details in the app list
info = {
    "title": "Public Information",
    "description": ''' Esri mapping template to showcase social media on a map for disaster response and public information''',
    "author": 'Cartologic',
    "tags": ['App Template'],
    "licence": 'BSD',
    "author_website": "http://www.cartologic.com",
    "single_instance": False
}


def install():
    # add any extra app installation logic
    pass


def uninstall():
    ContentType.objects.filter(app_label="cartoview_public_information").delete()
    # add any extra app uninstall logic
