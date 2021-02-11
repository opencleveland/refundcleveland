from django.shortcuts import render
import json
from django.conf import settings
import os
from .forms import ChangeBudgetForm, SubmitBudgetForm
from django.shortcuts import redirect
from peoples_budget import models
import uuid
import urllib, urllib.request
import datetime
import requests

try:
    from local_settings import *
except ImportError:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    pass

def home(request):
    with open(os.path.join(settings.BASE_DIR, 'static/data/2021-mayors-estimate-fullgeneralfund.json')) as file:
        json_file = json.load(file)

    return render(request, 'home.html', {
        'home': True,
        'data': json_file,
        'body_classes': 'home'
    })


def change_budget(request):
    """Collect user budget data"""
    with open(os.path.join(settings.BASE_DIR, 'static/data/2021-mayors-estimate-fullgeneralfund.json')) as file:
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
                'form': submit_form,
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
            ward = form.cleaned_data['ward']
            budget = form.cleaned_data['json_data']

            # Generate a new uuid
            id = uuid.uuid4()

            # save to database
            new_budget = models.BudgetSubmission()
            new_budget.the_id = id
            new_budget.submitter_email = email
            new_budget.submitter_json = json.loads(budget)
            new_budget.submitter_ward = ward
            new_budget.save()

            # send email to user
            send_email(email, id)

            # Confirm submitted data in template
            return render(request, 'store-data.html', {
                'email': email,
                'ward': ward,
                'id': id
            })
        else:
            return render(request, 'submit-budget.html', {
                'form': form
            })

    else:
        return redirect("/change-the-budget")

def view_budget(request, budget_id):
    """View a saved budget given budget_id"""

    try:
        submission = models.BudgetSubmission.objects.get(the_id=budget_id)
    except:
        return render(request, 'budget-not-found.html', {
            'id': budget_id})

    return render(request, 'view-budget.html', {
        'budget_id': budget_id,
        'json_data': submission.submitter_json,
        'body_classes': 'view-budget'
    })

def lookup_address(request):
    body = json.loads(request.body)
    address = body['address']

    query = "https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=" + urllib.parse.quote_plus(address) + "&includeOffices=true&levels=locality&key="+ GOOGLE_API_KEY

    try:
        json_response = json.load(urllib.request.urlopen(query))

        ward = [x.split(':')[-1] for x in json_response['divisions'] if 'ward' in x]
        if ward:
            ward = ward[0]
            return render(request, 'lookup_address.html', {
                'ward': ward
            })
    except:
        return render(request, 'lookup_address.html', {
            'ward': None
        })

def send_email(submitter_email, id):
	return requests.post(
		"https://api.mailgun.net/v3/mg.refundcleveland.com/messages",
		auth=("api", MAILGUN_API_KEY),
		data={"from": "Refund Cleveland <info@refundcleveland.com>",
			"to": [submitter_email],
			"subject": "Your Cleveland Budget Proposal",
			"text": f"Thank you for submitting your budget proposal for the 2021 City of Cleveland Budget!\n"
                    f"View or share your budget here: https://www.refundcleveland.com/{id}/view\n\n"
                    f"Brought to you by your friends at Open Cleveland! https://www.opencleveland.org"})
                    
                    
def privacy_policy(request):
    return render(request, 'privacy-policy.html', {
        'home': True,
        'body_classes': 'privacy-policy'
    })
