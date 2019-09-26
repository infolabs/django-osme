# -*- coding: utf-8 -*-

from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from osme.models import Region


@receiver(post_save, sender=Region)
def set_region_cache(sender, **kwargs):
    instance = kwargs['instance']
    key = sender.CACHE_KEY_PATTERN.format(instance.query_string)
    cache.set(key, instance.content)


@receiver(post_delete, sender=Region)
def delete_region_cache(sender, **kwargs):
    instance = kwargs['instance']
    key = sender.CACHE_KEY_PATTERN.format(instance.query_string)
    cache.delete(key)
