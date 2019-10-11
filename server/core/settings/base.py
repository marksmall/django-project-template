"""
Django settings for {{ project_name }} project.

For more information on this file, see
https://docs.djangoproject.com/en/{{ docs_version }}/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/{{ docs_version }}/ref/settings/
"""
import environ
import importlib
import os

from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _

from astrosat.utils import DynamicSetting


env = environ.Env()

PROJECT_NAME = "{{project_name}}"
PROJECT_SLUG = slugify(PROJECT_NAME)
PROJECT_EMAIL = "{role}@astrosat.space"

ROOT_DIR = environ.Path(__file__) - 4
SERVER_DIR = ROOT_DIR.path("server")
CLIENT_DIR = ROOT_DIR.path("client")

DEBUG = False  # "development.py" & "testing.py" set DEBUG to True

WSGI_APPLICATION = "wsgi.application"

SITE_ID = 1

############
# Database #
############

# database is overwritten in "ci.py"

DATABASES = {
    "default": {
        "ATOMIC_REQUESTS": True,
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": env("DJANGO_DB_NAME", default=""),
        "USER": env("DJANGO_DB_USER", default=""),
        "PASSWORD": env("DJANGO_DB_PASSWORD", default=""),
        "HOST": env("DJANGO_DB_HOST", default=""),
        "PORT": env("DJANGO_DB_PORT", default=""),
    }
}

########
# Apps #
########

DJANGO_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.messages",
    # statics...
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    # gis...
    "django.contrib.gis",
    # admin...
    "django.contrib.admin",
    # cors...
    "corsheaders",
]

THIRD_PARTY_APPS = [
    # apis...
    "django_filters",
    "rest_framework",
    "rest_framework_gis",
    "rest_framework_swagger",
    # users...,
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "rest_auth",
    "rest_auth.registration",
    "rest_framework.authtoken",
    # healthchecks...
    "health_check",
    "health_check.db",
]

LOCAL_APPS = [
    "astrosat",  # (dependencies)
    "astrosat_users",  # (users)
    "core",  # (shared stuff)
    "{{project_name}}",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

##############
# Middleware #
##############

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

########################
# Internationalisation #
########################

TIME_ZONE = "UTC"
LANGUAGE_CODE = "en"
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [("en-us", _("American English")), ("en-gb", _("British English"))]

LOCALE_PATHS = [str(SERVER_DIR("core/locale"))]

ROOT_URLCONF = "core.urls"
APPEND_SLASH = True

#######
# API #
#######

REST_FRAMEWORK = {
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.NamespaceVersioning",
    # "DEFAULT_AUTHENTICATION_CLASSES": [
    #     "rest_framework.authentication.SessionAuthentication",
    #     "rest_framework.authentication.TokenAuthentication",
    # ],
    # 'DEFAULT_PERMISSION_CLASSES': (
    #     'rest_framework.permissions.IsAuthenticated',
    # ),
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),
    "COERCE_DECIMAL_TO_STRING": False,
    # "DEFAULT_FILTER_BACKENDS": (
    #     "django_filters.rest_framework.DjangoFilterBackend",
    # ),
}

#############
# Templates #
#############

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            # override some default templates...
            str(SERVER_DIR.path("core/templates")),
            # and override some default templates from an imported app (rest_framework, allauth, & rest_auth)...
            os.path.join(
                os.path.dirname(importlib.import_module("astrosat_users").__file__),
                "templates",
            ),
            # and find the "index.html" template in the client build......
            str(CLIENT_DIR.path("build")),
        ],
        "OPTIONS": {
            "debug": DEBUG,
            "loaders": [
                # first look at templates in DIRS, then look in the standard place for each INSTALLED_APP
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

################
# Static files #
################

STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

STATIC_ROOT = str(SERVER_DIR("static"))
STATIC_URL = "/static/"

STATICFILES_DIRS = [
    # STATIC_ROOT,  # no need to explicitly specify STATIC_ROOT again
    str(CLIENT_DIR.path("build/static"))
]

WHITENOISE_ROOT = str(CLIENT_DIR("build"))
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


###############
# Media files #
###############

MEDIA_ROOT = str(SERVER_DIR("media"))
MEDIA_URL = "/media/"

#########
# Admin #
#########

ADMIN_URL = "admin/"

ADMINS = [(PROJECT_NAME, PROJECT_EMAIL.format(role="noreply"))]
MANAGERS = ADMINS

ADMIN_SITE_HEADER = f"{PROJECT_NAME} administration console"
ADMIN_SITE_TITLE = f"{PROJECT_NAME} administration console"
ADMIN_INDEX_TITLE = f"Welcome to the {PROJECT_NAME} administration console"


#########
# Email #
#########

SERVER_EMAIL = PROJECT_EMAIL.format(role=f"{PROJECT_NAME}-admin")
DEFAULT_FROM_EMAIL = f"{PROJECT_NAME} <{PROJECT_EMAIL.format(role='automated')}>"
EMAIL_TIMEOUT = 60

# email backend is set in environment-specific settings...

# development: "django.core.mail.backends.console.EmailBackend"
# ci: django.core.mail.backends.locmem.EmailBackend"
# deployment: "django.core.mail.backends.smtp.EmailBackend"

##########################
# Authentication & Users #
##########################

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

LOGIN_URL = "account_login"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.BCryptPasswordHasher",
]

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 5},
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTH_USER_MODEL = "astrosat_users.User"


ACCOUNT_ADAPTER = "astrosat_users.adapters.AccountAdapter"
SOCIALACCOUNT_ADAPTER = "astrosat_users.adapters.SocialAccountAdapter"

ACCOUNT_FORMS = {
    # "add_email": "allauth.account.forms.AddEmailForm",
    # "change_password": "allauth.account.forms.ChangePasswordForm",
    # "disconnect": "allauth.socialaccount.forms.DisconnectForm",
    # "login": "allauth.account.forms.LoginForm",
    "reset_password": "astrosat_users.forms.PasswordResetForm",
    # "reset_password_from_key": "allauth.account.forms.ResetPasswordKeyForm",
    # "set_password": "allauth.account.forms.SetPasswordForm",
    # "signup": "allauth.account.forms.SignupForm",
    # "signup": "allauth.socialaccount.forms.SignupForm",
}

REST_AUTH_SERIALIZERS = {
    # "LOGIN_SERIALIZER":
    "USER_DETAILS_SERIALIZER": "astrosat_users.serializers.UserSerializer",
    "PASSWORD_RESET_SERIALIZER": "astrosat_users.serializers.PasswordResetSerializer",
    "PASSWORD_RESET_CONFIRM_SERIALIZER": "astrosat_users.serializers.PasswordResetConfirmSerializer",
    "PASSWORD_CHANGE_SERIALIZER": "astrosat_users.serializers.PasswordChangeSerializer",
    # "REGISTER_SERIALIZER":
}

ACCOUNT_USERNAME_MIN_LENGTH = 3
ACCOUNT_LOGIN_ATTEMPTS_LIMIT = 5
ACCOUNT_AUTHENTICATION_METHOD = "username"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_LOGOUT_ON_GET = False

############
# Security #
############

# SESSION_COOKIE_HTTPONLY = True
# CSRF_COOKIE_HTTPONLY = True
# SECURE_BROWSER_XSS_FILTER = True
# X_FRAME_OPTIONS = 'DENY'

MAPBOX_TOKEN = env("DJANGO_MAPBOX_TOKEN", default="")
TRACKING_ID = env("DJANGO_TRACKING_ID", default="")
