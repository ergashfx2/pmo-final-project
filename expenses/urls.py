from django.urls import path
from .views import spending,detailedExpenses,add_expense,delete_expense

urlpatterns = [
    path('', spending, name='spending'),
    path('detailed/<pk>', detailedExpenses, name='detailed-expanses'),
    path('detailed/add-expense/<pk>',add_expense,name='add-expense'),
    path('detailed/delete-expense/<pk>',delete_expense,name='add-expense')
]
