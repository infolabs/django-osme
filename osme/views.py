# -*- coding: utf-8 -*-

import requests
from django.core.cache import cache
from django.http import HttpResponse
from osme.models import Region


REGIONS_DATA_URL = "https://www.openstreetmap.org/api/0.6/relation/"


def regions_data_view(request, path):
    cache_key = Region.CACHE_KEY_PATTERN.format(path)

    content = cache.get(cache_key, None)
    if content is not None:
        if 'features' in content:
            content_features = content['features']
        else:
            content_features = content
        return HttpResponse(content_features, content_type='text/plain')

    try:
        region = Region.objects.get(query_string=path)
    except Region.MultipleObjectsReturned:
        # delete everything and create a new one from the server
        regions = Region.objects.filter(query_string=path)
        regions.delete()
    except Region.DoesNotExist:
        pass
    else:
        cache.set(cache_key, region.content)
        return HttpResponse(region.content, content_type='text/plain')

    url = '{}{}/{}'.format(REGIONS_DATA_URL, path, "full")
    r = requests.get(url, headers={'User-Agent': "curl/7.38.0"})
    if r.status_code != requests.codes.ok:
        return HttpResponse('Server responded with error', status=r.status_code)
    else:
        import osm2geojson
        geojson = osm2geojson.xml2geojson(r.content, filter_used_refs=False, log_level='INFO')
        Region(query_string=path, content=geojson).save()
        _region = Region.objects.get(query_string=path)
        return HttpResponse(_region.content, status=r.status_code, content_type='text/plain')
