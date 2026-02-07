# 🎯 PrepPulse AI: The 120-Second Interview Readiness Engine

[![Bauhaus Design](https://img.shields.io/badge/Design-Bauhaus-red.svg)](#design-philosophy)
[![AI Powered](https://img.shields.io/badge/AI-Gemini_1.5_Flash-blue.svg)](#ai-evaluation-logic)
[![Stack](https://img.shields.io/badge/Stack-FastAPI_%2B_React-yellow.svg)](#tech-stack)
[![Mobile](https://img.shields.io/badge/Platform-Android_%2B_Web-black.svg)](#native-mobile-app)

> **"Most students realize they aren't ready for an interview only AFTER they fail it. PrepPulse AI solves this in 2 minutes."**

PrepPulse AI is a high-speed, predictive evaluation platform that uses intelligent signals—rather than long simulations—to estimate a student's interview readiness with surgical precision.

---

## 🚀 The 120-Second Flow

1.  **Swift Profile (30s)**: Intelligent resume parsing + target role selection.
2.  **Adaptive Technical Signal (45s)**: Role-specific conceptual MCQs and clarity-testing short answers.
3.  **Communication Signal (15s)**: Real-time voice-to-text project pitch analysis.
4.  **Instant Synthesis (30s)**: A weighted 0-100 score with predictive failure analysis and a 7-day tactical fix plan.

---

## 💎 Winning Features

### 📊 Objective Scoring & Confidence Band
We don't just give a number. We categorize readiness into **Not Ready**, **Borderline**, or **Interview Ready**, providing immediate context to the student's current standing.

### ⚠️ Failure Reason Predictor
Our AI identifies the single most likely reason for a rejection—whether it's "Lack of impact metrics," "Communication clarity," or "Technical depth"—before the student even enters the room.

### 🧩 Explain-Your-Score Module
Total transparency. Students can drill down into *why* they received their score, seeing exactly how their resume, tech answers, and communication signals contributed to the final result.

### 🗓️ 7-Day Strategic Fix Plan
No generic advice. A data-driven, role-specific daily task-list designed to move the needle on the student's weakest signals within one week.

---

## 🎨 Design Philosophy: The Bauhaus Aesthetic
We rejected the "generic tech UI" in favor of **Bauhaus Geometric Minimalism**. 
- **Stark Contrast**: High-impact Primary Red, Blue, and Yellow.
- **Geometric Clarity**: Archivo Black and Space Grotesk typography.
- **Functional Form**: A UI that feels like a precision tool, not just a dashboard.

---

## 🛠️ Tech Stack

-   **Frontend**: Vite + React (PWA & Android via Capacitor)
-   **Backend**: FastAPI (Python)
-   **AI Core**: Google Gemini 1.5 Flash
-   **Voice**: Web Speech API for real-time transcription
-   **PDF**: PyPDF2 for high-speed resume extraction

---

## 📦 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Gemini API Key

### 2. Backend Setup
```bash
cd backend
python -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
# Add GOOGLE_API_KEY to .env
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Native Android Build
The project is already initialized with Capacitor.
```bash
cd frontend
npm run build
npx cap sync
# Open 'android' folder in Android Studio
```

---

## 🧠 Innovation Principle: "Insight over Length"
PrepPulse AI is built on the belief that **interview readiness can be estimated accurately using a few strong signals.** We don't simulate a 45-minute interview; we predict its outcome efficiently.

---
Built for the **PrepPulse AI Hackathon** by **Abhinav R**.
