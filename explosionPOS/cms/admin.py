from django.contrib import admin
from cms.models import User, Item, Sale
from django.conf.urls import url
from django.http import HttpResponse
from django.db.models import Sum, F, IntegerField
from django.core import serializers
import datetime
from dateutil.relativedelta import relativedelta
class ItemAdmin(admin.ModelAdmin):
    list_display = ('code','name','cost_price','selling_price','stock')
    list_editable = ('name','cost_price','selling_price','stock')
    def get_urls(self):
        urls = super(ItemAdmin, self).get_urls()
        my_urls = [
            url(r'^addauto/$', self.admin_site.admin_view(self.addauto), name='addauto'),
        ]
        # admin/cms/item/addauto/
        return my_urls + urls

    def addauto(self, request):
        return HttpResponse('OK')
	
class UserAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'name','this_month','last_month')

    def this_month(self,obj):
        
        return  obj.subtotal_month(minus=0)
    
    def last_month(self,obj):
        return obj.subtotal_month(minus=1)

class SaleAdmin(admin.ModelAdmin):
    list_display = ('user','item','date','price','value','note')

admin.site.register(User,UserAdmin)
admin.site.register(Item,ItemAdmin)
admin.site.register(Sale,SaleAdmin)
