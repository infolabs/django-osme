# -*- coding: utf-8 -*-

from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class OsmeConfig(AppConfig):
    name = 'osme'
    verbose_name = _('OSME')

    def ready(self):
        from osme.signals import handlers
