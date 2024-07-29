from django.db import models

from hodimlar.models import User
from loyihalar.models import Project


class Action(models.Model):
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    action = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE,blank=True)

