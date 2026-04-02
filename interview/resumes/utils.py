import fitz
import json
import re

from django.conf import settings
from google import genai
from google.genai import types

COMMON_SKILLS = [
    "Python",
    "Django",
    "Flask",
    "FastAPI",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AWS",
    "Azure",
    "Machine Learning",
    "Data Analysis",
    "REST API",
    "Git",
    "CI/CD",
]


def _safe_json_loads(text):
    if not text:
        return None

    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", cleaned, flags=re.MULTILINE).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}|\[.*\]", cleaned, re.DOTALL)
        return json.loads(match.group()) if match else None


def _call_gemini(prompt, temperature=0.6):
    if settings.AI_PROVIDER != "gemini" or not settings.GEMINI_API_KEY:
        return None

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=temperature,
                response_mime_type="application/json",
            ),
        )
        return _safe_json_loads(getattr(response, "text", ""))
    except Exception:
        return None


def extract_text_from_pdf(file_obj):
    """Read text from an uploaded PDF using PyMuPDF."""
    try:
        file_obj.seek(0)
        pdf_bytes = file_obj.read()
        with fitz.open(stream=pdf_bytes, filetype="pdf") as document:
            pages = [page.get_text("text") for page in document]
        file_obj.seek(0)
        return "\n".join(pages).strip()
    except Exception:
        file_obj.seek(0)
        return ""


def extract_skills(text):
    lowered = (text or "").lower()
    return [skill for skill in COMMON_SKILLS if skill.lower() in lowered]


def calculate_ats_score(resume_text):
    """Calculate ATS score using AI analysis of the resume."""
    if not resume_text:
        return None

    payload = _call_gemini(
        (
            "You are an ATS (Applicant Tracking System) evaluator. Analyze the resume below and provide an ATS compatibility score from 0-100. "
            "Consider factors like keyword optimization, formatting, relevant experience, skills matching, and overall appeal to automated systems. "
            "Return strict JSON only in this format: {\"score\": 85, \"reason\": \"Brief explanation\"}.\n\n"
            f"Resume:\n{(resume_text or '')[:6000]}"
        ),
        temperature=0.3,
    )

    if isinstance(payload, dict) and "score" in payload:
        score = payload.get("score", 0)
        try:
            return max(0, min(100, int(score)))
        except (ValueError, TypeError):
            pass

    # Fallback: simple heuristic based on skills and length
    skills = extract_skills(resume_text)
    base_score = min(50 + len(skills) * 5, 90)
    if len(resume_text) > 1000:
        base_score += 5
    return min(base_score, 100)
