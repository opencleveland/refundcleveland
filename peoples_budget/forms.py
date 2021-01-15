from django import forms


class SubmitBudgetForm(forms.Form):
    """Hidden form to store user budget data"""
    json_data = forms.CharField(widget=forms.HiddenInput(), required=True)
