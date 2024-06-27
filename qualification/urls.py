from django.urls import path
from .views import qualification,depDetailed,blogDetailed

urlpatterns = [
    path('', qualification, name='qualification'),
    path('blog/<pk>', blogDetailed, name='blog-detailed'),
    path('department/<pk>', depDetailed, name='department-detailed'),
]
