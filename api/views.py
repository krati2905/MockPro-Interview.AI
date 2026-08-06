from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from interviews.models import InterviewAnswer, InterviewQuestion, InterviewSession
from interviews.services import evaluate_answer, generate_questions
from resumes.models import Resume
from resumes.utils import extract_skills, extract_text_from_pdf

from .serializers import (
    GenerateQuestionsSerializer,
    InterviewSessionFeedbackSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResumeUploadSerializer,
    SubmitAnswerSerializer,
)


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "User registered successfully.",
                "user": {"id": user.id, "username": user.username, "email": user.email},
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)
        return Response({"message": "Login successful.", "username": user.username})


class ResumeUploadAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume = serializer.save(user=request.user)
        resume.extracted_text = extract_text_from_pdf(resume.file)
        resume.parsed_skills = ", ".join(extract_skills(resume.extracted_text))
        resume.save(update_fields=["extracted_text", "parsed_skills"])

        return Response(ResumeUploadSerializer(resume).data, status=status.HTTP_201_CREATED)


class GenerateQuestionsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateQuestionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume = None
        session = None
        resume_text = serializer.validated_data.get("resume_text", "")

        if serializer.validated_data.get("resume_id"):
            resume = get_object_or_404(Resume, pk=serializer.validated_data["resume_id"], user=request.user)
            resume_text = resume.extracted_text
            session = InterviewSession.objects.create(
                user=request.user,
                resume=resume,
                title=f"API Interview for Resume #{resume.pk}",
            )

        questions = generate_questions(resume_text)

        if session:
            for index, item in enumerate(questions, start=1):
                InterviewQuestion.objects.create(
                    session=session,
                    order=index,
                    category=item["category"],
                    question_text=item["question"],
                )

        return Response({"session_id": session.pk if session else None, "questions": questions})


class SubmitAnswerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubmitAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = get_object_or_404(
            InterviewQuestion,
            pk=serializer.validated_data["question_id"],
            session__user=request.user,
        )
        evaluation = evaluate_answer(question.question_text, serializer.validated_data["answer_text"])

        answer, _ = InterviewAnswer.objects.update_or_create(
            question=question,
            defaults={
                "answer_text": serializer.validated_data["answer_text"],
                "score": evaluation["score"],
                "strengths": evaluation["strengths"],
                "weaknesses": evaluation["weaknesses"],
                "suggested_answer": evaluation["suggested_answer"],
            },
        )
        question.session.recalculate_score()
        return Response({"message": "Answer submitted.", "feedback": evaluation, "score": answer.score})


class GetFeedbackAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        session_id = request.query_params.get("session_id")
        if not session_id:
            return Response({"error": "session_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        session = get_object_or_404(InterviewSession, pk=session_id, user=request.user)
        session.recalculate_score()
        serializer = InterviewSessionFeedbackSerializer(session)
        return Response(serializer.data)
