from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.db.models import Sum
from cms.models import User, Item, Sale
import datetime
from dateutil.relativedelta import relativedelta


# Create your views here.
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
    #http://blog.hirokiky.org/2013/02/19/aggregation_with_django.html
    selected_user = get_object_or_404(User,id=request.POST['user'])
    today = datetime.date.today()
    first_of_thismonth = today + relativedelta(day=1)
    sales_of_thismonth = Sale.objects.filter(date__range=(first_of_thismonth, today),user=selected_user)
    subtotal = sales_of_thismonth.aggregation_with_django(Sum('price'))
    response = json.dumps({'subtotal': subtotal})
    return HttpResponse(response,mimetype="text/javascript")