import json
from loyihalar.views import get_user_projects
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.core import serializers
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.views.generic import UpdateView, ListView
from loyihalar.models import PermittedProjects, Project
from .forms import UpdateUserForm, CreateUserForm

from .forms import UserLoginForm

User = get_user_model()


@login_required
def profileView(request):
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user.username)
        permitted_projects,projects_count = get_permitted_projects(request)
        return render(request, 'profile.html', {'user': user,'permitted_projects':permitted_projects,'projects_count':projects_count})


@login_required
def profileView2(request,pk):
    if request.user.is_authenticated:
        user = User.objects.get(pk=pk)
        permitted_projects,projects_count = get_permitted_projects(request)
        return render(request, 'profile2.html', {'user': user,'permitted_projects':permitted_projects,'projects_count':projects_count})


def get_permitted_projects(request):
    pk = request.user.pk
    permitted_projects = PermittedProjects.objects.filter(user=request.user)
    projects_count = Project.objects.filter(
        Q(author=pk) |
        Q(project_curator=pk) |
        Q(project_team=pk)
    ).distinct().count()
    return permitted_projects, projects_count

class UsersView(ListView):
    model = User
    template_name = 'users.html'
    paginate_by = 10
    page_kwarg = 'page'


def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')

    form = UserLoginForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            try:
                User.objects.get(username=username)
                form.add_error('password', 'Parolingiz xato kiritilgan')
            except User.DoesNotExist:
                form.add_error('username', 'Username mavjud emas')

    return render(request, 'login.html', {'form': form})


def logoutView(request):
    logout(request)
    return redirect('hodimlar:login')


class UserUpdateView(UpdateView, LoginRequiredMixin):
    model = User
    form_class = UpdateUserForm
    template_name = 'update_user.html'

    def get_success_url(self):
        return reverse('hodimlar:profile')


@login_required
def create_user(request):
    if request.method == "POST":
        form = CreateUserForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            form.clean()
            form.save()
            return redirect('hodimlar:users')
    else:
        form = CreateUserForm()
    return render(request, "createUser.html", {"form": form})


@login_required
def block_user(request, pk):
        user = User.objects.get(pk=pk)
        user.block()
        return JsonResponse(status=200, data={'success': True})


@login_required
def unblock_user(request, pk):
        user = get_object_or_404(User, pk=pk)
        user.unblock()
        return JsonResponse(status=200, data={'success': True})


@login_required
def delete_user(request, pk):
    user = User.objects.get(pk=pk)
    projects = get_user_projects(user)
    for project in projects:
        project.delete()
    user.delete()
    return JsonResponse(status=200,data={'success':True})

@login_required
def get_users_serialized(request):
    users = serializers.serialize('json', User.objects.all())
    users_array = json.loads(users)
    for user in users_array:
        fields = dict(user)['fields']
        fields['user_id'] = dict(user).get('pk')

    users = json.dumps(users_array)
    return JsonResponse(data=users, safe=False, status=200)

