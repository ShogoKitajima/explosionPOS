# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-20 18:19
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0002_auto_20160420_1814'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Sales',
            new_name='Sale',
        ),
    ]
