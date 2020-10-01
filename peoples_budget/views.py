from django.shortcuts import render
from django.shortcuts import HttpResponse


def home(request):
    return render(request, 'home.html')

def budget(request):
    return render(request, 'budget.html')

def join(request):
    return render(request, 'join.html')

def about(request):
    return render(request, 'about.html')
