from django.shortcuts import render
import json
from django.conf import settings
import os
from .forms import SubmitBudgetForm
from django.shortcuts import redirect


def home(request):
    with open(os.path.join(settings.BASE_DIR, 'static/data/2020-mayors-estimate-fullgeneralfund.json')) as file:
        json_file = json.load(file)

    return render(request, 'home.html', {
        'home': True,
        'data': json_file,
        'body_classes': 'home'
    })


def change_budget(request):
    """Collect user budget data"""
    with open(os.path.join(settings.BASE_DIR, 'static/data/2020-mayors-estimate-fullgeneralfund.json')) as file:
        json_file = json.load(file)

    # Add hidden field to store user budget data
    form = SubmitBudgetForm(request.POST)

    return render(request, 'change-the-budget.html', {
        'change_budget': True,
        'data': json_file,
        'body_classes': 'change-the-budget',
        'form': form
    })


def submit_budget(request):
    """Collect user PII and submit with budget data to database"""
    # Process form data if POST request
    if request.method == 'POST':
        form = SubmitBudgetForm(request.POST)
        if form.is_valid():
            json_data = form.cleaned_data['json_data']
            return render(request, 'submit-budget.html', {
                'json_data': json_data
            })
    else:
        return redirect("/change-the-budget")
