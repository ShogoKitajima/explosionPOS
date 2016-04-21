from django.shortcuts import render
from django.http import HttpResponse
from cms.models import User, Item, Sale

# Create your views here.
def buy(request):
    sale = Sale.objects.all().order_by('id')
    return render(request,'cms/buy.html')
