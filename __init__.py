"""
Define actions urls that should be appeared in apps list page.This urls will be added beside explorer buttons.
There are three predefined groups of users to assign them actions{ admin, logged_in, anonymous}, groups names are self
explanatory.
urls dict must be as follows
urls_dict = {
    'admin':{'<url_name>':'<label>','<another_url_name>':'<another_label>'},
    'logged_in:{'<url_name>':'<label>','<another_url_name>':'<another_label>'},
    'anonymous:{'<url_name>':'<label>','<another_url_name>':'<another_label>'},
}
"""
APP_NAME = 'cartoview_public_information'

urls_dict = {
    'admin': {'%s.new' % APP_NAME: 'Create new'},
}

