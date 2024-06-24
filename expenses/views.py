import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from loyihalar.models import Project
from .models import Expense


@login_required
def qualification(request):
    return render(request, 'qualification.html')


@login_required
def spending(request):
    projects = Project.objects.all()
    return render(request, 'spendings.html', {'projects': projects})


@login_required
def detailedExpenses(request, pk):
    project = Project.objects.get(pk=pk)
    expenses = Expense.objects.filter(project_id=pk)
    return render(request, 'expenses-detailed.html', {'project': project, 'expenses': expenses})


@login_required
def add_expense(request, pk):
    if request.method == 'POST':
        data = json.loads(request.body)
        project = Project.objects.get(pk=pk)
        amount = data['amount'].replace(" ","")
        project.project_spent_money = int(project.project_spent_money) + int(amount)
        project.save()
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
