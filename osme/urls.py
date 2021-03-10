# -*- coding: utf-8 -*-

from django.conf.urls import url
from osme.views import regions_data_view


urlpatterns = [
    url(r'^api/0.6/relation/(?P<path>\d+)/full$', regions_data_view, name='regions_data'),
]
