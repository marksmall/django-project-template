from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view


@api_view(['GET'])
def app_config_view(request):
    """ Return hard-coded app config """
    return JsonResponse({ 'trackingId': 'mytrackingid', 'mapbox_token': 'mymapboxtoken' }, status=status.HTTP_200_OK)
