import json

from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.shortcuts import redirect, render
from django.contrib.auth import get_user_model
from django.views.decorators.cache import cache_page

from loyihalar.models import Project

User = get_user_model()
from hodimlar.models import *

def home(request):
    if request.user.is_authenticated:
        users = User.objects.all()[:4]
        pk = request.user.id
        projects_count = Project.objects.count()
        projects_done = Project.objects.filter(project_status='Tugatilgan').count()
        projects_process = Project.objects.filter(project_status='Jarayonda').count()

        print(projects_process)
        return render(request, 'index.html', {'users': users,'projects_count':projects_count,'project_done':projects_done,'projects_process':projects_process,})
    else:
        return render(request, 'index.html')


def blockedPage(request):
    if request.user.is_authenticated:
        return render(request,'blocked_page.html')