from django.urls import path
from .views import qualification,depDetailed,blogDetailed,all_actionsBlog,all_actionsDept

urlpatterns = [
    path('', qualification, name='qualification'),
    path('blog/<pk>', blogDetailed, name='blog-detailed'),
    path('department/<pk>', depDetailed, name='department-detailed'),
    path('all-actions/dept/<pk>', all_actionsDept, name='dept-all-actions'),
    path('all-actions/blog/<pk>', all_actionsBlog, name='blog-all-actions'),
]
