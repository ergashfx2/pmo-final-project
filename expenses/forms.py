from django import forms

from expenses.models import Expense
from django.utils.safestring import mark_safe



class AddExpenseForm(forms.ModelForm):
    class Meta:
        model = Expense
        fields = '__all__'
        exclude = ['project','phase']
        widgets = {
            'quantity':forms.TextInput(attrs={'class':'form-control'}),
            'date':forms.DateInput(attrs={'class':'form-control'}),
            'description':forms.TextInput(attrs={'class':'form-control'}),
            'phase':forms.Select(attrs={'class':'form-control'}),
            'task':forms.Select(attrs={'class':'form-control'}),
            'currency':forms.RadioSelect(choices=Expense.currency),
            'documents':forms.FileInput(attrs={'class':'form-control'})
        }
        labels = {
            'quantity':"Summasi",
            'currency': "Valyuta",
            'date':"Sanasi",
            'description':"Qisqacha ma'lumot",
            'phase':"Qaysi fazaga tegishli",
            'task':"Qaysi vazifaga tegishli",
            'documents':"Tegishli fayl (Ixtiyoriy)",
        }