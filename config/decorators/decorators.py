from django.contrib.auth.decorators import user_passes_test

from utils import isAdmin


def admin_required(fn=None):
    decorator = user_passes_test(isAdmin)
    if fn:
        decorator(fn)
    return decorator

