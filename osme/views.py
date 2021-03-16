# -*- coding: utf-8 -*-

import json
import requests
import osm2geojson

from django.core.cache import cache
from django.http import HttpResponse

from osme.models import Region


REGIONS_DATA_URL = "https://www.openstreetmap.org/api/0.6/relation/"


def regions_data_view(request, osm_id):
    cache_key = Region.CACHE_KEY_PATTERN.format(osm_id)

    content = cache.get(cache_key, None)

    if content is None:
        region = None
        try:
            region = Region.objects.get(osm_id=osm_id)
        except Region.MultipleObjectsReturned:
            regions = Region.objects.filter(osm_id=osm_id)
            regions.delete()
        except Region.DoesNotExist:
            pass
        else:
            content = region.content
            cache.set(cache_key, region.content)

        if region is None:
            url = '{}{}/{}'.format(REGIONS_DATA_URL, osm_id, "full")
            r = requests.get(url, headers={'User-Agent': "curl/7.38.0"})
            if r.status_code != requests.codes.ok:
                return HttpResponse('Server responded with error', status=r.status_code)
            else:
                content = json.dumps(osm2geojson.xml2geojson(r.content, filter_used_refs=False, log_level='INFO'))
                region = Region(osm_id=osm_id, content=content)
                region.save()
                cache.set(cache_key, region.content)
    return HttpResponse(content, content_type='application/json')
