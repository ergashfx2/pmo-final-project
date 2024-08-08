from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from .models import User
from users.models import Department, Blog


from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import Blog, Department

class CreateUserForm(forms.ModelForm):
    username = forms.CharField(max_length=150, label='Username kiriting', widget=forms.TextInput(attrs={'class': 'form-control'}))
    first_name = forms.CharField(max_length=150, label='Ism kiriting', widget=forms.TextInput(attrs={'class': 'form-control'}))
    last_name = forms.CharField(max_length=150, label='Familiya kiriting', widget=forms.TextInput(attrs={'class': 'form-control'}))
    phone = forms.CharField(max_length=150, label='Telefon raqam kiriting', widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.EmailField(label='Email kiriting', widget=forms.EmailInput(attrs={'class': 'form-control'}))
    role = forms.ChoiceField(
        label="Foydalanuvchi ro'lini tanlang",
        choices={
            ('Admin', 'Admin'),
            ('Loyiha menejeri', "Loyiha menejeri"),
            ('Loyiha egasi', "Loyiha egasi"),
            ('Loyiha kuratori', 'Loyiha kuratori'),
            ('Oddiy', "Oddiy foydalanuvchi")
        },
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    position = forms.CharField(label='Lavozimini tanlang', max_length=150, widget=forms.TextInput(attrs={'class': 'form-control'}))
    blogs = [(blog.blog_name, blog.blog_name) for blog in Blog.objects.all()]
    departments = [(department.department_name, department.department_name) for department in Department.objects.all()]
    blog = forms.ChoiceField(
        label='Blokni tanlang',
        choices=blogs,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    department = forms.ChoiceField(
        label='Departamentni tanlang',
        choices=departments,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    image = forms.ImageField(label="Rasm yuklang", max_length=150, required=False, widget=forms.FileInput(attrs={'class': 'form-control-file'}))
    password = forms.CharField(
        label='Parolni kiriting',
        max_length=150,
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'name': 'password', 'type': 'password'})
    )

    class Meta:
        model = get_user_model()
        fields = [
            'username', 'first_name', 'last_name', 'phone', 'email', 'role', 'position', 'department', 'blog', 'image',
            'password'
        ]

    def save(self, commit=True):
        user = super().save(commit=False)
        user.password = make_password(self.cleaned_data['password'])
        if self.cleaned_data.get('image'):
            user.avatar = self.cleaned_data['image']
        if commit:
            user.save()
        return user


class UserLoginForm(forms.Form):
    username = forms.CharField(max_length=150,
                               widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    password = forms.CharField(max_length=150,
                               widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Parol'}))


class UpdateUserForm(forms.ModelForm):
    username = forms.CharField(max_length=150, label='Username kiriting',
                               widget=forms.TextInput(attrs={'class': 'form-control'}))
    first_name = forms.CharField(max_length=150, label='Ism kiriting',
                                 widget=forms.TextInput(attrs={'class': 'form-control'}))
    last_name = forms.CharField(max_length=150, label='Familiya kiriting',
                                widget=forms.TextInput(attrs={'class': 'form-control'}))
    phone = forms.CharField(max_length=150, label='Telefon raqam kiriting',
                            widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.EmailField(label='Email kiriting', widget=forms.EmailInput(attrs={'class': 'form-control'}))
    role = forms.ChoiceField(
        label="Foydalanuvchi ro'lini tanlang",
        choices={
            ('Admin', 'Admin'),
            ('Loyiha menejeri', "Loyiha menejeri"),
            ('Loyiha egasi', "Loyiha egasi"),
            ('Loyiha kuratori', 'Loyiha kuratori'),
            ('Oddiy', "Oddiy foydalanuvchi")
        },
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    position = forms.CharField(label='Lavozimini tanlang', max_length=150,
                               widget=forms.TextInput(attrs={'class': 'form-control'}))
    blogs = [(blog.blog_name, blog.blog_name) for blog in Blog.objects.all()]
    departments = [(department.department_name, department.department_name) for department in Department.objects.all()]
    blog = forms.ChoiceField(
        label='Blokni tanlang',
        choices=blogs,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    department = forms.ChoiceField(
        label='Departamentni tanlang',
        choices=departments,
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    password = forms.CharField(
        label='Parolni kiriting',
        max_length=150,
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'name': 'password', 'type': 'password'})
    )

    class Meta:
        model = get_user_model()
        fields = [
            'username', 'first_name', 'last_name', 'phone', 'email', 'role', 'position', 'department', 'blog', 'avatar',
            'password'
        ]

    def save(self, commit=True):
        user = super().save(commit=False)
        user.password = make_password(self.cleaned_data['password'])
        if self.cleaned_data.get('image'):
            user.avatar = self.cleaned_data['image']
        if commit:
            user.save()
        return user
