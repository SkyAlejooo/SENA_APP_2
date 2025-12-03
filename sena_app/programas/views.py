from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from .models import Programa
from .forms import ProgramaForm

def lista_programas(request):
    qs = Programa.objects.all().order_by('-id')
    paginator = Paginator(qs, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    context = {
        'programas': page_obj.object_list,
        'page_obj': page_obj,
        'total_programas': qs.count(),
    }
    return render(request, 'lista_programas.html', context)

def detalle_programa(request, programa_id):
    programa = get_object_or_404(Programa, id=programa_id)
    context = {'programa': programa}
    return render(request, 'detalle_programa.html', context)

class ProgramaCreateView(CreateView):
    model = Programa
    form_class = ProgramaForm
    template_name = 'programa_form.html'
    success_url = reverse_lazy('lista_programas')

class ProgramaUpdateView(UpdateView):
    model = Programa
    form_class = ProgramaForm
    template_name = 'programa_form.html'
    success_url = reverse_lazy('lista_programas')

class ProgramaDeleteView(DeleteView):
    model = Programa
    template_name = 'programa_confirm_delete.html'
    success_url = reverse_lazy('lista_programas')
