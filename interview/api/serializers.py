from django.contrib.auth.models import User
from rest_framework import serializers

from interviews.models import InterviewAnswer, InterviewQuestion, InterviewSession
from resumes.models import Resume


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirm_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class ResumeUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ["id", "file", "extracted_text", "parsed_skills", "uploaded_at"]
        read_only_fields = ["id", "extracted_text", "parsed_skills", "uploaded_at"]


class GenerateQuestionsSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField(required=False)
    resume_text = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if not attrs.get("resume_id") and not attrs.get("resume_text"):
            raise serializers.ValidationError("Provide either resume_id or resume_text.")
        return attrs


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer_text = serializers.CharField()


class InterviewAnswerSerializer(serializers.ModelSerializer):
    question = serializers.CharField(source="question.question_text", read_only=True)
    category = serializers.CharField(source="question.category", read_only=True)

    class Meta:
        model = InterviewAnswer
        fields = [
            "question",
            "category",
            "answer_text",
            "score",
            "strengths",
            "weaknesses",
            "suggested_answer",
        ]


class InterviewSessionFeedbackSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()

    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "title",
            "status",
            "total_score",
            "started_at",
            "completed_at",
            "answers",
        ]

    def get_answers(self, obj):
        payload = []
        for question in obj.questions.order_by("order").select_related("answer"):
            answer = getattr(question, "answer", None)
            payload.append(
                {
                    "order": question.order,
                    "category": question.category,
                    "question": question.question_text,
                    "answer": answer.answer_text if answer else "",
                    "score": float(answer.score) if answer else 0,
                    "strengths": answer.strengths if answer else "",
                    "weaknesses": answer.weaknesses if answer else "",
                    "suggested_answer": answer.suggested_answer if answer else "",
                }
            )
        return payload
