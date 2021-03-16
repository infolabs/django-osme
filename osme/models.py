# -*- coding: utf-8 -*-

from django.db import models
from django.utils.translation import ugettext_lazy as _


class Region(models.Model):
    CACHE_KEY_PATTERN = 'osme_region:{}'

    osm_id = models.CharField(verbose_name=_('Osm id'), db_index=True, max_length=255)
    content = models.TextField(verbose_name=_('Content'))

    def __str__(self):
        return self.osm_id

    class Meta:
        verbose_name = _('Region')
        verbose_name_plural = _('Regions')
