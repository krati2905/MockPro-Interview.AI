from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone

from resumes.models import Resume


class InterviewSession(models.Model):
    STATUS_CHOICES = (
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    )

    DOMAIN_CHOICES = (
        ("software_engineering", "Software Engineering"),
        ("data_science", "Data Science"),
        ("product_management", "Product Management"),
        ("design", "Design"),
        ("marketing", "Marketing"),
        ("sales", "Sales"),
        ("finance", "Finance"),
        ("operations", "Operations"),
        ("hr", "Human Resources"),
        ("other", "Other"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="interview_sessions",
    )
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="interview_sessions")
    title = models.CharField(max_length=120, default="AI Mock Interview")
    domain = models.CharField(max_length=50, choices=DOMAIN_CHOICES, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(default=15)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")
    total_score = models.DecimalField(max_digits=4, decimal_places=1, default=0)
    job_description = models.TextField(blank=True, default="")
    interview_context = models.TextField(blank=True, default="")
    transcript_text = models.TextField(blank=True, default="")
    video_url = models.CharField(max_length=500, blank=True, default="")
    audio_url = models.CharField(max_length=500, blank=True, default="")
    started_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.user.username} - Session #{self.pk}"

    @property
    def total_questions(self):
        return self.questions.count()

    @property
    def answered_count(self):
        return self.questions.filter(answer__isnull=False).count()

    @property
    def next_question_order(self):
        for question in self.questions.order_by("order"):
            if not hasattr(question, "answer"):
                return question.order
        return self.total_questions or 1

    def recalculate_score(self):
        answers = [
            float(question.answer.score)
            for question in self.questions.select_related("answer")
            if hasattr(question, "answer")
        ]
        average = Decimal(f"{(sum(answers) / len(answers)):.1f}") if answers else Decimal("0.0")
        self.total_score = average

        if self.total_questions and self.answered_count == self.total_questions:
            self.status = "completed"
            self.completed_at = self.completed_at or timezone.now()

        self.save(update_fields=["total_score", "status", "completed_at"])


class InterviewQuestion(models.Model):
    CATEGORY_CHOICES = (
        ("technical", "Technical"),
        ("hr", "HR"),
        ("behavioral", "Behavioral"),
    )

    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name="questions")
    order = models.PositiveIntegerField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    question_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        unique_together = ("session", "order")

    def __str__(self):
        return f"Question {self.order} for session {self.session_id}"


class InterviewAnswer(models.Model):
    question = models.OneToOneField(InterviewQuestion, on_delete=models.CASCADE, related_name="answer")
    answer_text = models.TextField()
    score = models.DecimalField(max_digits=4, decimal_places=1, default=0)
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    suggested_answer = models.TextField(blank=True)
    transcript_text = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer for question {self.question_id}"
