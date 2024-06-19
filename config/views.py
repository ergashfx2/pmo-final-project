import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.contrib.auth import get_user_model
from django.views.decorators.cache import cache_page

User = get_user_model()
from hodimlar.models import *

def home(request):
    if request.user.is_authenticated:
        user = User.objects.get(pk=request.user.pk)
        users = User.objects.all()
        labels = {}
        departments = Department.objects.all()
        bb= Department.objects.filter(blog_name=10)
        blogs = Blog.objects.all()
        for blog in blogs:
            blog_departments = 0
            for department in departments:
                if department.blog_name.blog_name == blog.blog_name:
                    blog_departments += 1
            words = blog.blog_name.split()
            first_word = [word[0].title() for word in words]
            blog_name = ' '.join(first_word)
            labels[blog_name] = blog_departments
        labels_object = json.dumps(labels)

        return render(request, 'index.html', {'user': user, 'departments': len(departments), 'labels': labels_object,'users':users})
    else:
        return render(request, 'index.html')


def blockedPage(request):
    if request.user.is_authenticated:
        return render(request,'blocked_page.html')