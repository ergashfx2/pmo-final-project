from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.shortcuts import render

from hodimlar.models import Blog, Department
from loyihalar.models import Project


# Create your views here.
@login_required
def qualification(request):
    global total_budget
    dep_datas = []
    blog_datas = []
    for blog in Blog.objects.all():
        total_budget_blog = \
            Project.objects.filter(project_blog=blog).aggregate(total_budget=Sum('project_budget'))[
                'total_budget']
        total_spent_blog = \
            Project.objects.filter(project_blog=blog).aggregate(
                total_budget=Sum('project_spent_money'))[
                'total_budget']
        if total_spent_blog is None:
            total_spent_blog = 0
        if total_budget_blog is None:
            total_budget_blog = 0
        data = {'blog_id':blog.pk,'blog_name': blog.blog_name, 'projects_count_blog': Project.objects.filter(project_blog=blog).count(),
                'new_projects_blog': Project.objects.filter(project_status='Yangi', project_blog=blog).count(),
                'projects_processing_blog': Project.objects.filter(project_status='Jarayonda',
                                                                   project_blog=blog).count(),
                'projects_finished_blog': Project.objects.filter(project_status='Tugatilgan',
                                                            project_blog=blog).count(),
                'total_budget_blog': total_budget_blog, 'total_spent_blog': total_spent_blog
                }
        blog_datas.append(data)

    for department in Department.objects.all():
        total_budget = \
            Project.objects.filter(project_departments__department_name__contains=department.department_name).aggregate(
                total_budget=Sum('project_budget'))[
                'total_budget']
        total_spent = \
            Project.objects.filter(project_departments__department_name__contains=department.department_name).aggregate(
                total_budget=Sum('project_spent_money'))[
                'total_budget']
        if total_budget is not None:
            print(total_budget)
        if total_budget is None:
            total_budget = 0
        if total_spent is None:
            total_spent = 0
        data = {'department_id':department.pk,'department_name': department.department_name, 'projects_count': Project.objects.filter(
            project_departments__department_name__contains=department).count(),
                'new_projects': Project.objects.filter(project_status='Yangi',
                                                       project_departments__department_name__contains=department).count(),
                'projects_processing': Project.objects.filter(project_status='Jarayonda',
                                                              project_departments__department_name__contains=department.department_name).count(),
                'projects_finished': Project.objects.filter(project_status='Tugatilgan',
                                                            project_departments__department_name__contains=department.department_name).count(),
                'total_budget': total_budget, 'total_spent': total_spent
                }

        dep_datas.append(data)

    return render(request, 'qualification.html', context={'dept_data': dep_datas,'b_data':blog_datas})


@login_required
def blogDetailed(request,pk):
    projects = Project.objects.filter(project_blog_id=pk)
    project_new = projects.filter(project_status='Yangi').count()
    project_processing = projects.filter(project_status='Jarayonda').count()
    project_done = projects.filter(project_status='Tugatilgan').count()
    return render(request,'blog_detailed.html',{'projects':projects,'projects_new':project_new,'projects_processing':project_processing,'projects_done':project_done})


@login_required
def depDetailed(request,pk):
    projects = Project.objects.filter(project_departments__department_name__contains=Department.objects.get(pk=pk).department_name)
    return render(request,'dep_detailed.html',{'projects':projects})