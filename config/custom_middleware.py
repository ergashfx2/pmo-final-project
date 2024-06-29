from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model, logout

User = get_user_model()


def process_request(request):
    if request.user.is_authenticated and request.user.status != 'Active':
        logout(request)
        return render(request, 'blocked_page.html')
    # if request.user.is_authenticated:
    #     role = request.user.role
    #     simple_urls = [
    #         ''
    #         '/users/view/',
    #         '/users/login/',
    #         '/users/logout/',
    #         '/users/profile/',
    #     ]
    #     if role == 'Oddiy' and request.path not in simple_urls:
    #         return render(request,'index.html')


class CustomMiddleware(MiddlewareMixin):
    pass

