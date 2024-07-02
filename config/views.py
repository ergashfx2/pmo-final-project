
from django.db.models import Count
from django.shortcuts import render
from django.contrib.auth import get_user_model

from loyihalar.models import Project
from django.utils import timezone
User = get_user_model()
from hodimlar.models import *

def home(request):
    if request.user.is_authenticated:
        print(timezone.now())
        users = User.objects.annotate(projects=Count('author',distinct=True) + Count('team',distinct=True) + Count('manager',distinct=True) + Count('curator',distinct=True))[:4]
        projects_count = Project.objects.all().count()
        projects_done = Project.objects.filter(project_status='Tugatilgan').count()
        projects_process = Project.objects.filter(project_status='Jarayonda').count()
        return render(request, 'index.html', {'users': users,'projects_count':projects_count,'project_done':projects_done,'projects_process':projects_process,})
    else:
        return render(request, 'index.html')


def blockedPage(request):
    if request.user.is_authenticated:
        return render(request,'blocked_page.html')