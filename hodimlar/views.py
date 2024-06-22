from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy, reverse
from django.views.generic import UpdateView, ListView, CreateView, View

from loyihalar.models import PermittedProjects, Project
from .forms import UpdateUserForm, CreateUserForm

from .forms import UserLoginForm

User = get_user_model()


@login_required
def profileView(request):
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user.username)
        permitted_projects = PermittedProjects.objects.filter(user=request.user)
        projects_count = len(Project.objects.filter(Q(author=request.user.pk) | Q(project_curator=request.user.pk)))
        return render(request, 'profile.html', {'user': user,'permitted_projects':permitted_projects,'projects_count':projects_count})


@login_required
def profileView2(request,pk):
    if request.user.is_authenticated:
        user = User.objects.get(pk=pk)
        permitted_projects = PermittedProjects.objects.filter(user=request.user)
        projects_count = Project.objects.filter(
            Q(author=pk) |
            Q(project_curator=pk) |
            Q(project_team=pk)
        ).distinct()
        return render(request, 'profile2.html', {'user': user,'permitted_projects':permitted_projects,'projects_count':len(projects_count)})

class UsersView(ListView):
    model = User
    template_name = 'users.html'


def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    form = UserLoginForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is None:
            try:
                user = User.objects.filter(username=username)
                username = user.values()[0]['username']
                user = authenticate(request, username=username, password=password)
                print(user)
            except User.DoesNotExist:
                user = None

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'login.html', context={'form': form, 'error': 'Parol yoki username xato kiritlgan'})
    else:
        form = UserLoginForm()
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
    print('working')
    if request.method == "POST":
        user = User.objects.get(pk=pk)
        user.block()
        print("Working")
        return redirect('hodimlar:users')


@login_required
def unblock_user(request, pk):
    if request.method == "POST":
        user = get_object_or_404(User, pk=pk)
        user.unblock()
        return redirect('hodimlar:users')


@login_required
def delete_user(request, pk):
    if request.method == "POST":
        user = User.objects.get(pk=pk)
        user.delete()
        return redirect('hodimlar:users')
