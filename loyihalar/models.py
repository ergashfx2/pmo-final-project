import uuid

from django.db import models
from django.utils import timezone

from hodimlar.models import User, Blog, Department

status_choices = (
    ('Yangi', "Yangi"),
    ('Jarayonda', "Jarayonda"),
    ('Tugatilgan', "Tugatilgan"),
)

status_problem_choices = (
    ('Yangi', "Yangi"),
    ('Ishlanmoqda', "Ishlanmoqda"),
    ('Hal qilindi', "Hal qilindi"),
)

size_choices = (
    ('Multi', "Multi"),
    ('Mono', "Mono"),
    ('Mega', "Mega"),
)

speed_choices = (
    ("O'rta", "O'rta"),
    ('Qisqa', "Qisqa"),
    ('Uzoq', "Uzoq"),
)

type_choices = (
    ("Aralash", "Aralash"),
    ('Iqtisodiy', "Iqtisodiy"),
    ('Raqamlashtirish', "Raqamlashtirish"),
    ('Strategik', "Strategik"),
    ('Tashkiliy', "Tashkiliy"),
    ('Texnologik', "Texnologik"),
)

level_choices = (
    ('Past', "Past"),
    ("O'rta", "O'rta"),
    ('Yuqori', "Yuqori"),
    ("O'ta yuqori", "O'ta yuqori"),
)


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ManyToManyField(User, related_name='author')
    project_curator = models.ForeignKey(User, related_name='curator', on_delete=models.CASCADE)
    project_name = models.CharField(max_length=200)
    project_blog = models.ForeignKey(Blog, models.CASCADE, related_name='blog')
    project_departments = models.ManyToManyField(Department)
    project_size = models.CharField(max_length=200, choices=size_choices)
    project_level = models.CharField(max_length=200, choices=level_choices)
    project_speed = models.CharField(max_length=200, choices=speed_choices)
    project_type = models.CharField(max_length=200, choices=type_choices)
    project_team = models.ManyToManyField(User, related_name='team')
    project_manager = models.ManyToManyField(User, related_name='manager')
    project_description = models.TextField()
    project_done_percentage = models.CharField(max_length=20, default=0)
    project_start_date = models.DateTimeField(auto_now=False)
    project_deadline = models.DateField(auto_now=False)
    project_budget = models.CharField(max_length=30)
    project_status = models.CharField(max_length=30, choices=status_choices, default='Yangi')
    project_spent_money = models.CharField(max_length=30, default=0)

    def update_project_done_percentage(self):
        self.project_done_percentage = str(self.project_done_percentage)
        self.save()


    def start_project(self):
        self.project_status = 'Jarayonda'
        self.save()

    def finish(self):
        self.project_status = 'Tugatilgan'
        self.save()

    def __str__(self):
        return self.project_name


class Phase(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    project = models.ForeignKey(Project, models.CASCADE)
    phase_name = models.CharField(max_length=250)
    phase_done_percentage = models.CharField(max_length=20, default=0)
    status = models.CharField(max_length=30, choices=status_choices, default='Yangi')

    def update_phase_done_percentage(self):
        self.phase_done_percentage = str(self.phase_done_percentage)
        self.save()

    def update_phase_name(self):
        self.phase_name = str(self.phase_name)
        self.save()

    def start(self):
        self.status = 'Jarayonda'
        self.save()

    def finish(self):
        self.status = 'Tugatilgan'
        self.save()

    def __str__(self):
        return self.phase_name


class Task(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    project = models.ForeignKey(Project, models.CASCADE)
    task_manager = models.CharField(max_length=250)
    task_deadline = models.DateField()
    phase = models.ForeignKey(Phase, models.CASCADE)
    task_name = models.CharField(max_length=250)
    task_done_percentage = models.CharField(max_length=20, default=0)
    status = models.CharField(max_length=150,choices=status_choices,default='Yangi')

    def update_task_done_percentage(self):
        self.task_done_percentage = str(self.task_done_percentage)
        self.save()

    def update_task_name(self):
        self.task_name = str(self.task_name)
        self.save()

    def start_task(self):
        self.status = 'Jarayonda'
        self.save()

    def finish(self):
        self.status = 'Tugatilgan'
        self.save()

    def __str__(self):
        return self.task_name


class Documents(models.Model):
    project = models.ForeignKey(Project, models.CASCADE)
    phase = models.ForeignKey(Phase, on_delete=models.CASCADE)
    document = models.FileField(upload_to='', blank=True, max_length=500)
    url = models.CharField(max_length=200, blank=True)
    type = models.CharField(max_length=150, default='url')
    created_at = models.DateField(auto_now=True)
    update_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.project.project_name


class Problems(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, models.CASCADE)
    project = models.ForeignKey(Project, models.CASCADE)
    phase = models.ForeignKey(Phase, models.CASCADE)
    problem = models.TextField()
    created_at = models.DateTimeField(auto_now=True, editable=False)
    update_at = models.DateTimeField(auto_now=True)

    def update_problem(self,problem):
        self.problem = problem
        self.update_at = timezone.now()
        self.save(update_fields=['problem'])


class Comments(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, models.CASCADE)
    project = models.ForeignKey(Project, models.CASCADE)
    phase = models.ForeignKey(Phase, models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now=True, editable=False)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.author.get_full_name()

    def update_comment(self,comment):
        self.comment = comment
        self.update_at = timezone.now()
        self.save(update_fields=['comment'])


class PermittedProjects(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
    project = models.ForeignKey(Project, models.CASCADE)

    def __str__(self):
        return self.project.project_name


class ProjectFiles(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False,primary_key=True)
    author = models.ForeignKey(User, models.CASCADE)
    project = models.ForeignKey(Project, models.CASCADE)
    file = models.FileField(upload_to='files/')
    file_name = models.CharField(max_length=300)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    size = models.FloatField(default=0)
