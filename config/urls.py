from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from .views import home, blockedPage

urlpatterns = [
    path('summernote/', include('django_summernote.urls')),
    path('admin/', admin.site.urls),
    path('users/', include('hodimlar.urls')),
    path('', home, name='home'),
    path('projects/', include('loyihalar.urls')),
    path('accounts/', blockedPage, name='blocked-page'),
    path('expenses/', include('expenses.urls')),
    path('qualification/', include('qualification.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
