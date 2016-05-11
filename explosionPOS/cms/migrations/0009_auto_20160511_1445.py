# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-11 05:45
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0008_auto_20160428_1703'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='image',
            field=models.ImageField(default='noimage.jpg', upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='sale',
            name='date',
            field=models.DateTimeField(default=datetime.datetime.now, verbose_name='sold date'),
        ),
    ]