from django.urls import path

from .views import (
    GenerateQuestionsAPIView,
    GetFeedbackAPIView,
    LoginAPIView,
    RegisterAPIView,
    ResumeUploadAPIView,
    SubmitAnswerAPIView,
)

urlpatterns = [
    path("login", LoginAPIView.as_view(), name="api_login"),
    path("register", RegisterAPIView.as_view(), name="api_register"),
    path("upload-resume", ResumeUploadAPIView.as_view(), name="api_upload_resume"),
    path("generate-questions", GenerateQuestionsAPIView.as_view(), name="api_generate_questions"),
    path("submit-answer", SubmitAnswerAPIView.as_view(), name="api_submit_answer"),
    path("get-feedback", GetFeedbackAPIView.as_view(), name="api_get_feedback"),
]
