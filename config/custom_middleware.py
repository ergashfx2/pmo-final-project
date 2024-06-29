from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model, logout

User = get_user_model()



class UserStatusCheckMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated:
            user = request.user
            if hasattr(user, 'status') and user.status != 'Active':
                logout(request)
                return render(request, 'blocked_page.html')

class LogOriginMiddleware(MiddlewareMixin):
    def process_request(self, request):
        print("Request Origin:", request.META.get('HTTP_ORIGIN'))
        return None