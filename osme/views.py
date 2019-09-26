# -*- coding: utf-8 -*-

import urllib2
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
    try:
        proxied_response = urllib2.urlopen(url)
        content = proxied_response.read()
    except urllib2.HTTPError as e:
        return HttpResponse(e.msg, status=e.code)
    else:
        Region(query_string=query_string, content=content).save()
        return HttpResponse(content, status=proxied_response.code, content_type='text/plain')
