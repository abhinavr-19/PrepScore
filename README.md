# PrepPulse AI - Hackathon Implementation

PrepPulse AI is a high-speed, AI-powered interview readiness evaluator designed to give students objective feedback in under 2 minutes.

## Features
- **Profile Setup**: Swift role and experience selection with resume parsing.
- **Adaptive MCQs**: Real-time technical signals based on the target role.
- **Communication Analysis**: Real-time speech-to-text analysis using the Web Speech API.
- **AI Scoring**: Weighted evaluation of Technical, Resume, Communication, and Portfolio signals.
- **Personalized Plan**: 7-day action plan for improvement.

## Tech Stack
- **Frontend**: Vite + React + Vanilla CSS (Premium Glassmorphism Design)
- **Backend**: FastAPI (Python)
- **AI**: Gemini 1.5 Flash (Google Generative AI)

## Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```
- Create a `.env` file in the `backend` folder and add your `GOOGLE_API_KEY`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Run the App
- Start the backend: `python main.py`
- Open the frontend: `http://localhost:3000`

## Demo Flow (90 Seconds)
1. **Welcome** (5s): Hook the judge with the "2-minute readiness" promise.
2. **Setup** (15s): Upload a resume, select "SDE".
3. **Tech Assessment** (20s): Answer 2 MCQs and type a 2-line explanation.
4. **Communication** (20s): Record a project explanation (Web Speech API in action).
5. **Results** (30s): Show the 0-100 score, breakdown, and the 7-day action plan.

---
Built with ❤️ for the Individual Hackathon.
