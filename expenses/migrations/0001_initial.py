# Generated by Django 5.0.6 on 2024-06-24 06:35

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('loyihalar', '0013_remove_project_author_project_author'),
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.CharField(max_length=250)),
                ('date', models.DateField(default=datetime.datetime(2024, 6, 24, 11, 35, 36, 428617))),
                ('description', models.TextField(blank=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='loyihalar.project')),
            ],
        ),
    ]
