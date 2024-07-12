from django.contrib import admin
from .models import Phase, Task, Project, Documents,Comments,Problems,PermittedProjects

admin.site.register(Documents)
admin.site.register(Problems)
admin.site.register(PermittedProjects)

@admin.register(Comments)
class CommentsAdmin(admin.ModelAdmin):
      list_display = ['id','comment','created_at','update_at','project']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['project_name', 'project_budget', 'project_spent_money']


@admin.register(Phase)
class PhaseAdmin(admin.ModelAdmin):
    list_display = ['phase_name']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['phase', 'task_name']

