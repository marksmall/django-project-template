from django.contrib.gis.geos import Point
from rest_framework.serializers import ModelSerializer, Field, ValidationError

from .models import Bookmark


class SimplifiedGeometryField(Field):
    """
    don't deal w/ the WKT serialization of the GeoDJango field
    just deal w/ a simple array
    """

    def __init__(self, *args, **kwargs):
        self.precision = kwargs.pop("precision", 12)
        self.geometry_class = kwargs.pop("geometry_class")
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        return map(lambda x: round(x, self.precision), value.coords)

    def to_internal_value(self, data):
        try:
            return self.geometry_class(data)
        except TypeError as e:
            raise ValidationError(str(e))


class BookmarkGeoSerializer(ModelSerializer):
    # _not_ using GeoFeatureModelSerializer b/c I do not want to convert the whole queryset to GeoJSON
    class Meta:
        model = Bookmark
        fields = ("id", "owner", "title", "zoom", "center", "feature_collection")

    center = SimplifiedGeometryField(geometry_class=Point, precision=Bookmark.PRECISION)
