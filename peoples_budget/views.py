from django.shortcuts import render
from django.shortcuts import HttpResponse
import json
from django.conf import settings
import os


def home(request):
    return render(request, 'home.html', {
        'home': True,
    })


def budget(request):
    with open(os.path.join(settings.BASE_DIR, 'static/data/2020-mayors-estimate.json')) as file:
        json_file = json.load(file)

    return render(request, 'budget.html', {
        'budget': True,
        'data': json_file,
    })


def join(request):
    return render(request, 'join.html', {
        'join': True,
    })


def about(request):
    return render(request, 'about.html', {
        'about': True,
    })

def penny(request):
    return render(request, 'penny-budget.html', {
        'penny': True,
    })
