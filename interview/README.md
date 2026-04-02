# AI Interview Simulator

A production-ready Django + DRF web app for resume-based mock interviews, AI-generated questions, and instant interview feedback.

## Features

- User registration, login, logout, and dashboard
- PDF resume upload with text extraction using **PyMuPDF**
- AI-powered or mock interview question generation
- Technical, HR, and behavioral interview categories
- Timed interview flow with one question at a time
- AI feedback with score, strengths, weaknesses, and suggested answers
- Dashboard progress tracking for previous interview sessions
- Optional voice input and dark mode UI
- Admin panel analytics for resumes and interviews

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Frontend:** HTML, Bootstrap 5, CSS, JavaScript
- **Database:** SQLite by default
- **AI:** Google AI Studio / Gemini API with safe local fallback when no API key is set

## Project Structure

```text
ai_interview/
accounts/
interviews/
resumes/
api/
templates/
static/
media/
```

## Setup Guide

### 1) Create and activate a virtual environment

**Windows PowerShell**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2) Install dependencies

```powershell
pip install -r requirements.txt
```

### 3) Add environment variables

Copy `.env.example` to `.env` and set values as needed:

```env
DJANGO_SECRET_KEY=change-me
DEBUG=True
AI_PROVIDER=gemini
GEMINI_API_KEY=
GOOGLE_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

You can also edit `api_keys/config.json` directly to swap keys later without touching the code.

> If `GEMINI_API_KEY` is blank, the app uses reliable mock AI logic so it still works end-to-end.

### 4) Run migrations

```powershell
python manage.py makemigrations
python manage.py migrate
```

### 5) Create an admin user (optional)

```powershell
python manage.py createsuperuser
```

### 6) Start the server

```powershell
python manage.py runserver
```

Open `http://127.0.0.1:8000/`

## API Endpoints

- `POST /api/register`
- `POST /api/login`
- `POST /api/upload-resume`
- `POST /api/generate-questions`
- `POST /api/submit-answer`
- `GET /api/get-feedback?session_id=<id>`

## Verified Commands

The project was validated with:

```powershell
.\.venv\Scripts\python manage.py makemigrations
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py check
.\.venv\Scripts\python manage.py runserver 127.0.0.1:8000
```
