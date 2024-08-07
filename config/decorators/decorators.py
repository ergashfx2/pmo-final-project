from django.http import JsonResponse
from django.shortcuts import render

from utils import isAdmin


def admin_required(view_func):
    print('checking')
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated and isAdmin(request.user):
            pass
        else:
            return render(request, 'blank_page.html')

        response = view_func(request, *args, **kwargs)
        return response

    return wrapper


from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin


class AdminUserMixin(LoginRequiredMixin, UserPassesTestMixin):

    def test_func(self):
        return self.request.user.role == 'Admin'

    def handle_no_permission(self):
        return JsonResponse(
            {'message': 'Only company administrators have access to this view'}
        )