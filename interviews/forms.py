from django import forms

from .models import InterviewSession


class InterviewAnswerForm(forms.Form):
    answer_text = forms.CharField(
        label="Your answer",
        widget=forms.Textarea(
            attrs={
                "class": "form-control",
                "rows": 7,
                "placeholder": "Type your answer here or use the voice input button...",
            }
        ),
    )


class DomainSelectionForm(forms.Form):
    domain = forms.ChoiceField(
        choices=InterviewSession.DOMAIN_CHOICES,
        label="Select Interview Domain",
        widget=forms.Select(attrs={"class": "form-select"}),
        help_text="Choose the domain you want to practice for this interview.",
    )
    job_description = forms.CharField(
        required=False,
        label="Optional Job Description",
        widget=forms.Textarea(
            attrs={
                "class": "form-control",
                "rows": 4,
                "placeholder": "Paste the job description here to tailor the questions to the role.",
            }
        ),
        help_text="Add role details, responsibilities, and preferred skills to make the interview more realistic.",
    )
