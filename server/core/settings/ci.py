from .base import *  # noqa
from .base import env

###########
# General #
###########

DEBUG = True

SECRET_KEY = "ci_{{project_name}}_1nu1$t^(idp+qw++kazw3&)r$gdn1a$l=msbc1mda3lt*t*#yi"

ALLOWED_HOSTS = [
    # note that ALLOWED_HOSTS is set to "['*']" in "deployment.py"
    # since Nginx is handling host vulnerabilities
    "localhost",
    "0.0.0.0",
    "127.0.0.1",
]

INSTALLED_APPS += [
    "core.tests"
]

############
# Database #
############

DATABASES = {
    'default': {
        'ATOMIC_REQUESTS': True,
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': "{{project_name}}",
        'USER': "{{project_name}}",
        'PASSWORD': "{{project_name}}",
        'HOST': env("DJANGO_SETTING_DATABASE_HOST"),
    }
}


#########
# Email #
#########

EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
EMAIL_HOST = "localhost"
EMAIL_PORT = 1025
