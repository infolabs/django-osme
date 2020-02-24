# -*- coding: utf-8 -*-

import requests
from django.core.cache import cache
from django.http import HttpResponse, HttpResponseBadRequest
from osme.models import Region


REGIONS_DATA_URL = "http://data.esosedi.org/regions/v1/"


def regions_data_view(request, path):
    if 'QUERY_STRING' not in request.META:
        return HttpResponseBadRequest()

    query_string = request.META['QUERY_STRING']
    cache_key = Region.CACHE_KEY_PATTERN.format(query_string)

    content = cache.get(cache_key, None)
    if content is not None:
        return HttpResponse(content, content_type='text/plain')

    try:
        region = Region.objects.get(query_string=query_string)
    except Region.DoesNotExist:
        pass
    else:
        cache.set(cache_key, region.content)
        return HttpResponse(region.content, content_type='text/plain')

    url = '{}{}?{}'.format(REGIONS_DATA_URL, path, query_string)
    r = requests.get(url, headers={'User-Agent': "curl/7.38.0"})
    if r.status_code != requests.codes.ok:
        return HttpResponse('Server responded with error', status=r.status_code)
    else:
        Region(query_string=query_string, content=r.content).save()
        return HttpResponse(r.content, status=r.status_code, content_type='text/plain')
