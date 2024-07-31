from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.shortcuts import render
from django.utils import timezone

from actions.models import Action
from hodimlar.models import Blog, Department
from loyihalar.models import Project
from config.views import getExpensesAll
from loyihalar.views import paginate_projects

@login_required
def qualification(request):
    global total_budget
    dep_datas = get_department_data(Department.objects.all())
    blog_datas = get_blog_data(Blog.objects.all())

    if request.GET.get('qualification') == 'blog':
        return render(request, 'qualification.html', context={'b_data': blog_datas})
    elif request.GET.get('qualification=') == 'dept':
        return render(request, 'qualification.html', context={'dept_data': dep_datas})
    else:
        return render(request, 'qualification.html', context={'dept_data': dep_datas})


@login_required
def blogDetailed(request, pk):
    total = getExpensesAll(year=timezone.now().year, blog_id=pk)
    projects = Project.objects.filter(project_blog_id=pk)
    paginated = paginate_projects(request, projects)
    projects_all = projects.all().count()
    project_processing = projects.filter(project_status='Jarayonda').count()
    project_done = projects.filter(project_status='Tugatilgan').count()
    actions = Action.objects.filter(project__project_blog_id=pk).order_by('-date')[:5]
    return render(request, 'blog_detailed.html',
                  {'projects': paginated, 'projects_all': projects_all, 'projects_processing': project_processing,
                   'projects_done': project_done, 'actions': actions, 'blog_id': pk, 'expenses': total})


@login_required
def depDetailed(request, pk):
    dept = Department.objects.get(pk=pk)
    total = getExpensesAll(year=timezone.now().year, dept_id=pk)
    projects = Project.objects.filter(project_departments__department_name__contains=dept.department_name)
    paginated = paginate_projects(request, projects)
    project_all = projects.all().count()
    project_processing = projects.filter(project_status='Jarayonda').count()
    project_done = projects.filter(project_status='Tugatilgan').count()
    actions = Action.objects.filter(project__project_departments__department_name=dept.department_name).order_by(
        '-date')[:5]
    return render(request, 'dep_detailed.html',
                  {'projects': paginated, 'projects_all': project_all, 'projects_processing': project_processing,
                   'projects_done': project_done, 'actions': actions, 'blog_id': pk, 'expenses': total})


@login_required
def all_actionsBlog(request, pk):
    actions = Action.objects.filter(project__project_blog=Blog.objects.get(pk=pk))
    return render(request, 'all_actions.html', {'actions': actions})


@login_required
def all_actionsDept(request, pk):
    actions = Action.objects.filter(
        project__project_departments__department_name=Department.objects.get(pk=pk).department_name)
    return render(request, 'all_actions.html', {'actions': actions})


def get_blog_data(blogs):
    blog_datas = []
    for blog in blogs:
        total_budget_blog = Project.objects.filter(project_blog=blog).aggregate(total_budget=Sum('project_budget'))[
            'total_budget']
        total_spent_blog = Project.objects.filter(project_blog=blog).aggregate(total_budget=Sum('project_spent_money'))[
            'total_budget']
        if total_spent_blog is None:
            total_spent_blog = 0
        if total_budget_blog is None:
            total_budget_blog = 0
        data = {
            'blog_id': blog.pk,
            'blog_name': blog.blog_name,
            'projects_count_blog': Project.objects.filter(project_blog=blog).count(),
            'new_projects_blog': Project.objects.filter(project_status='Yangi', project_blog=blog).count(),
            'projects_processing_blog': Project.objects.filter(project_status='Jarayonda', project_blog=blog).count(),
            'projects_finished_blog': Project.objects.filter(project_status='Tugatilgan', project_blog=blog).count(),
            'total_budget_blog': total_budget_blog,
            'total_spent_blog': total_spent_blog
        }
        blog_datas.append(data)
    return blog_datas


def get_department_data(departments):
    dep_datas = []
    for department in departments:
        total_budget = \
            Project.objects.filter(project_departments__department_name__contains=department.department_name).aggregate(
                total_budget=Sum('project_budget'))['total_budget']
        total_spent = \
            Project.objects.filter(project_departments__department_name__contains=department.department_name).aggregate(
                total_budget=Sum('project_spent_money'))['total_budget']
        if total_budget is None:
            total_budget = 0
        if total_spent is None:
            total_spent = 0
        data = {
            'department_id': department.pk,
            'department_name': department.department_name,
            'projects_count': Project.objects.filter(
                project_departments__department_name__contains=department.department_name).count(),
            'new_projects': Project.objects.filter(project_status='Yangi',
                                                   project_departments__department_name__contains=department.department_name).count(),
            'projects_processing': Project.objects.filter(project_status='Jarayonda',
                                                          project_departments__department_name__contains=department.department_name).count(),
            'projects_finished': Project.objects.filter(project_status='Tugatilgan',
                                                        project_departments__department_name__contains=department.department_name).count(),
            'total_budget': total_budget,
            'total_spent': total_spent
        }
        dep_datas.append(data)
    return dep_datas
