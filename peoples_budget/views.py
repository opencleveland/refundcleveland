from django.shortcuts import render
import json
from django.conf import settings
import os
from .forms import ChangeBudgetForm, SubmitBudgetForm
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
    form = ChangeBudgetForm(request.POST)

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
        change_form = ChangeBudgetForm(request.POST)

        if change_form.is_valid():
            json_data = change_form.cleaned_data['json_data']
            submit_form = SubmitBudgetForm(initial={'json_data': json_data})

            return render(request, 'submit-budget.html', {
                'form': submit_form
            })
    else:
        return redirect("/change-the-budget")


def store_data(request):
    """Save user PII and budget info to database"""
    # Process form data if POST request
    if request.method == 'POST':
        form = SubmitBudgetForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data['email']
            address = form.cleaned_data['address']
            budget = form.cleaned_data['json_data']

            # TODO: Upload data to database

            # Confirm submitted data in template
            return render(request, 'store-data.html', {
                'email': email,
                'address': address,
                'budget': json.loads(budget)
            })
    else:
        return redirect("/change-the-budget")
