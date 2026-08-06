from django.urls import path

from .views import upload_resume_view

urlpatterns = [
    path("upload/", upload_resume_view, name="upload_resume"),
]
