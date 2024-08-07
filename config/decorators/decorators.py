from django.shortcuts import render

from utils import isAdmin


def admin_required(view_func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated and isAdmin(request.user):
            pass
        else:
            return render(request, 'blank_page.html')

        response = view_func(request, *args, **kwargs)
        return response

    return wrapper
