from django.db import models
from django.contrib.postgres.fields import JSONField

class Bookmark(models.Model):
    """ Model a single Bookmark, this will contain the name, geojson, center point (lng/lat) and the zoom. """
    class Meta:
        app_label: {{project_name}}

    title = models.CharField(help_text="The name of the bookmark", max_length=100)
    source = JSONField(help_text="GeoJSON Data source")
    center = models.CharField(help_text="The Map's center point")
    zoom = models.FloatField(blank=False, null=False, help_text="Zoom level of map", max_length=100)
