from collections import defaultdict

from django.db.models import Count, Sum, F, IntegerField, Value
from django.db.models.functions import TruncMonth, Replace, Cast
from django.shortcuts import render
from django.contrib.auth import get_user_model

from expenses.models import Expense
from loyihalar.models import Project
from django.utils import timezone

User = get_user_model()
from hodimlar.models import *


def getExpensesAll(year, blog_id=None, dept_id=None):
    monthly_expense_totals = defaultdict(lambda: 0)
    global expenses

    if blog_id is not None and dept_id is None:
        print('blog working')
        expenses = (
            Expense.objects
            .filter(date__year=year, project__project_blog_id=blog_id)
            .annotate(month=TruncMonth('date'))
            .annotate(
                quantity_int=Cast(Replace('quantity', Value(' '), Value('')), IntegerField())
            )
            .values('month')
            .annotate(total_quantity=Sum('quantity_int'))
            .order_by('month')
        )
    elif dept_id is not None:
        department_name = Department.objects.get(id=dept_id).department_name
        expenses = (
            Expense.objects
            .filter(date__year=year, project__project_departments__department_name=department_name)
            .annotate(month=TruncMonth('date'))
            .annotate(
                quantity_int=Cast(Replace('quantity', Value(' '), Value('')), IntegerField())
            )
            .values('month')
            .annotate(total_quantity=Sum('quantity_int'))
            .order_by('month')
        )
    else:
        expenses = (
            Expense.objects
            .filter(date__year=year)
            .annotate(month=TruncMonth('date'))
            .annotate(
                quantity_int=Cast(Replace('quantity', Value(' '), Value('')), IntegerField())
            )
            .values('month')
            .annotate(total_quantity=Sum('quantity_int'))
            .order_by('month')
        )

    for expense in expenses:
        month_str = expense['month'].strftime('%Y-%m')
        monthly_expense_totals[month_str] = expense['total_quantity'] / 1000000

    for month in range(1, 13):
        month_str = f"{year}-{month:02d}"
        if month_str not in monthly_expense_totals:
            monthly_expense_totals[month_str] = 0

    sorted_expenses = sorted(monthly_expense_totals.items())
    context = {
        'year': year,
        'monthly_expenses': sorted_expenses
    }

    return context

def home(request):
    if request.user.is_authenticated:
        totalExpense = getExpensesAll(year=timezone.now().year)
        users = User.objects.annotate(
            projects=Count('author', distinct=True) + Count('team', distinct=True) + Count('manager',
                                                                                           distinct=True) + Count(
                'curator', distinct=True))[:4]
        projects_count = Project.objects.all().count()
        projects_done = Project.objects.filter(project_status='Tugatilgan').count()
        projects_process = Project.objects.filter(project_status='Jarayonda').count()
        return render(request, 'index.html',
                      {'users': users, 'projects_count': projects_count, 'project_done': projects_done,
                       'projects_process': projects_process, 'expenses': totalExpense})
    else:
        return render(request, 'index.html')


def blockedPage(request):
    if request.user.is_authenticated:
        return render(request, 'blocked_page.html')
