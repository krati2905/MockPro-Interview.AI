from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Avg
from django.shortcuts import redirect, render

from interviews.models import InterviewSession
from resumes.models import Resume

from .forms import SignUpForm


def home_view(request):
    return render(request, "home.html")


def register_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Your account was created successfully.")
            return redirect("dashboard")
    else:
        form = SignUpForm()

    return render(request, "accounts/register.html", {"form": form})


def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        messages.success(request, "You have been logged out successfully.")
    return redirect("home")


@login_required
def dashboard_view(request):
    resumes = Resume.objects.filter(user=request.user).order_by("-uploaded_at")
    sessions = (
        InterviewSession.objects.filter(user=request.user)
        .select_related("resume")
        .order_by("-started_at")
    )

    completed_sessions = sessions.filter(status="completed")
    average_score = completed_sessions.aggregate(avg=Avg("total_score")).get("avg") or 0
    completion_rate = int((completed_sessions.count() / sessions.count()) * 100) if sessions else 0

    context = {
        "resumes": resumes,
        "sessions": sessions,
        "stats": {
            "resume_count": resumes.count(),
            "session_count": sessions.count(),
            "average_score": round(float(average_score), 1) if average_score else 0,
            "completion_rate": completion_rate,
        },
    }
    return render(request, "dashboard.html", context)
