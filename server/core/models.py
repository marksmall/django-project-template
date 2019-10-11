from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.utils.translation import gettext as _

from astrosat.utils import validate_schema
from astrosat_users.models import get_deleted_user


FEATURE_COLLECTION_SCHEMA = {
    # defines the schema of the feature_collection JSONField below
    "type": "object",
    "properties": {
        "type": {"type": "string", "pattern": "^FeatureCollection$"},
        "features": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {"type": "string", "pattern": "^Feature$"},
                    "geometry": {"type": "object"},
                    "properties": {"type": "object"},
                },
                "required": ["geometry", "properties"],
            },
        },
    },
    "required": ["features"],
}


def validate_feature_collection(value):
    return validate_schema(value, FEATURE_COLLECTION_SCHEMA)


class Bookmark(gis_models.Model):
    class Meta:

        unique_together = ["owner", "title"]

    PRECISION = 6

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        on_delete=models.SET(get_deleted_user),
        related_name="bookmarks",
    )

    title = models.CharField(
        max_length=128,
        blank=False,
        null=False,
        help_text=_("A pretty display name for the bookmark"),
    )

    zoom = models.FloatField(
        blank=False,
        null=False,
        help_text=_("The zoom level of the bookmark on the map."),
    )

    center = gis_models.PointField(
        blank=False,
        null=False,
        help_text=_("The center point of this bookmark on the map"),
    )

    feature_collection = JSONField(
        blank=False,
        null=False,
        validators=[validate_feature_collection],
        help_text=_("a GeoJSON description of the data being bookmarked."),
    )

    def __str__(self):
        return f"Bookmark ({self.title})"
