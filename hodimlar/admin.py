from django.contrib import admin
from hodimlar.models import User, Department, Blog


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'first_name', 'last_name', 'role', 'status', 'department', 'blog']


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['blog_name']

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['blog_name','department_name']
