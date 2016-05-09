from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.db.models import Sum, F, IntegerField
from django.core import serializers
from cms.models import User, Item, Sale
import json
import datetime
from dateutil.relativedelta import relativedelta


def shop(request):
    sale = Sale.objects.all().order_by('id')
    items = Item.objects.all().order_by('code')
    users = User.objects.all().order_by('student_id')
    context = {'items': items, 'users':users}
    return render(request,'cms/shop.html',context)

def buy(request):
    selected_user = get_object_or_404(User,id=request.POST['user'])
    selected_item = get_object_or_404(Item,code=request.POST['item'])
    selected_value = int(request.POST['value'])
    selected_price = selected_item.selling_price
    context = {'user': selected_user, 'item': selected_item, 'value': selected_value, 'price': selected_price }
    if selected_item.stock >= selected_value :
        selected_item.stock -= selected_value
        context['status'] = True
    else :
        context['status'] = False
        return render(request,'cms/result.html',context)
    saleLog = Sale(user=selected_user,item=selected_item,value=selected_value,price=selected_price)
    saleLog.save()
    selected_item.save()
    return render(request,'cms/result.html',context)

def userInfo(request):
    user_id = request.GET['user']
    if not user_id.isdecimal() :
        user_id = -1
    selected_user = get_object_or_404(User,pk=user_id)
    today = datetime.datetime.today()
    first_of_thismonth = today + relativedelta(day=1)
    sales_of_thismonth = Sale.objects.filter(date__range=(first_of_thismonth,today),user=selected_user)
    subtotal = sales_of_thismonth.aggregate(s = Sum(F('price')*F('value'),output_field=IntegerField()))
    subtotal['s'] = subtotal['s'] if subtotal['s'] is not None else 0
    response = json.dumps({'subtotal': subtotal['s']})  
    return HttpResponse(response,content_type="text/javascript")

#def getItems(request):
#    response = serializers.serialize("json",Item.objects.all().order_by("code"),fields=("code","name")) 
#    return HttpResponse(response,content_type="text/javascript")