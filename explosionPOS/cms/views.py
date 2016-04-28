from django.shortcuts import render
from django.http import HttpResponse
from cms.models import User, Item, Sale

# Create your views here.
def shop(request):
    sale = Sale.objects.all().order_by('id')
    items = Item.objects.all().order_by('code')
    users = User.objects.all().order_by('student_id')
    context = {'items': items, 'users':users}
    return render(request,'cms/shop.html',context)

def buy(request):
    selected_user = get_object_or_404(User,pk=request.POST['user'])
    selected_item = get_object_or_404(Item,pk=request.POST['item'])
    selected_value = request.POST['value']
    selected_price = 
    