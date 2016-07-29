#!/bin/sh
python manage.py loaddata guestUser
python manage.py runserver