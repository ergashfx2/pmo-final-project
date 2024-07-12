from loyihalar.models import Comments, Problems
from loyihalar.forms import CommentEditForm, ProlemEditForm
from requests import request
from django.shortcuts import get_object_or_404

file_extensions = {
    'ai': 'adobe',
    'avi': 'film',
    'bmp': 'file-image',
    'css': 'css3',
    'csv': 'file-csv',
    'doc': 'file-word',
    'docx': 'file-word',
    'eps': 'file-image',
    'exe': 'file-code',
    'flv': 'film',
    'gif': 'file-image',
    'html': 'html5',
    'ico': 'file-image',
    'iso': 'file-archive',
    'jpg': 'file-image',
    'jpeg': 'file-image',
    'js': 'js',
    'mp3': 'file-audio',
    'mp4': 'film',
    'pdf': 'file-pdf',
    'png': 'file-image',
    'ppt': 'powerpoint',
    'pptx': 'powerpoint',
    'psd': 'adobe',
    'rar': 'file-archive',
    'svg': 'file-image',
    'tif': 'file-image',
    'tiff': 'file-image',
    'txt': 'file-alt',
    'wav': 'file-audio',
    'xls': 'file-excel',
    'xlsx': 'file-excel',
    'xml': 'code',
    'zip': 'file-archive'
}


def getComments(phase):
    comments = []
    for comment in Comments.objects.filter(phase=phase):
        comment = Comments.objects.get(pk=comment.pk)
        form = CommentEditForm(instance=get_object_or_404(Comments, pk=comment.pk))
        print(form)
        comments.append({
            'comment': comment,
            'comment_form': CommentEditForm(instance=get_object_or_404(Comments, pk=comment.pk))
        })

    print(comments)
    return comments


def getProblems(phase):
    problems = []
    for problem in Problems.objects.filter(phase=phase):
        problems.append({
            'problem': problem,
            'problem_form': ProlemEditForm(instance=problem)
        })
    return problems


currency_rate = request(url='https://cbu.uz/uz/arkhiv-kursov-valyut/json/', method='GET').json()[0]['Rate']
