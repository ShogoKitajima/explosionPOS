from django.db import models


from django.db.models import Sum, F, IntegerField
from django.core import serializers
import datetime
from dateutil.relativedelta import relativedelta

# Create your models here.
class User(models.Model):
    """User"""
    student_id = models.IntegerField('Student ID', blank=False, default=0,unique=True)
    name = models.CharField('Name', max_length=255)

    def __str__(self):
        return self.name
    
    def subtotal_month(self,minus):
    # minus:何ヶ月前か
        selected_user = self
        today = datetime.datetime.today()
        first_of_lastmonth = today + relativedelta(day=1) - relativedelta(month=minus)
        sales_of_lastmonth = Sale.objects.filter(date__range=(first_of_lastmonth,today),user=selected_user)
        subtotal = sales_of_lastmonth.aggregate(s = Sum(F('price')*F('value'),output_field=IntegerField()))
        subtotal['s'] = subtotal['s'] if subtotal['s'] is not None else 0
        return subtotal['s'] 


class Item(models.Model):
    code = models.IntegerField('JAN code', blank=False, default=0)
    name = models.CharField('Item name', max_length=255)
    cost_price = models.IntegerField('Cost price', blank=False, default=0)
    selling_price = models.IntegerField('Selling price', blank=False, default=0)
    stock = models.IntegerField('Stock',blank=False,default=0)
    image = models.ImageField(upload_to='images/',default='noimage.jpg')

    def __str__(self):
        return self.name


class Sale(models.Model):  
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=0)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, default=0)
    value = models.IntegerField('value', blank=False, default=0)
    price = models.IntegerField('price', blank=False, default=0)
    date = models.DateTimeField('sold date', blank=False,default=datetime.datetime.now)
    note = models.TextField('Note', blank=True)
