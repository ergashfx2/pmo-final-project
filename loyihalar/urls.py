from django.urls import path
from .views import all_projects, get_project, myProjects, DetailMyProjects, CreateProject, UpdateProject, DeleteProject, \
    add_phase, update_phase, delete_phase, update_task, delete_task, update_task_percentage, delete_files, \
    owned_projects,create_archive,post_comment,post_problem,edit_comment,edit_problem,delete_comment,delete_problem,add_team_member,remove_team_member,filter_table,get_task

urlpatterns = [
    path('all/', all_projects, name='all-projects'),
    path('all/filter/', filter_table, name='filter-table'),
    path('add-team-member/<pk>', add_team_member, name='add-team-member'),
    path('remove-team-member/<pk>', remove_team_member, name='remove-team-member'),
    path('my-projects/', myProjects, name='my-projects'),
    path('owner-projects/', owned_projects, name='owned-projects'),
    path('my-projects/edit/<pk>', UpdateProject.as_view(), name='update-project'),
    path('my-projects/detail/post-comment/<pk>', post_comment, name='post-comment'),
    path('my-projects/detail/edit-comment/<pk>', edit_comment, name='edit-comment'),
    path('my-projects/detail/delete-comment/<pk>', delete_comment, name='delete-comment'),
    path('my-projects/detail/post-problem/<pk>', post_problem, name='post-problem'),
    path('my-projects/detail/edit-problem/<pk>', edit_problem, name='edit-problem'),
    path('my-projects/detail/delete-problem/<pk>', delete_problem, name='delete-problem'),
    path('my-projects/add-file/<pk>', myProjects, name='add-file'),
    path('my-projects/delete/<pk>', DeleteProject, name='delete-my-project'),
    path('my-projects/detail/create-archive/<pk>', create_archive, name='create-archive'),
    path('my-projects/delete-phase/<pk>', delete_phase, name='delete-phase'),
    path('my-projects/delete-task/<pk>', delete_task, name='delete-task'),
    path('my-projects/detail/<pk>/add-phase/', add_phase, name='add-phase'),
    path('my-projects/detail/get-task/<pk>', get_task, name='get-task'),
    path('my-projects/detail/<pk>', DetailMyProjects, name='my-projects-detail'),
    path('my-projects/detail/update-phase/<pk>', update_phase, name='update-phase'),
    path('my-projects/detail/update-task/<pk>', update_task, name='update-task'),
    path('my-projects/detail/delete-files/', delete_files, name='delete-files'),
    path('my-projects/detail/update-task-percentage/<pk>', update_task_percentage, name='update-task-percentage'),
    path('my-projects/create/', CreateProject, name='create-project'),
    path('<pk>/', get_project, name='get-project'),
]
