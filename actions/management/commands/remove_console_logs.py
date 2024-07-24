import os
import re
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Remove all console.log statements from JavaScript files.'

    def handle(self, *args, **kwargs):
        root_dir = os.path.join(os.path.dirname(__file__), '../../../static')
        pattern = re.compile(r'console\.log\(.*?\);?')

        for subdir, _, files in os.walk(root_dir):
            for file in files:
                if file.endswith('.js'):
                    file_path = os.path.join(subdir, file)
                    with open(file_path, 'r') as f:
                        content = f.read()
                    new_content = re.sub(pattern, '', content)
                    with open(file_path, 'w') as f:
                        f.write(new_content)
                    self.stdout.write(self.style.SUCCESS(f'Removed console.log from {file_path}'))
