from django import forms

from .models import Resume


class ResumeUploadForm(forms.ModelForm):
    class Meta:
        model = Resume
        fields = ["file"]
        widgets = {
            "file": forms.ClearableFileInput(attrs={"class": "form-control"}),
        }

    def clean_file(self):
        uploaded_file = self.cleaned_data["file"]
        if not uploaded_file.name.lower().endswith(".pdf"):
            raise forms.ValidationError("Please upload a PDF resume.")
        return uploaded_file
