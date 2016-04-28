from django.db import models
from datetime import datetime

# Create your models here.
class User(models.Model):
    """User"""
    student_id = models.IntegerField('Student ID', blank=False, default=0)
    name = models.CharField('Name', max_length=255)

    def __str__(self):
        return self.name


class Item(models.Model):
    code = models.IntegerField('JAN code', blank=False, default=0)
    name = models.CharField('Item name', max_length=255)
    cost_price = models.IntegerField('Cost price', blank=False, default=0)
    selling_price = models.IntegerField('Selling price', blank=False, default=0)
    stock = models.IntegerField('Stock',blank=False,default=0)

    def __str__(self):
        return self.name


class Sale(models.Model):  
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=0)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, default=0)
    value = models.IntegerField('value', blank=False, default=0)
    price = models.IntegerField('price', blank=False, default=0)
    date = models.DateTimeField('sold date', blank=False,default=datetime.now)
    note = models.TextField('Note', blank=True)
