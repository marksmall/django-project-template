from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.viewsets import ModelViewSet

from django.conf import settings

from .models import Bookmark
from .serializers import BookmarkSerializer

@api_view(['GET'])
def app_config_view(request):
    """ Return hard-coded app config """
    return JsonResponse({ 'trackingId': settings.TRACKING_ID, 'mapbox_token': settings.MAPBOX_TOKEN }, status=status.HTTP_200_OK)

@api_view(['GET'])
def fetch_bookmarks(request):
    """ Return hard-coded bookmarks list """
    return JsonResponse([{ 'id': '1', 'title': 'Bookmark 1' }, { 'id': '2', 'title': 'Bookmark 2' }], status=status.HTTP_200_OK, safe=False)

@api_view(['POST'])
def add_bookmark(request):
    """ Receive a bookmark to add to dbase """
    print(f"Bookmark Label: ", request.data.get("title", ""))
    print(f"Bookmark Source: ", request.data.get("source", ""))
    print(f"Bookmark Center: ", request.data.get("center", ""))
    print(f"Bookmark Zoom: ", request.data.get("zoom", ""))
    return JsonResponse([{ 'message': 'success' }], status=status.HTTP_200_OK, safe=False)

class BookmarkViewSet(ModelViewSet):
    """ API endpoint allowing Groups to be viewed and edited """
    queryset = Bookmark.objects.all() #.order_by('')
    serializer_class = BookmarkSerializer
    http_method_names = ['POST']
