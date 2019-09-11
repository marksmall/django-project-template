from django.apps import AppConfig


class AppConfig(AppConfig):

    name = "{{project_name}}"

    def ready(self):

        # register any signals...
        try:
            import {{project_name}}.signals  # noqa F401
        except ImportError:
            pass
