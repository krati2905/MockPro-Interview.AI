from django.contrib.auth import views as auth_views
from django.urls import path

from .views import logout_view, register_view

urlpatterns = [
    path("login/", auth_views.LoginView.as_view(template_name="accounts/login.html"), name="login"),
    path("logout/", logout_view, name="logout"),
    path("register/", register_view, name="register"),
]
