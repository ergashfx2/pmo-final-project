import uuid

from django.db import models

from projects.models import Project
from django.utils import timezone


class Expense(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quantity = models.CharField(max_length=250)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    description = models.TextField(blank=True)
    document = models.FileField(blank=True)

    def __str__(self):
        return self.project.project_name
