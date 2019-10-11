from django.contrib import admin
from django.contrib.gis.admin import GeoModelAdmin

from .models import Bookmark


@admin.register(Bookmark)
class BookmarkAdmin(GeoModelAdmin):
    search_fields = ("title",)
