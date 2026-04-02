from django.conf import settings
from django.db import models


class Resume(models.Model):
    """Stores uploaded resumes and their parsed text for AI analysis."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes",
    )
    file = models.FileField(upload_to="resumes/")
    extracted_text = models.TextField(blank=True)
    parsed_skills = models.TextField(blank=True, help_text="Comma-separated detected skills")
    ats_score = models.IntegerField(blank=True, null=True, help_text="ATS compatibility score (0-100)")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"Resume #{self.pk} - {self.user.username}"
