import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from loyihalar.models import Project,Documents
from .models import Expense
from loyihalar.views import file_extensions

@login_required
def qualification(request):
    return render(request, 'qualification.html')


@login_required
def spending(request):
    projects = Project.objects.all()
    total_budget = 0
    spent_budget = 0
    for project in projects:
        total_budget += int(project.project_budget.replace(" ",''))
        spent_budget += int(project.project_spent_money.replace(" ",''))
    return render(request, 'spendings.html', {'projects': projects,'total_budget':str(total_budget),'spent_budget':str(spent_budget)})


@login_required
def detailedExpenses(request, pk):
    project = Project.objects.get(pk=pk)
    expenses = Expense.objects.filter(project_id=pk)
    return render(request, 'expenses-detailed.html', {'project': project, 'expenses': expenses})


@login_required
def add_expense(request, pk):
    if request.method == 'POST':
        data = json.loads(request.POST.get('data'))
        project = Project.objects.get(pk=pk)
        amount = data['amount'].replace(" ","")
        project.project_spent_money = int(project.project_spent_money) + int(amount)
        project.save()
        if request.FILES.get('file'):
            doc_type = str(request.FILES.get('file')).split('.')[-1]
            Documents.objects.create(document=request.FILES.get('file'),project_id=pk,type=file_extensions[doc_type])
        else:
            pass
        expense = Expense.objects.create(project_id=pk, description=data['expense'], quantity=data['amount'],date=data['date'])
        return JsonResponse({'id': expense.id,'spent_money':Project.objects.get(pk=pk).project_spent_money,'total_money': project.project_budget})


@login_required
def delete_expense(request, pk):
    expense = Expense.objects.get(id=pk)
    project = Project.objects.get(pk=expense.project.pk)
    amount = expense.quantity.replace(" ", "")
    project.project_spent_money = int(project.project_spent_money) - int(amount)
    project.save()
    expense.delete()
    return JsonResponse(status=200,data={'succuss':True,'spent_money':Project.objects.get(pk=project.pk).project_spent_money,'total_money': project.project_budget})
