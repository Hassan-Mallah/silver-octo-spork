from django.shortcuts import render


def index(request):
    return render(request, 'simpleapp/index.html')


def snake_game(request):
    return render(request, 'simpleapp/game.html')


def game_2048(request):
    return render(request, 'simpleapp/game_2048.html')
