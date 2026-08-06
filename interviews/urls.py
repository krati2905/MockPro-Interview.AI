from django.urls import path

from .views import feedback_view, interview_question_view, select_domain_view, start_interview_view

urlpatterns = [
    path("start/<int:resume_id>/", start_interview_view, name="start_interview"),
    path("session/<int:session_id>/select-domain/", select_domain_view, name="select_domain"),
    path("session/<int:session_id>/question/<int:order>/", interview_question_view, name="interview_question"),
    path("session/<int:session_id>/feedback/", feedback_view, name="interview_feedback"),
]
