import datetime
import json
import os.path
import uuid

from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.utils import timezone
from django.views.generic import CreateView, DetailView, DeleteView, UpdateView
from zipfile import ZipFile

from actions.models import Action
from config import settings
from .forms import CreateProjectForm, EditProjectForm, AddFileForm, AddPhaseForm, AddTaskForm, PermittedProjectsForm, \
    CommentForm
from .formsets import TaskFormSet
from .models import Project, Phase, Task, Documents, Comments, Problems, PermittedProjects
from django.http import HttpResponse, JsonResponse, Http404
from django.core import serializers
from utils import file_extensions
import shutil
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


@login_required
def all_projects(request):
    projects = Project.objects.all().order_by('-project_start_date')
    phases = Phase.objects.all()
    tasks = Task.objects.all()
    all_projects_serialized = serializers.serialize('json',projects)
    p = Paginator(projects, 10)
    page_number = request.GET.get('page')
    try:
        projects_page = p.get_page(page_number)
    except PageNotAnInteger:
        projects_page = p.page(1)
    except EmptyPage:
        projects_page = p.page(p.num_pages)

    projects_serialized = serializers.serialize('json', projects_page.object_list)
    arr = json.loads(projects_serialized)

    for a in arr:
        project = Project.objects.get(pk=dict(a)['pk'])
        fields = dict(a)['fields']
        fields['project_departments'] = [department.department_name for department in project.project_departments.all()]
        fields['project_team'] = [man.get_full_name() for man in project.project_team.all()]
        fields['project_curator'] = project.project_curator.get_full_name()
        fields['project_blog'] = project.project_blog.blog_name

    projects_serialized_modified = json.dumps(arr)

    return render(request, 'all_projects.html', context={
        'projects': projects_page,
        'phases': phases,
        'tasks': tasks,
        'projects_serialized': projects_serialized_modified,
        'all_serialized':all_projects_serialized
    })


@login_required
def myProjects(request):
    projects = Project.objects.filter(
        Q(project_manager__id=request.user.pk) |
        Q(project_curator__id=request.user.pk) |
        Q(project_team__username=request.user.username)
    ).order_by('-project_start_date').distinct()
    projects_serialized = serializers.serialize('json',projects)
    p = Paginator(projects, 1)
    page_number = request.GET.get('page')
    try:
        projects_page = p.get_page(page_number)
    except PageNotAnInteger:
        projects_page = p.page(1)
    except EmptyPage:
        projects_page = p.page(p.num_pages)
    return render(request, 'my-projects.html', context={'projects': projects_page,'my_projects_serialized':projects_serialized})


@login_required
def get_project(request, pk):
    project = Project.objects.get(pk=pk)
    datas = []
    phases = Phase.objects.filter(project_id=project.id)
    for phase in phases:
        datas.append({
            'phase': phase.phase_name,
            'phase_id': phase.pk,
            'phase_done_percentage': int(phase.phase_done_percentage),
            'tasks': Task.objects.filter(phase=phase.id),
            'documents': Documents.objects.filter(phase=phase.id),
            'comments': Comments.objects.filter(phase=phase),
            'problems': Problems.objects.filter(phase=phase),
            'actions': Action.objects.filter(project=project.pk).order_by('-date')[:10]
        })
    return render(request, 'project_detail.html',
                  context={'project': project, 'datas': datas,})


@login_required
def DetailMyProjects(request, pk):
    form = AddFileForm()
    form2 = AddPhaseForm()
    form3 = TaskFormSet()
    project = Project.objects.get(pk=pk)
    datas = []
    comments = Comments.objects.filter(project_id=project.id)
    problems = Problems.objects.filter(project_id=project.id)
    phases = Phase.objects.filter(project_id=project.id)
    comment_forms = {str(phase.id): CommentForm(initial={'phase': phase.id}) for phase in phases}
    print(comment_forms)
    for phase in phases:
        datas.append({
            'phase': phase.phase_name,
            'phase_id': phase.pk,
            'phase_done_percentage': int(phase.phase_done_percentage),
            'tasks': Task.objects.filter(phase=phase.id),
            'documents': Documents.objects.filter(phase=phase.id),
            'comments': Comments.objects.filter(phase=phase),
            'problems': Problems.objects.filter(phase=phase),
            'comment_form': comment_forms[str(phase.pk)],
            'actions': Action.objects.filter(project=project.pk).order_by('-date')[:10]
        })
    if request.method == 'POST':
        form = AddFileForm(data=request.POST, files=request.FILES)
        if form.is_valid() and form.cleaned_data.get('document'):
            project = Project.objects.get(pk=pk)
            document = form.save(commit=False)
            doc_type = str(form.cleaned_data.get('document')).split('.')[-1]
            document.type = file_extensions[doc_type]
            document.project = project
            document.save()
            Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                                  action=f"<strong>{form.cleaned_data.get('document')}</strong> nomli fayl qo'shdi")
            return JsonResponse(status=200, data={'doc_type': document.type, 'doc_id': document.id,
                                                  'created_at': document.created_at})
        if form.is_valid() and form.cleaned_data.get('url'):
            document = form.save(commit=False)
            url = str(form.cleaned_data.get('url'))
            document.type = 'link'
            document.url = url
            document.project = Project.objects.get(pk=pk)
            document.save()
            return redirect('my-projects-detail', pk=pk)

        formPhase = AddPhaseForm(request.POST)
        if formPhase.is_valid():
            new_phase = formPhase.save(commit=False)
            new_phase.project = project
            new_phase.save()
            task_formset = TaskFormSet(request.POST, instance=new_phase)
            if task_formset.is_valid():
                task_formset.save()
                redirect('my-projects-detail', pk=pk)
        redirect('my-projects-detail', pk=pk)

    documents = Documents.objects.filter(project=project.id).order_by('created_at')
    return render(request, 'my-projects-detail.html',
                  context={'project': project, 'datas': datas, 'comments': comments, 'problems': problems,
                           'documents': documents, 'form': form, 'form2': form2,
                           'form3': form3, 'project_id': pk})


@login_required
def download_file(request, pk):
    document = get_object_or_404(Documents, id=pk)
    file_path = document.document.path
    print(document.document.name)
    try:
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="application/octet-stream")
            response['Content-Disposition'] = f'attachment; filename="{document.document.name}"'
            return response
    except FileNotFoundError:
        raise Http404("Dokument topilmadi")


@login_required
def CreateProject(request):
    form = CreateProjectForm()
    if request.method == 'POST':
        form = CreateProjectForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            form.save()
            form.save_m2m()
            Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                                  action=f"{form.cleaned_data.get('project_name')} nomli loyiha yaratdi")
            return redirect('my-projects')

    return render(request, 'create_project.html', context={'form': form})


class UpdateProject(UpdateView):
    model = Project
    template_name = 'update_project.html'
    form_class = EditProjectForm

    def get_success_url(self):
        return reverse('my-projects')


@login_required
def DeleteProject(request, pk):
    project = Project.objects.get(pk=pk)
    Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                          action=f"{project.project_name} nomli loyihani o'chirib yubordi")
    project.delete()
    return redirect('my-projects')


@login_required
def add_phase(request, pk):
    data = json.loads(request.body)
    project = get_object_or_404(Project, pk=pk)
    phase = Phase.objects.create(project=project, phase_name=data['phase_name'])
    action = Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                          action=f"{project.project_name} nomli loyihaga {data['phase_name']} nomli faza qo'shdi")
    return JsonResponse(status=200, data={'phase': phase.phase_name, 'phase_id': phase.pk})


@login_required
def add_tasks(request, pk):
    if request.method == 'POST':
        datas = json.loads(request.body)
        for data in datas:
            task = Task.objects.create(project_id=Phase.objects.get(pk=pk).project.pk, phase_id=pk,
                                       task_name=data[0]['task_name'], task_manager=data[1]['task_manager'],
                                       task_deadline=data[2]['task_deadline'])
            Action.objects.create(author_id=request.user.pk, project_id=task.project.pk,action=f"{task.project.project_name} loyihasiga <br>{task.task_name}</br> nomli vazifa qo'shdi")
            return JsonResponse(status=200, data={'success': True, 'task_id': task.pk})
    return JsonResponse(status=500, data={'message': "Method must be POST"})


@login_required
def get_task(request, pk):
    task = serializers.serialize('json', Task.objects.filter(pk=pk))
    return JsonResponse(task, safe=False)


@login_required
def update_phase(request, pk):
    if request.method == 'POST':
        data = json.loads(request.body)
        phase = Phase.objects.get(pk=pk)
        Phase.objects.filter(pk=pk).update(phase_name=data['phase_name'])
        project = Phase.objects.get(pk=pk).project
        Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                              action=f"{project.project_name} nomli loyihadagi <strong>{phase.phase_name}</strong> fazasini <strong>{data['phase_name']}</strong> ga yangiladi")
        return JsonResponse(status=200, data={'status': 'ok'})
    return redirect('my-projects')


@login_required
def delete_phase(request, pk):
    phase = Phase.objects.get(pk=pk)
    project = phase.project
    Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                          action=f"{project.project_name} nomli loyihadagi <strong>{phase.phase_name}</strong> fazasini o'chirib yubordi")
    phase.delete()
    return JsonResponse(status=200, data={'status': 'ok'})


@login_required
def update_task(request, pk):
    if request.method == 'POST':
        data = json.loads(request.body)
        task = Task.objects.get(pk=pk)
        project = task.project
        if data[3]['task_done_percentage']:
            update_task_percentage(task=task, user=request.user, phase=task.phase.pk,
                                   percentage=data[3]['task_done_percentage'], data=data)
            return JsonResponse(status=200, data={'status': 'ok', 'task_percentage': data[3]['task_done_percentage']})
        else:
            task.task_name = data[0]['task_name']
            task.task_deadline = data[2]['task_deadline']
            task.task_manager = data[1]['task_manager']
            task.save()
            Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                                  action=f"{project.project_name} loyihasidagi {task.task_name} nomli vazifasini yangiladi.O'zgarishlar {task.task_name}=>{data[0]['task_name']},<br>{task.task_manager}=>{data[1]['task_manager']}<br>{task.task_deadline}=>{data[2]['task_deadline']}")
            return JsonResponse(status=200, data={'status': 'ok', 'task_percentage': task.task_done_percentage})


def update_task_percentage(task, user, phase, percentage, data):
    task = Task.objects.get(pk=task.pk)
    task.task_done_percentage = percentage
    task.task_name = data[0]['task_name']
    task.task_deadline = data[2]['task_deadline']
    task.task_manager = data[1]['task_manager']
    task.save()
    print(task.task_done_percentage)
    tasks = Task.objects.filter(phase_id=phase)
    phase_done_percentage = 0
    project_done_percentage = 0
    for task in tasks:
        phase_done_percentage += int(task.task_done_percentage)
    final_phase_percentage = phase_done_percentage / len(tasks)
    phase_obj = Phase.objects.get(pk=phase)
    phase_obj.phase_done_percentage = int(final_phase_percentage)
    phase_obj.save()
    phases = Phase.objects.filter(project_id=phase_obj.project.id)
    for phase in phases:
        project_done_percentage += int(phase.phase_done_percentage)
    final_project_percentage = project_done_percentage / len(phases)
    project_obj = Project.objects.get(pk=phase_obj.project.id)
    if final_project_percentage == '100.0':
        project_obj.project_status = 'Tugatilgan'
    else:
        project_obj.project_status = 'Jarayonda'
    project_obj.project_done_percentage = int(final_project_percentage)
    project_obj.save()
    task = Task.objects.get(pk=task.pk)
    Action.objects.create(author_id=user.pk, project_id=task.project.pk,
                          action=f"{task.project.project_name} loyihasidagi <strong>{task.task_name}</strong> vazifasini <strong>{percentage}</strong> foizga yakunladi")


@login_required
def delete_task(request, pk):
    task = Task.objects.get(pk=pk)
    Task.objects.select_related(pk).filter(pk=pk).delete()
    Action.objects.create(author_id=request.user.pk, project_id=task.project.pk,
                          action=f"{task.project.project_name} loyihasidagi <strong>{task.task_name}</strong> vazifasini o'chirdi")
    return JsonResponse(status=200, data={'status': 'ok'})


@login_required
def delete_files(request):
    if request.method == 'POST':
        datas = json.loads(request.body)['datas']
        for data in datas:
            document = Documents.objects.get(id=data)
            Documents.objects.filter(id=data).delete()
            Action.objects.create(author_id=request.user.pk, project_id=document.project.pk,
                                  action=f"{document.project.project_name} loyihasidagi <strong>{document.document}</strong> nomli faylni o'chirdi")
        return JsonResponse(status=200, data={'status': 'ok'})
    return redirect('my-projects')


@login_required
def owned_projects(request):
    projects = Project.objects.filter(project_curator=request.user)
    return render(request, 'owned_projects.html', context={'projects': projects})


@login_required
def create_archive(request, pk):
    documents = Documents.objects.filter(phase_id=pk)
    docs = documents.values_list('document', flat=True)
    temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp')
    os.makedirs(temp_dir, exist_ok=True)

    zip_file_path = os.path.join(temp_dir, f'{pk}.zip')
    with ZipFile(zip_file_path, 'w') as zip:
        for doc_path in docs:
            doc_full_path = os.path.join(settings.MEDIA_ROOT, str(doc_path))
            if os.path.exists(doc_full_path):
                zip.write(doc_full_path, os.path.basename(doc_full_path))

    with open(zip_file_path, 'rb') as file:
        response = HttpResponse(file.read(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{pk}.zip"'
        return response


@login_required
def post_comment(request, pk):
    form = CommentForm(request.POST, files=request.FILES)
    if request.method == 'POST' and form.is_valid():
        comment = form.save(commit=False)
        comment.project = Phase.objects.get(pk=pk).project
        comment.author = request.user
        comment.phase = Phase.objects.get(pk=pk)
        form.save()
        project = Phase.objects.get(pk=pk).project
        Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                              action=f"{project.project_name} nomli loyihaga izoh yozdi.Izoh matni: <strong>{comment.comment}</strong>")
        return JsonResponse(status=200, data={'comment_id': comment.pk, 'comment': comment.comment,
                                              'comment_date': comment.created_at,
                                              'author_avatar': comment.author.avatar.url,
                                              'author_name': comment.author.get_full_name(), 'form': form.as_div()})
    return JsonResponse(status=404, data={'success': False})


@login_required
def edit_comment(request, pk):
    if request.method == 'POST':
        comment = Comments.objects.get(pk=pk)
        project = comment.project
        updated = request.POST.get('comment')
        comment.update_comment(comment=updated)
        Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                              action=f"{project.project_name} nomli loyihadagi izohni tahrirladi. <br> Izohning asl holati <strong>{comment.comment}</strong> va o'zgartirilgan holati <strong>{comment.comment}</strong> ")
        return JsonResponse(status=200, data={'comment': comment.comment})
    return JsonResponse(status=404, data={'message': 'Not found'})


@login_required
def delete_comment(request, pk):
    prkey = Comments.objects.get(pk=pk).project.pk
    project = Project.objects.get(pk=prkey)
    comment = Comments.objects.get(pk=pk)
    Comments.objects.get(pk=pk).delete()
    Action.objects.create(author_id=request.user.pk, project_id=prkey,
                          action=f"{project.project_name} nomli loyihadagi izohni o'chirdi.Izoh matni :<strong> {comment.comment}</strong>")
    return redirect('my-projects-detail', prkey)

from .forms import ProblemForm,ProlemEditForm
@login_required
def post_problem(request, pk):
    form = ProblemForm(request.POST,request.FILES)
    if request.method == 'POST' and form.is_valid():
        phase = Phase.objects.get(pk=pk)
        problem = form.save(commit=False)
        problem.project = Phase.objects.get(pk=pk).project
        problem.author = request.user
        problem.phase =phase
        form.save()
        project = Project.objects.get(pk=phase.project.pk)
        Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                              action=f"{project.project_name} nomli loyihaga muammoli izoh yozdi.Izoh matni <strong>{problem.problem}</strong>")
        return JsonResponse(status=200, data={'comment_id': problem.pk, 'comment': problem.problem,
                                              'comment_date': problem.created_at,
                                              'author_avatar': problem.author.avatar.url,
                                              'author_name': problem.author.get_full_name(), 'form': form.as_div()})


@login_required
def edit_problem(request, pk):
    if request.method == 'POST':
        problem = Problems.objects.get(pk=pk)
        project = problem.project
        updated = request.POST.get('problem')
        Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                              action=f"{project.project_name} nomli loyihadagi izohni tahrirladi. <br> Izohning asl holati <strong>{problem.problem}</strong> va o'zgartirilgan holati <strong>{updated}</strong> ")
        problem.update_problem(problem=updated)
        return JsonResponse(status=200, data={'comment': problem.problem})
    return JsonResponse(status=404, data={'message': 'Not found'})


@login_required
def delete_problem(request, pk):
    prkey = Problems.objects.get(pk=pk).project.pk
    project = Project.objects.get(pk=prkey)
    problem = Problems.objects.get(pk=pk)
    Problems.objects.get(pk=pk).delete()
    Action.objects.create(author_id=request.user.pk, project_id=prkey,
                          action=f"{project.project_name} nomli loyihadagi izohni o'chirdi.Izoh matni :<strong> {problem.problem}</strong>")
    return redirect('my-projects-detail', prkey)


@login_required
def add_team_member(request, pk):
    form = PermittedProjectsForm()
    if request.method == 'POST':
        form = PermittedProjectsForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            project.project = Project.objects.get(pk=pk)
            form.save()
            project = Project.objects.get(pk=pk)
            Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                                  action=f"{project.project_name} nomli loyihaga {form.cleaned_data.get('user').get_full_name()} ismli foydalanuvchiga ko'rish imkoniyatini berdi")
        return redirect('my-projects-detail', pk)
    return render(request, 'add_project_member.html', context={'form': form})


@login_required
def remove_team_member(request, pk):
    form = PermittedProjectsForm()
    if request.method == 'POST':
        form = PermittedProjectsForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data.get('user')
            PermittedProjects.objects.filter(project=pk, user=user).delete()
            project = Project.objects.get(pk=pk)
            Action.objects.create(author_id=request.user.pk, project_id=project.pk,
                                  action=f"{project.project_name} nomli loyihadan {form.cleaned_data.get('user').get_full_name()} ismli foydalanuvchini olib tashladi")
        return redirect('my-projects-detail', pk)
    return render(request, 'remove_project_member.html', context={'form': form})


@login_required
def filter_table(request,status):
    global projects
    global arr
    if status == 'all':
        projects = Project.objects.all()
    elif str(status).startswith('least'):
        days = status.split('t')[-1]
        start_date = timezone.now()
        end_date = start_date + timezone.timedelta(days=int(days))
        projects = Project.objects.filter(project_deadline__range=(start_date, end_date))
    else:
        projects = Project.objects.filter(project_status=status)
    arr = json.loads(serializers.serialize('json',projects))
    for a in arr:
        project = Project.objects.get(pk=dict(a)['pk'])
        fields = dict(a)['fields']
        fields['project_departments'] = [department.department_name for department in project.project_departments.all()]
        fields['project_team'] = [man.get_full_name() for man in project.project_team.all()]
        fields['project_curator'] = project.project_curator.get_full_name()
        fields['project_blog'] = project.project_blog.blog_name

    projects_serialized_modified = json.dumps(arr)
    return JsonResponse(status=200,data={'success':True,'projects':projects_serialized_modified})
