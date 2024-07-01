from django.urls import path
from .views import spending,detailedExpenses,add_expense,delete_expense,updateBudget,deleteAll

urlpatterns = [
    path('', spending, name='spending'),
    path('detailed/<pk>', detailedExpenses, name='detailed-expanses'),
    path('detailed/add-expense/<pk>',add_expense,name='add-expense'),
    path('detailed/expand-budget/<pk>',updateBudget,name='expand-budget'),
    path('detailed/delete-expense/<pk>',delete_expense,name='delete-expense'),
    path('detailed/delete-expense-all/',deleteAll,name='delete-expense-all')
]
