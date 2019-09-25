from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view

from .settings.base import env

@api_view(['GET'])
def app_config_view(request):
    """ Return hard-coded app config """
    return JsonResponse({ 'trackingId': env("DJANGO_TRACKING_ID", default=""), 'mapbox_token': env("DJANGO_MAPBOX_TOKEN", default="") }, status=status.HTTP_200_OK)
