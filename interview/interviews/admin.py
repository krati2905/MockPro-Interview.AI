from django.contrib import admin

from .models import InterviewAnswer, InterviewQuestion, InterviewSession


class InterviewQuestionInline(admin.TabularInline):
    model = InterviewQuestion
    extra = 0


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "total_score", "started_at")
    list_filter = ("status", "started_at")
    search_fields = ("user__username", "title")
    inlines = [InterviewQuestionInline]


@admin.register(InterviewAnswer)
class InterviewAnswerAdmin(admin.ModelAdmin):
    list_display = ("question", "score", "created_at")
    search_fields = ("question__question_text",)
