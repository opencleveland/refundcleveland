from django import forms


class ChangeBudgetForm(forms.Form):
    """Hidden form to store user budget data"""
    json_data = forms.CharField(widget=forms.HiddenInput(), required=True)

class SubmitBudgetForm(forms.Form):
    """Combine user budget data and PII"""
    email = forms.EmailField(required=True)
    ward = forms.CharField(required=True)
    json_data = forms.CharField(widget=forms.HiddenInput(), required=True)
