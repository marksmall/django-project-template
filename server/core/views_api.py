from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view

from django.conf import settings

@api_view(['GET'])
def app_config_view(request):
    """ Return hard-coded app config """
    return JsonResponse({ 'trackingId': settings.TRACKING_ID, 'mapbox_token': settings.MAPBOX_TOKEN }, status=status.HTTP_200_OK)
