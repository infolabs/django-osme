# -*- coding: utf-8 -*-

from django.contrib import admin
from osme.models import Region


class RegionAdmin(admin.ModelAdmin):
    model = Region
    search_fields = ('query_string',)


admin.site.register(Region, RegionAdmin)
