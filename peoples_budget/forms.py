from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_ward(value):
    if value < 1 or value > 17:
        raise ValidationError(
            _('%(value)s is not a valid ward (1-17)'),
            params={'value': value},
        )

class ChangeBudgetForm(forms.Form):
    """Hidden form to store user budget data"""
    json_data = forms.CharField(widget=forms.HiddenInput(), required=True)

class SubmitBudgetForm(forms.Form):
    """Combine user budget data and PII"""
    email = forms.EmailField(required=True)
    ward = forms.IntegerField(required=True, validators=[validate_ward])
    json_data = forms.CharField(widget=forms.HiddenInput(), required=True)
