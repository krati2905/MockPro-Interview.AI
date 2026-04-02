from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from .forms import ResumeUploadForm
from .models import Resume
from .utils import calculate_ats_score, extract_skills, extract_text_from_pdf


@login_required
def upload_resume_view(request):
    if request.method == "POST":
        form = ResumeUploadForm(request.POST, request.FILES)
        if form.is_valid():
            resume = form.save(commit=False)
            resume.user = request.user
            resume.extracted_text = extract_text_from_pdf(request.FILES["file"])
            resume.parsed_skills = ", ".join(extract_skills(resume.extracted_text))
            resume.ats_score = calculate_ats_score(resume.extracted_text)
            resume.save()
            messages.success(request, "Resume uploaded and parsed successfully.")
            return redirect("dashboard")
    else:
        form = ResumeUploadForm()

    recent_resumes = Resume.objects.filter(user=request.user)[:5]
    return render(
        request,
        "resumes/upload_resume.html",
        {"form": form, "recent_resumes": recent_resumes},
    )
