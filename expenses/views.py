import json

from django.contrib.auth.decorators import login_required
from django.contrib.sites import requests
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from utils import currency_rate
from actions.models import Action
from loyihalar.models import Project, Documents
from .models import Expense
from loyihalar.views import file_extensions
from config.views import getExpensesAll

@login_required
def spending(request):
    projects = Project.objects.all()
    total_budget = 0
    spent_budget = 0
    totalExpense = getExpensesAll(year=timezone.now().year)
    for project in projects:
        total_budget += float(project.project_budget)
        spent_budget += float(project.project_spent_money)
    return render(request, 'spendings.html',
                  {'projects': projects, 'total_budget': str(total_budget), 'spent_budget': str(spent_budget),'expenses':totalExpense})


@login_required
def detailedExpenses(request, pk):
    project = Project.objects.get(pk=pk)
    expenses = Expense.objects.filter(project_id=pk)
    return render(request, 'expenses-detailed.html', {'project': project, 'expenses': expenses})



@login_required
def add_expense(request, pk):
    if request.method == 'POST':
        d = json.dumps(request.POST)
        data = json.loads(d).get('data')
        data  = json.loads(data)
        project = Project.objects.get(pk=pk)
        if request.FILES.get('file'):
            doc_type = str(request.FILES.get('file')).split('.')[-1]
            Documents.objects.create(document=request.FILES.get('file'), project_id=pk, type=file_extensions[doc_type])
            Action.objects.create(author_id=request.user.pk, project_id=project.pk,action=f"{request.FILES.get('file')} nomli fayl qo'shdi")
        else:
            pass
        q = str(data['amount']).replace(' ','')
        if data['currency'] == 'usd':
            quantity = float(q) * float(currency_rate)
            project.project_spent_money = float(project.project_spent_money) + quantity
            project.save()
            expense = Expense.objects.create(project_id=pk, description=data['expense'], quantity=str(quantity),
                                         date=data['date'])
            Action.objects.create(author_id=request.user.pk, project_id=project.pk,action=f"{project.project_name} loyihasiga <strong>{expense.quantity}</strong> so'mlik miqdordagi xarajat qo'shdi")
            return JsonResponse({'id': expense.id, 'spent_money': Project.objects.get(pk=pk).project_spent_money,
                             'total_money': project.project_budget,'quantity':float(quantity)})
        else:
            project.project_spent_money = float(project.project_spent_money) + float(str(data['amount']).replace(' ', ''))
            project.save()
            expense = Expense.objects.create(project_id=pk, description=data['expense'], quantity=str(data['amount']).replace(' ',''),
                                         date=data['date'])
            Action.objects.create(author_id=request.user.pk, project_id=project.pk,action=f"{project.project_name} loyihasiga <strong>{expense.quantity}</strong> so'mlik miqdordagi xarajat qo'shdi")
            return JsonResponse({'id': expense.id, 'spent_money': Project.objects.get(pk=pk).project_spent_money,
                             'total_money': project.project_budget,'quantity':str(data['amount']).replace(' ','')})


@login_required
def delete_expense(request, pk):
    expense = Expense.objects.get(id=pk)
    project = Project.objects.get(pk=expense.project.pk)
    amount = expense.quantity.replace(" ", "")
    project.project_spent_money = float(project.project_spent_money) - float(amount)
    project.save()
    expense.delete()
    Action.objects.create(author_id=request.user.pk, project_id=project.pk, action=f"{project.project_name} loyihasidagi {expense.quantity} so'mlik xarajatni o'chirdi")
    return JsonResponse(status=200,
                        data={'succuss': True, 'spent_money': Project.objects.get(pk=project.pk).project_spent_money,
                              'total_money': project.project_budget})


@login_required
def updateBudget(request,pk):
    if request.method == 'POST':
        project = Project.objects.get(pk=pk)
        data = json.loads(request.body)
        project.project_budget = int(project.project_budget) + int(data['data'])
        project.save()
        Action.objects.create(author_id=request.user.pk,project_id=project.pk,action=f"{project.project_name} loyihasining budgeti {data['data']} so'mga oshirdi")
        return JsonResponse(status=200,
                            data={'succuss': True,
                                  'spent_money': Project.objects.get(pk=project.pk).project_spent_money,
                                  'total_money': project.project_budget})


@login_required
def deleteAll(request,pk):
    expenses = Expense.objects.filter(project_id=pk)
    project = Project.objects.get(pk=pk)
    project.project_spent_money = '0'
    project.save()
    expenses_list = ''
    for expense in expenses:
        expenses_list+= f" {expense.description} uchun {expense.quantity} so'm\n"
    Action.objects.create(project_id=pk,author_id=request.user.pk,action=f"{project.project_name} loyihasidagi barcha xarajatlarni o'chirib yubordi. Bu xarajatlar : <br><br>{expenses_list}")
    expenses.delete()
    return JsonResponse(status=200,data={'success':True})
