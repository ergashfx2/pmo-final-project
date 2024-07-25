# myapp/management/commands/generate_fake_users.py
from django.core.management.base import BaseCommand
from faker import Faker
import random
from hodimlar.models import User


class Command(BaseCommand):
    help = 'Generate fake users'

    def handle(self, *args, **kwargs):
        fake = Faker()

        for _ in range(50):
            username = fake.unique.user_name()
            user = User(
                username=username,
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.unique.email(),
                position=fake.job(),
                role=fake.job(),
                status='Active' if random.choice([True, False]) else 'Blocked',
                phone=fake.phone_number(),
                avatar='images/human.jpg',
                blog=fake.url(),
                department=fake.company(),
            )
            user.set_password(fake.password())
            user.save()

        self.stdout.write(self.style.SUCCESS('Successfully generated 50 fake users.'))
