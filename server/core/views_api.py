from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view

from django.conf import settings

@api_view(['GET'])
def app_config_view(request):
    """ Return hard-coded app config """
    return JsonResponse({ 'trackingId': settings.TRACKING_ID, 'mapbox_token': settings.MAPBOX_TOKEN }, status=status.HTTP_200_OK)

@api_view(['GET'])
def fetch_bookmarks(request):
    """ Return hard-coded bookmarks list """
    return JsonResponse([{ 'id': '1', 'title': 'Bookmark 1' }, { 'id': '2', 'title': 'Bookmark 2' }], status=status.HTTP_200_OK, safe=False)
