# -*- coding: utf-8 -*-

from django.apps import AppConfig


class OsmeConfig(AppConfig):
    name = 'osme'
    verbose_name = 'osme'

    def ready(self):
        from osme.signals import handlers
