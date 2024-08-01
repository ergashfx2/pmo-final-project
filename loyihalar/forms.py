from django.contrib.admin.widgets import FilteredSelectMultiple
from django.contrib.auth import get_user_model
from django.forms import forms, ModelForm
from django_summernote.widgets import SummernoteWidget, SummernoteInplaceWidget

from hodimlar.models import Department, Blog
from loyihalar.models import Project, status_choices, level_choices, size_choices, speed_choices, type_choices, \
    PermittedProjects, Comments, Problems
from .models import Documents, Phase, Task,ProjectFiles
from django import forms

User = get_user_model()


class CreateProjectForm(ModelForm):
    class Meta:
        model = Project
        exclude = ['project_spent_money', 'project_status', 'project_done_percentage']
        labels = {
            'author': "Loyiha tashabbuskori(tashabbuskorlari)",
            'project_curator': 'Loyiha kuratori',
            'project_name': 'Loyiha nomi',
            'project_blog': 'Blok',
            'project_size': 'Hajmi',
            'project_level': 'Darajasi',
            'project_speed': 'Muddati',
            'project_type': 'Turi',
            'project_team': 'Strategiya departamentidan biriktirilgan hodim(lar)',
            'project_manager': 'Loyiha menejeri(lari)',
            'project_description': 'Qisqacha',
            'project_start_date': 'Boshlanish sanasi',
            'project_deadline': 'Tugash sanasi',
            'project_budget': 'Budjeti',
            'project_status': 'Statusi',
            'project_spent_money': 'Xarajatlar',
            'project_departments': 'Departamentlar',
        }
        widgets = {
            'project_name': forms.TextInput(attrs={'class': 'form-control'}),
            'author': forms.SelectMultiple(
                attrs={'class': 'select2 w-100'}),
            'project_size': forms.Select(attrs={'class': 'form-control'}, choices=size_choices),
            'project_level': forms.Select(attrs={'class': 'form-control'}, choices=level_choices),
            'project_speed': forms.Select(attrs={'class': 'form-control'}, choices=speed_choices),
            'project_type': forms.Select(attrs={'class': 'form-control'}, choices=type_choices),
            'project_description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'project_start_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'project_deadline': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'project_budget': forms.TextInput(attrs={'class': 'form-control'}),
            'project_status': forms.Select(attrs={'class': 'form-control'}, choices=status_choices),
            'project_spent_money': forms.TextInput(attrs={'class': 'form-control'}),
            'project_curator': forms.Select(attrs={'class': 'form-control'}),
            'project_manager': forms.SelectMultiple(attrs={'class': 'select2 w-100'}),
            'project_blog': forms.Select(attrs={'class': 'form-control'}),
            'project_team': forms.SelectMultiple(attrs={'class': 'select2 w-100'}),
            'project_departments': forms.SelectMultiple(attrs={'class': 'select2 w-100'}),
        }

    def clean_spent_money(self):
        cleaned_data = self.cleaned_data['project_spent_money']
        cleaned_data = cleaned_data.replace(' ', '')
        return cleaned_data

    def clean_project_budget(self):
        cleaned_data = self.cleaned_data['project_budget']
        cleaned_data = cleaned_data.replace(' ', '')
        return cleaned_data

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data


class EditProjectForm(ModelForm):
    class Meta:
        model = Project
        exclude = ['author', 'project_start_date']
        labels = {
            'project_curator': 'Loyiha kuratori',
            'project_manager': 'Loyiha menejeri(lari)',
            'project_name': 'Loyiha nomi',
            'project_blog': 'Blok',
            'project_size': 'Hajmi',
            'project_level': 'Darajasi',
            'project_speed': 'Loyiha muddati',
            'project_type': 'Turi',
            'project_team': 'Biriktirilgan hodimlar',
            'project_description': "Qisqacha ma'lumot",
            'project_deadline': 'Muddati',
            'project_budget': 'Budjeti',
            'project_status': 'Statusi',
            'project_spent_money': 'Xarajatlar',
            'project_departments': 'Departamentlar',
        }
        widgets = {
            'project_name': forms.TextInput(attrs={'class': 'form-control'}),
            'project_size': forms.Select(attrs={'class': 'form-control'}, choices=size_choices),
            'project_level': forms.Select(attrs={'class': 'form-control'}, choices=level_choices),
            'project_speed': forms.Select(attrs={'class': 'form-control'}, choices=speed_choices),
            'project_type': forms.Select(attrs={'class': 'form-control'}, choices=type_choices),
            'project_description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'project_deadline': forms.DateInput(attrs={'class': 'form-control'}),
            'project_budget': forms.TextInput(attrs={'class': 'form-control'}),
            'project_status': forms.Select(attrs={'class': 'form-control'}, choices=status_choices),
            'project_spent_money': forms.TextInput(attrs={'class': 'form-control'}),
            'project_curator': forms.Select(attrs={'class': 'form-control'}),
            'project_manager': forms.SelectMultiple(attrs={'class': 'select2 w-100'}),
            'project_blog': forms.Select(attrs={'class': 'form-control'}),
            'project_team': forms.SelectMultiple(attrs={'class': 'select2 w-100'}),
            'project_departments': forms.SelectMultiple(attrs={'class': 'select2 w-100'}),
        }

    def clean_spent_money(self):
        cleaned_data = self.cleaned_data['project_spent_money']
        cleaned_data = cleaned_data.replace(' ', '')
        return cleaned_data

    def clean_project_budget(self):
        cleaned_data = self.cleaned_data['project_budget']
        cleaned_data = cleaned_data.replace(' ', '')
        return cleaned_data

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data


class AddFileForm(forms.ModelForm):
    url = forms.CharField(max_length=250, label='', required=False,
                          widget=forms.TextInput(attrs={'class': 'form-control', 'id': 'url-input'}))

    class Meta:
        model = Documents
        fields = ['document', 'phase']
        exclude = ['url']


class AddPhaseForm(forms.ModelForm):
    class Meta:
        model = Phase
        fields = ['phase_name']
        exclude = ['project']


class AddTaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['task_name']


class CommentForm(forms.ModelForm):
    comment = forms.CharField(max_length=400, widget=SummernoteWidget())

    class Meta:
        model = Comments
        fields = ['comment']
        exclude = ['project', 'phase']


class CommentEditForm(forms.ModelForm):
    class Meta:
        model = Comments
        fields = ['comment']
        exclude = ['project', 'phase']
        widgets = {'comment': SummernoteWidget()}


class ProblemForm(forms.ModelForm):
    problem = forms.CharField(max_length=400, widget=SummernoteWidget())

    class Meta:
        model = Problems
        fields = ['problem']
        exclude = ['project', 'phase']


class ProlemEditForm(forms.ModelForm):
    comment = forms.CharField(max_length=400, widget=SummernoteWidget())

    class Meta:
        model = Problems
        fields = ['problem']
        exclude = ['project', 'phase']


class PermittedProjectsForm(forms.ModelForm):
    class Meta:
        model = PermittedProjects
        fields = ['user']
        exclude = ['project']
        labels = {
            'user': "Foydalanuvchini tanlang"
        }
        widgets = {
            'user': forms.Select(attrs={'class': 'form-control'})
        }


class ProjectFilesForm(forms.ModelForm):
    class Meta:
        model = ProjectFiles
        fields = ['file']
        exclude = ['author','created_at','project','updated_at']
        labels = {
            'file': ""
        }
        widgets = {
            'file': forms.FileInput(attrs={'class': 'form-control-file', 'id': 'file-input'}),
        }
