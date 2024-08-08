from django.forms import inlineformset_factory
from .models import Phase,Task
from .forms import AddTaskForm

TaskFormSet = inlineformset_factory(Phase,Task,AddTaskForm,extra=5)