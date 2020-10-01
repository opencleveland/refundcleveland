from django.shortcuts import render
from django.shortcuts import HttpResponse


def home(request):
    return render(request, 'home.html', {
        'home': True,
    })


def budget(request):
    return render(request, 'budget.html', {
        'budget': True,
    })


def join(request):
    return render(request, 'join.html', {
        'join': True,
    })


def about(request):
    return render(request, 'about.html', {
        'about': True,
    })
