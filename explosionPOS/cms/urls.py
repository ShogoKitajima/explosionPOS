from django.conf.urls import url
from cms import views

urlpatterns = [
    url(r'^buy/$', views.buy, name='buy'),
]
