from django.conf.urls import url
from cms import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^shop/$', views.shop, name='shop'),
    url(r'^buy/$', views.buy, name='buy'),
    url(r'^userinfo/$', views.userInfo, name='userInfo'),
]