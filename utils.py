
from requests import request
from users.models import User
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



currency_rate = request(url='http://cbu.uz/uz/arkhiv-kursov-valyut/json', method='GET').json()[0]['Rate']

def isAdmin(user):
    user = User.objects.get(pk=user.pk)
    if user.role == 'Admin':
        return True
    else:
        return False

def isCurator(user):
    user = User.objects.get(pk=user.pk)
    if user.role == 'Loyiha kuratori':
        return True
    else:
        return False

def isManager(user):
    user = User.objects.get(pk=user.pk)
    if user.role == 'Loyiha menejeri':
        return True
    else:
        return False

def isProjectOwner(user):
    user = User.objects.get(pk=user.pk)
    if user.role == 'Loyiha egasi':
        return True
    else:
        return False

def isSimpleUser(user):
    user = User.objects.get(pk=user.pk)
    if user.role == 'Oddiy':
        return True
    else:
        return False