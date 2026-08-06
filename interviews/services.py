import json
import re

from django.conf import settings
from google import genai
from google.genai import types

from resumes.utils import extract_skills


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


def _mock_questions(resume_text, domain=None):
    skills = extract_skills(resume_text)
    primary_skill = skills[0] if skills else "your strongest technical skill"
    secondary_skill = skills[1] if len(skills) > 1 else "problem solving"
    has_job_context = "job description" in (resume_text or "").lower() or "resume:" in (resume_text or "").lower()

    # Domain-specific question templates
    domain_specific = []
    if domain == "software_engineering":
        domain_specific = [
            f"Explain how you would design a scalable system for handling {primary_skill} operations.",
            f"Walk me through your debugging process for a complex {secondary_skill} issue.",
            "How do you ensure code quality and handle technical debt?",
            "Describe your experience with CI/CD pipelines and deployment strategies.",
        ]
    elif domain == "data_science":
        domain_specific = [
            f"How would you approach feature engineering for a {primary_skill} model?",
            f"Explain your process for validating and deploying a {secondary_skill} algorithm.",
            "How do you handle imbalanced datasets and model bias?",
            "Describe your experience with data visualization and storytelling.",
        ]
    elif domain == "product_management":
        domain_specific = [
            f"How would you prioritize features for a product involving {primary_skill}?",
            f"Walk me through your process for defining requirements and user stories.",
            "How do you measure product success and user engagement?",
            "Describe your experience with A/B testing and data-driven decisions.",
        ]
    else:
        # General fallback
        domain_specific = [
            f"Walk me through a project where you used {primary_skill} to solve a real business problem.",
            f"How would you design, test, and deploy a feature related to {secondary_skill}?",
            "Describe your experience with version control and collaborative development.",
            "How do you approach debugging and troubleshooting complex issues?",
        ]

    common_questions = [
        "Tell me about a time you had to handle a tight deadline or changing requirement.",
        "Introduce yourself and explain why you are a strong fit for this role.",
        "Describe a challenging team situation and how you resolved it.",
    ]

    if has_job_context:
        domain_specific.extend([
            "How would you adapt your experience to this role's requirements?",
            "Describe a project that demonstrates your best fit for this opportunity.",
        ])

    all_questions = domain_specific + common_questions[:2]

    return [
        {
            "category": "technical" if i < 4 else ("behavioral" if i < 5 else "hr"),
            "question": question,
        }
        for i, question in enumerate(all_questions)
    ]


def generate_questions(resume_text, domain=None):
    """Generate interview questions using Gemini when available, otherwise fallback logic."""

    domain_prompt = f" Focus on {domain.replace('_', ' ')} domain." if domain else ""
    payload = _call_gemini(
        (
            "You are an interview coach. Generate exactly 6 interview questions based on the resume or role context below. "
            "Use categories technical, hr, and behavioral. Return strict JSON only in this format: "
            "{\"questions\": [{\"category\": \"technical\", \"question\": \"...\"}]}\n\n"
            f"Context:\n{(resume_text or '')[:8000]}{domain_prompt}"
        ),
        temperature=0.6,
    )

    questions = payload.get("questions", []) if isinstance(payload, dict) else []
    if questions:
        return [
            {
                "category": item.get("category", "technical").lower(),
                "question": item.get("question", "Tell me about yourself."),
            }
            for item in questions[:6]
        ]

    return _mock_questions(resume_text, domain)


def _mock_evaluation(question, answer):
    cleaned = (answer or "").strip()
    if not cleaned:
        return {
            "score": 0.0,
            "strengths": "No answer was submitted.",
            "weaknesses": "The response is blank.",
            "suggested_answer": "Use the STAR method: Situation, Task, Action, and Result.",
        }

    words = re.findall(r"\w+", cleaned)
    lowered = cleaned.lower()
    score = 3.5

    if len(words) >= 30:
        score += 2
    if len(words) >= 70:
        score += 2
    if any(keyword in lowered for keyword in ["result", "impact", "improved", "reduced", "increased"]):
        score += 1.5
    if any(keyword in lowered for keyword in ["first", "then", "finally", "because"]):
        score += 1

    score = min(10.0, round(score, 1))

    strengths = []
    weaknesses = []

    if len(words) >= 50:
        strengths.append("Good amount of detail and context.")
    else:
        weaknesses.append("Add more context about the problem, action, and result.")

    if any(keyword in lowered for keyword in ["team", "stakeholder", "customer"]):
        strengths.append("Shows awareness of collaboration and communication.")
    else:
        weaknesses.append("Mention collaboration, users, or stakeholders when relevant.")

    if any(keyword in lowered for keyword in ["result", "impact", "revenue", "performance", "time"]):
        strengths.append("Includes impact-focused language.")
    else:
        weaknesses.append("Quantify the outcome with metrics or business impact.")

    return {
        "score": score,
        "strengths": " ".join(strengths) or "Clear intent and relevant topic coverage.",
        "weaknesses": " ".join(weaknesses) or "Could still be more concise and measurable.",
        "suggested_answer": (
            f"A stronger answer to '{question}' would briefly explain the situation, the tools or approach you used, "
            "the decisions you made, and the measurable outcome."
        ),
    }


def evaluate_answer(question, answer):
    """Evaluate a candidate answer using Gemini or dependable local heuristic logic."""
    payload = _call_gemini(
        (
            "You are a technical interviewer. Evaluate the answer below and return strict JSON only with keys: "
            "score, strengths, weaknesses, suggested_answer, summary, recommendation. Score must be between 0 and 10.\n\n"
            f"Question: {question}\nAnswer: {answer}"
        ),
        temperature=0.4,
    )

    if isinstance(payload, dict):
        return {
            "score": float(payload.get("score", 0)),
            "strengths": str(payload.get("strengths", "")),
            "weaknesses": str(payload.get("weaknesses", "")),
            "suggested_answer": str(payload.get("suggested_answer", "")),
            "summary": str(payload.get("summary", "")),
            "recommendation": str(payload.get("recommendation", "")),
        }

    result = _mock_evaluation(question, answer)
    result.update({
        "summary": "The response was relevant and showed a clear attempt to structure the answer.",
        "recommendation": "Continue practicing with STAR-based examples and stronger metrics.",
    })
    return result
