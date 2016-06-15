from django.contrib import admin
from cms.models import User, Item, Sale
from django.conf.urls import url
from django.http import HttpResponse

class ItemAdmin(admin.ModelAdmin):
    def get_urls(self):
        urls = super(ItemAdmin, self).get_urls()
        my_urls = [
            url(r'^addauto/$', self.admin_site.admin_view(self.addauto), name='addauto'),
        ]
        # admin/cms/item/addauto/
        return my_urls + urls

    def addauto(self, request):
        return HttpResponse('OK')
	
admin.site.register(User)
admin.site.register(Item,ItemAdmin)
admin.site.register(Sale)
