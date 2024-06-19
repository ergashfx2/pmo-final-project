from django.urls import path
from .views import login_view, logoutView, profileView, UserUpdateView, UsersView, create_user,block_user,unblock_user,delete_user,profileView2

app_name = 'hodimlar'

urlpatterns = [
    path('view/', UsersView.as_view(), name='users'),
    path('login/', login_view, name='login'),
    path('logout/', logoutView, name='logout'),
    path('profile/', profileView, name='profile'),
    path('profile/<pk>', profileView2, name='profile2'),
    path('create-user/', create_user, name='create-user'),
    path('update/<pk>', UserUpdateView.as_view(), name='update-user'),
    path('view/block/<pk>', block_user, name='block'),
    path('view/unblock/<pk>', unblock_user, name='unblock'),
    path('view/delete-user/<pk>', delete_user, name='delete-user'),
]
