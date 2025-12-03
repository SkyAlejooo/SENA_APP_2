from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_programas, name='lista_programas'),
    path('nuevo/', views.ProgramaCreateView.as_view(), name='programa_create'),
    path('<int:programa_id>/', views.detalle_programa, name='detalle_programa'),
    path('<int:pk>/editar/', views.ProgramaUpdateView.as_view(), name='programa_update'),
    path('<int:pk>/eliminar/', views.ProgramaDeleteView.as_view(), name='programa_delete'),
]

