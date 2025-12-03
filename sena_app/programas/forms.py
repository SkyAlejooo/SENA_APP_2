from django import forms
from .models import Programa

class ProgramaForm(forms.ModelForm):
    class Meta:
        model = Programa
        fields = '__all__'
        widgets = {
            'fecha_creacion': forms.DateInput(attrs={'type': 'date'}),
            'descripcion': forms.Textarea(attrs={'rows': 3}),
            'competencias': forms.Textarea(attrs={'rows': 3}),
            'perfil_egreso': forms.Textarea(attrs={'rows': 3}),
            'requisitos_ingreso': forms.Textarea(attrs={'rows': 3}),
        }

