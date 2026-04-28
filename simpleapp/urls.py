from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('snake/', views.snake_game, name='snake_game'),
]
