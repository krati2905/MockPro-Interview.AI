# AI Interview Platform Implementation Plan

## 1. Existing project analysis

### Core Django apps
- accounts: authentication, dashboard, home, registration, logout
- resumes: PDF resume upload, text extraction, ATS score, skill parsing
- interviews: interview sessions, questions, answers, evaluation flow
- api: REST endpoints for auth, resume upload, question generation, answer submission, feedback

### Key data model relationships
- User -> Resume (one-to-many)
- User -> InterviewSession (one-to-many)
- InterviewSession -> InterviewQuestion (one-to-many)
- InterviewQuestion -> InterviewAnswer (one-to-one)

### Current interview flow
1. User uploads a resume.
2. User starts an interview session.
3. User selects a domain.
4. Questions are generated using Gemini or fallback logic.
5. User answers questions.
6. Answers are evaluated with Gemini or local heuristics.
7. Feedback is shown after completion.

### Existing frontend stack
- Django templates
- Bootstrap 5
- Custom CSS in static/css/styles.css
- Shared JS in static/js/app.js

### Current AI integration points
- Gemini API used for question generation and answer evaluation
- Resume parsing uses PDF text extraction with PyMuPDF
- Fallback heuristics keep the experience functional without an API key

## 2. Implementation plan

### Phase 1: Analysis and architecture alignment
- Confirm the current app structure, model relationships, and shared templates.
- Keep the existing architecture intact while adding layered UI and speech improvements.

### Phase 2: Speech-to-text improvements
- Replace the brittle one-shot voice button with a more resilient browser-based experience.
- Handle permission failures, unsupported browsers, temporary microphone interruptions, duplicate transcript suppression, and transcript history.
- Keep the existing answer form behavior intact.

### Phase 3: Theme engine
- Introduce a CSS variable-based theme system that updates the UI immediately without a page refresh.
- Provide a theme selector in the top navigation and persist selections via localStorage.
- Keep the current layout and component structure while making colors and surfaces theme-driven.

### Phase 4: Future platform upgrades
- Add live video interview capture and proctoring workflows.
- Introduce richer resume/job-description-driven question generation.
- Expand the evaluation engine and follow-up question logic.

## 3. Files modified in this implementation pass
- templates/base.html
- templates/interviews/interview_question.html
- static/js/app.js
- static/css/styles.css

## 4. Database changes
- No database migrations required for this phase.
- The implementation uses localStorage and existing Django models.

## 5. Dependencies
- No new package installation is required for this phase.

## 6. Risks
- Browser speech support still varies slightly by vendor.
- Some browsers restrict microphone access unless the page is served over HTTPS or localhost.
- Speech recognition can be interrupted by network or permission issues; the UI now handles this more gracefully.

## 7. Testing strategy
- Verify Django project health with manage.py check.
- Validate that the template renders correctly.
- Manually test the theme selector and voice capture experience in supported browsers.
- Confirm that existing interview navigation remains intact.

## 8. Current status
- Completed: project analysis and architecture review
- Completed: improved speech-to-text experience
- Completed: CSS-variable-based theme engine
- Pending: full live video interview, proctoring, adaptive resume/JD question generation, and deeper evaluation enhancements
