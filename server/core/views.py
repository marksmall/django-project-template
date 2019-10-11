from django.conf import settings
from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView


###############################
# the one-and-only index_view #
###############################


def index_view(request):

    # this 'index.html' comes from CLIENT_DIR
    template_name = "index.html"

    return render(request, template_name)


###############
# other views #
###############


class AppConfigView(APIView):

    config_map = {
        # settings to track
        "TRACKING_ID": "trackingId",
        "MAPBOX_TOKEN": "mapbox_token",  # TODO: SHOUDN'T THIS BE "mapboxToken" FOR CONSISTENCY ?
    }

    def get(self, request, format=None):

        config = {
            client_key: getattr(settings, server_key)
            for server_key, client_key in self.config_map.items()
        }

        return Response(config)


app_config_view = AppConfigView.as_view()


#TODO: all code below here should probably be moved to django-astrosat-core


from django_filters import rest_framework as filters

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, SAFE_METHODS

from .models import Bookmark
from .serializers import BookmarkGeoSerializer


class IsAdminOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        # anybody can do GET, HEAD, or OPTIONS
        if request.method in SAFE_METHODS:
            return True

        # only the admin or the specific owner can do POST, PUT, PATCH, DELETE
        user = request.user
        return user.is_superuser or user == obj.owner


class BookmarkFilterSet(filters.FilterSet):
    """
    Allows me to filter bookmarks by owner
    # TODO: eventually add a "shared__in" filter
    usage is: <domain>/api/bookmark/?owner=<user.pk>
    """

    class Meta:
        model = Bookmark
        fields = {
            "owner": ["exact"],
            # TODO: eventually add ``"shared": ["in"]` filter
        }


class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkGeoSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = BookmarkFilterSet
