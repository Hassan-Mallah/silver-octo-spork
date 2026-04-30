from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('snake/', views.snake_game, name='snake_game'),
    path('2048/', views.game_2048, name='game_2048'),
]
