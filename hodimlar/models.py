import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager
class Blog(models.Model):
    blog_name = models.CharField(max_length=200)

    def __str__(self):
        return self.blog_name


class Department(models.Model):
    blog_name = models.ForeignKey(Blog, on_delete=models.CASCADE)
    department_name = models.CharField(max_length=200)

    def __str__(self):
        return self.department_name


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    position = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    status = models.CharField(max_length=50, default='Active')
    phone = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='images/',default='human.jpg', max_length=300,blank=True)
    blog = models.CharField(max_length=200, blank=True)
    department = models.CharField(max_length=200,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    def get_username(self):
        return self.username

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def block(self):
        self.status = 'Blocked'
        self.save()

    def unblock(self):
        self.status = 'Active'
        self.save()

    def __str__(self):
        return self.username
