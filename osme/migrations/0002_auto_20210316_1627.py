# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2021-03-16 13:27
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('osme', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='region',
            name='query_string',
        ),
        migrations.AddField(
            model_name='region',
            name='osm_id',
            field=models.CharField(db_index=True, default=1, max_length=255, verbose_name='Osm id'),
            preserve_default=False,
        ),
    ]