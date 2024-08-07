from collections import defaultdict

from django.contrib.auth.decorators import login_required
from django.db.models import Count, Sum, F, IntegerField, Value, Q
from django.db.models.functions import TruncMonth, Replace, Cast
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone

from expenses.models import Expense
from loyihalar.models import Project
from loyihalar.views import get_user_projects
from hodimlar.models import Department

User = get_user_model()

def get_expenses_all(year, blog_id=None, dept_id=None):
    monthly_expense_totals = defaultdict(lambda: 0)

    filters = {'date__year': year}
    if blog_id:
        filters['project__project_blog_id'] = blog_id
    elif dept_id:
        department_name = get_object_or_404(Department, id=dept_id).department_name
        filters['project__project_departments__department_name'] = department_name

    expenses = (
        Expense.objects
        .filter(**filters)
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
    return {'year': year, 'monthly_expenses': sorted_expenses}

@login_required
def home(request):
    if request.user.is_authenticated:
        current_year = timezone.now().year
        total_expense = get_expenses_all(year=current_year)
        projects = get_user_projects(request.user)
        projects_count = Project.objects.count()
        projects_done = Project.objects.filter(project_status='Tugatilgan').count()
        projects_process = Project.objects.filter(project_status='Jarayonda').count()
        context = {
            'projects': projects[:5],
            'projects_count': projects_count,
            'project_done': projects_done,
            'projects_process': projects_process,
            'expenses': total_expense,
        }
        return render(request, 'index.html', context)
    else:
        return redirect('hodimlar:login')

@login_required
def blocked_page(request):
    return render(request, 'blocked_page.html')
