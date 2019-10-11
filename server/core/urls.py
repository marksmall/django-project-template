from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from rest_framework.routers import SimpleRouter
from rest_framework_swagger.views import get_swagger_view

from astrosat.urls import (
    urlpatterns as astrosat_urlpatterns,
    api_urlpatterns as astrosat_api_urlpatterns,
)

from astrosat_users.urls import (
    urlpatterns as astrosat_users_urlpatterns,
    api_urlpatterns as astrosat_users_api_urlpatterns,
)

from {{project_name}}.urls import (
    urlpatterns as {{project_name}}_urlpatterns,
    api_urlpatterns as {{project_name}}_api_urlpatterns
)

from .views import index_view, app_config_view
from .views import BookmarkViewSet  # TODO: this class should probably be moved to django-astrosat-core


app_name = "core"


admin.site.site_header = settings.ADMIN_SITE_HEADER
admin.site.site_title = settings.ADMIN_SITE_TITLE
admin.site.index_title = settings.ADMIN_INDEX_TITLE


handler400 = "astrosat.views.handler400"
handler403 = "astrosat.views.handler403"
handler404 = "astrosat.views.handler404"
handler500 = "astrosat.views.handler500"


##############
# api routes #
##############


api_router = SimpleRouter()
api_router.register(r"bookmarks", BookmarkViewSet, basename="bookmark")
api_urlpatterns = [
    path("", include(api_router.urls)),
    path("app/config", app_config_view, name="appconfig"),
    path("swagger/", get_swagger_view(title="orbis API"), name="swagger"),
    # path("bookmarks", fetch_bookmarks, name="bookmarks"),
    # path("bookmarks", fetch_bookmarks, name="bookmarks"),
    # path("bookmarks/", add_bookmark, name="bookmark"),
]
api_urlpatterns += astrosat_api_urlpatterns
api_urlpatterns += astrosat_users_api_urlpatterns
api_urlpatterns += orbis_api_urlpatterns


#################
# normal routes #
#################


urlpatterns = [

    # re_path(r"^favicon\.ico$", RedirectView.as_view(
    #     url=staticfiles_storage.url("core/img/favicon.ico"),
    #     permanent=False,
    # ), name="favicon"),

    # docker healthchecks...
    path("healthcheck/", include("health_check.urls")),

    # admin...
    path(settings.ADMIN_URL, admin.site.urls),

    # API...
    path("api/", include(api_urlpatterns)),

    # all project app urls go here:
    # astrosat... NA
    # astrosat users...
    path("users/", include(astrosat_users_urlpatterns)),
    # tasks... NA
    # orbis...  NA

    # note: index_view is added at the very end of this module!

]


# media files...
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:

    # allow the error pages to be accessed during development...

    from functools import (
        partial,
    )  # (using partial to pretend an exception has been raised)
    from django.http import (
        HttpResponseBadRequest,
        HttpResponseForbidden,
        HttpResponseNotFound,
    )
    from astrosat.views import handler400, handler403, handler404, handler500

    urlpatterns += [
        path("400/", partial(handler400, exception=HttpResponseBadRequest())),
        path("403/", partial(handler403, exception=HttpResponseForbidden())),
        path("404/", partial(handler404, exception=HttpResponseNotFound())),
        path("500/", handler500),  # "default_views.server_error" doesn't take an exception
    ]

    # enable django-debug-toolbar during development...

    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns


urlpatterns += [
    # catch nothing-and-anything in IndexView...
    path("", index_view, name="index"),
    re_path(r"^.*/$", index_view, name="index"),
]
