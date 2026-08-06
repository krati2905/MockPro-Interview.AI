from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from resumes.models import Resume

from .forms import DomainSelectionForm, InterviewAnswerForm
from .models import InterviewAnswer, InterviewQuestion, InterviewSession
from .services import evaluate_answer, generate_questions


@login_required
def start_interview_view(request, resume_id):
    resume = get_object_or_404(Resume, pk=resume_id, user=request.user)
    session = InterviewSession.objects.create(
        user=request.user,
        resume=resume,
        title=f"AI Interview for Resume #{resume.pk}",
    )

    messages.success(request, "Your AI interview session has been created. Please select a domain to continue.")
    return redirect("select_domain", session_id=session.pk)


@login_required
def select_domain_view(request, session_id):
    session = get_object_or_404(InterviewSession, pk=session_id, user=request.user)
    
    # If domain is already selected, redirect to first question
    if session.domain:
        return redirect("interview_question", session_id=session.pk, order=1)
    
    if request.method == "POST":
        form = DomainSelectionForm(request.POST)
        if form.is_valid():
            session.domain = form.cleaned_data["domain"]
            session.job_description = (request.POST.get("job_description") or "").strip()
            session.interview_context = (
                f"Domain: {session.domain}\n"
                f"Job Description: {session.job_description or 'Not provided'}"
            ).strip()
            session.save(update_fields=["domain", "job_description", "interview_context"])

            prompt_context = session.resume.extracted_text
            if session.job_description:
                prompt_context = f"Resume:\n{session.resume.extracted_text}\n\nJob Description:\n{session.job_description}"

            for index, item in enumerate(generate_questions(prompt_context, session.domain), start=1):
                InterviewQuestion.objects.create(
                    session=session,
                    order=index,
                    category=item["category"],
                    question_text=item["question"],
                )

            messages.success(request, "Domain selected! Your AI interview is ready. Good luck!")
            return redirect("interview_question", session_id=session.pk, order=1)
    else:
        form = DomainSelectionForm()
    
    context = {
        "session": session,
        "form": form,
    }
    return render(request, "interviews/select_domain.html", context)


@login_required
def interview_question_view(request, session_id, order):
    session = get_object_or_404(InterviewSession, pk=session_id, user=request.user)
    question = get_object_or_404(InterviewQuestion, session=session, order=order)

    try:
        existing_answer = question.answer
    except InterviewAnswer.DoesNotExist:
        existing_answer = None

    if request.method == "POST":
        form = InterviewAnswerForm(request.POST)
        if form.is_valid():
            answer_text = form.cleaned_data["answer_text"]
            evaluation = evaluate_answer(question.question_text, answer_text)

            if existing_answer:
                existing_answer.answer_text = answer_text
                existing_answer.score = evaluation["score"]
                existing_answer.strengths = evaluation["strengths"]
                existing_answer.weaknesses = evaluation["weaknesses"]
                existing_answer.suggested_answer = evaluation["suggested_answer"]
                existing_answer.transcript_text = answer_text
                existing_answer.save()
            else:
                InterviewAnswer.objects.create(
                    question=question,
                    answer_text=answer_text,
                    score=evaluation["score"],
                    strengths=evaluation["strengths"],
                    weaknesses=evaluation["weaknesses"],
                    suggested_answer=evaluation["suggested_answer"],
                    transcript_text=answer_text,
                )

            session.recalculate_score()
            next_question = session.questions.filter(order__gt=order).first()
            if next_question:
                return redirect("interview_question", session_id=session.pk, order=next_question.order)
            return redirect("interview_feedback", session_id=session.pk)
    else:
        form = InterviewAnswerForm(initial={"answer_text": existing_answer.answer_text if existing_answer else ""})

    context = {
        "session": session,
        "question": question,
        "form": form,
        "question_number": order,
        "total_questions": session.total_questions,
        "progress_percent": int(((order - 1) / max(session.total_questions, 1)) * 100),
    }
    return render(request, "interviews/interview_question.html", context)


@login_required
def feedback_view(request, session_id):
    session = get_object_or_404(InterviewSession, pk=session_id, user=request.user)
    session.recalculate_score()
    questions = session.questions.select_related("answer")
    return render(
        request,
        "interviews/feedback.html",
        {"session": session, "questions": questions},
    )
