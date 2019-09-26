# -*- coding: utf-8 -*-

from django.conf.urls import url
from osme.views import regions_data_view


urlpatterns = [
    url(r'^v1/(?P<path>.*)$', regions_data_view, name='regions_data'),
]
