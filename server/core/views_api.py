from collections import OrderedDict, namedtuple

from django.urls.resolvers import URLPattern, URLResolver

from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView

from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view

URLPatternTuple = namedtuple("UrlPatternTuple", ["name", "reverse_name"])


def has_suffix(name, suffix):
    return name.endswith(suffix)


def remove_suffix(name, suffix):
    if has_suffix(name, suffix):
        return name[:-len(suffix)]
    return name


class APIRootView(APIView):

    # Overrides the built-in APIRootView to work w/ a list of urlpatterns.
    # Some of these come from a DRF Router using ViewSets as normal,
    # but others use standard Django functions.  This class means I don't have to
    # manually code all root patterns, I can infer them just like the DRF DefaultRouter.

    urlpatterns = []
    list_view_suffix = "-list"
    detail_view_suffix = "-detail"

    def get(self, request, *args, **kwargs):

        root_patterns = []
        for pattern in self.urlpatterns:

            if isinstance(pattern, URLResolver):
                # dealing w/ a viewset...
                root_patterns += [
                    URLPatternTuple(
                        remove_suffix(p.name, self.list_view_suffix),
                        p.name,
                    )
                    for p in pattern.url_patterns if has_suffix(p.name, self.list_view_suffix)
                ]

            elif isinstance(pattern, URLPattern):
                # dealing w/ a function...
                if not has_suffix(pattern.name, self.detail_view_suffix):
                    root_patterns.append(
                        URLPatternTuple(
                            remove_suffix(pattern.name, self.list_view_suffix),
                            pattern.name,
                        )
                    )

            else:
                # dealing w/ something else ?!?
                raise NotImplementedError

        namespace = request.resolver_match.namespace

        api_dict = OrderedDict([
            (
                pattern.name,
                reverse(
                    f"{namespace}:{pattern.reverse_name}" if namespace else pattern.reverse_name,
                    request=request,
                    args=args,
                    kwargs=kwargs,
                    format=kwargs.get("format", None),
                )
            )
            for pattern in root_patterns
        ])

        return Response(api_dict)

@api_view(['GET'])
def app_config_view(request):
    """ Return hard-coded app config """
    return JsonResponse({ 'trackingId': 'mytrackingid'}, status=status.HTTP_200_OK)
