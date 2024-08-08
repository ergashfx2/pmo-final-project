# myapp/management/commands/generate_fake_projects.py
from django.core.management.base import BaseCommand
from faker import Faker
import random
from projects.models import Project, User, Blog, Department

class Command(BaseCommand):
    help = 'Generate fake projects'

    def handle(self, *args, **kwargs):
        fake = Faker()

        users = list(User.objects.all())
        blogs = list(Blog.objects.all())
        departments = list(Department.objects.all())

        if not users or not blogs or not departments:
            self.stdout.write(self.style.ERROR('Please make sure there are users, blogs, and departments in the database.'))
            return

        size_choices = [choice[0] for choice in Project._meta.get_field('project_size').choices]
        level_choices = [choice[0] for choice in Project._meta.get_field('project_level').choices]
        speed_choices = [choice[0] for choice in Project._meta.get_field('project_speed').choices]
        type_choices = [choice[0] for choice in Project._meta.get_field('project_type').choices]
        status_choices = [choice[0] for choice in Project._meta.get_field('project_status').choices]

        for _ in range(50):
            project = Project(
                project_curator=random.choice(users),
                project_name=fake.company(),
                project_blog=random.choice(blogs),
                project_size=random.choice(size_choices),
                project_level=random.choice(level_choices),
                project_speed=random.choice(speed_choices),
                project_type=random.choice(type_choices),
                project_description=fake.text(),
                project_done_percentage=str(random.randint(0, 100)),
                project_start_date=fake.date_time_this_decade(),
                project_deadline=fake.date_this_decade(),
                project_budget=str(random.randint(1000, 100000)),
                project_status=random.choice(status_choices),
                project_spent_money=str(random.randint(0, 100000))
            )
            project.save()
            project.author.set(random.sample(users, k=random.randint(1, 3)))
            project.project_departments.set(random.sample(departments, k=random.randint(1, 3)))
            project.project_team.set(random.sample(users, k=random.randint(1, 5)))
            project.project_manager.set(random.sample(users, k=random.randint(1, 2)))

        self.stdout.write(self.style.SUCCESS('Successfully generated 50 fake projects.'))
