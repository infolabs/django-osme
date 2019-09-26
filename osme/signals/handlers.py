# -*- coding: utf-8 -*-

from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from osme.models import Region


def update_region_cache(sender, **kwargs):
    signal = kwargs['signal']
    instance = kwargs['instance']
    key = sender.CACHE_KEY_PATTERN.format(instance.query_string)

    if signal == post_save:
        cache.set(key, instance.content)
    elif signal == post_delete:
        cache.delete(key)


post_save.connect(update_region_cache, Region)
post_delete.connect(update_region_cache, Region)
