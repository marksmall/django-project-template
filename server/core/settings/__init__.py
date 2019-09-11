import environ
import glob
import os

from django.core.exceptions import ImproperlyConfigured

ROOT_DIR = environ.Path(__file__) - 4

ENVIRONMENT = os.environ.get("SYS_ENV", "development")
environment_settings_module = f"core.settings.{ENVIRONMENT.lower()}"

##############################
# load environment variables #
##############################

env = environ.Env()

if ENVIRONMENT == "development":
    # environment variables for development are stored in files
    for env_file in glob.glob(ROOT_DIR(".env*")):
        try:
            env.read_env(env_file)
        except Exception as e:
            msg = f"Unable to read '{env_file}': {e}."
            raise ImproperlyConfigured(msg)

else:
    # otherwise, they are dynamically created by Ansible on the server
    pass


###############################
# import appropriate settings #
###############################

# Import base settings
from .base import *  # noqa

# Import default deployment settings
if ENVIRONMENT not in ["development", "ci"]:
    from .deployment import *

# Import environment specific settings
exec(u"from {} import *".format(environment_settings_module)) in globals()
