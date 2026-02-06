import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GOOGLE_API_KEY not found in environment.")

model = genai.GenerativeModel('gemini-1.5-flash')

async def generate_assessment_questions(role: str, experience: str):
    prompt = f"""
    Generate interview assessment questions for a {experience} applying for a {role} position.
    Provide:
    - 2 Technical MCQs (Multiple Choice Questions) with 4 options and the index of the correct answer.
    - 1 Short Answer Conceptual Question (asking to explain a concept in 2-3 lines).
    
    Return the result strictly in JSON format as follows:
    [
        {{ "id": 1, "type": "mcq", "question": "...", "options": ["...", "...", "...", "..."], "answer": 0 }},
        {{ "id": 2, "type": "mcq", "question": "...", "options": ["...", "...", "...", "..."], "answer": 1 }},
        {{ "id": 3, "type": "short", "question": "..." }}
    ]
    """
    try:
        response = model.generate_content(prompt)
        # Extract JSON from response text (handling potential markdown blocks)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        print(f"AI Error: {e}")
        # Return fallback questions
        return [
            { "id": 1, "type": "mcq", "question": f"Which is a key concept in {role}?", "options": ["Concept A", "Concept B", "Concept C", "Concept D"], "answer": 0 },
            { "id": 2, "type": "mcq", "question": f"Standard tool for {role}?", "options": ["Tool X", "Tool Y", "Tool Z", "Tool W"], "answer": 1 },
            { "id": 3, "type": "short", "question": f"Explain the core responsibility of a {role}." }
        ]

async def evaluate_readiness(role, experience, resume_text, tech_answers, comm_text, portfolio_url=None):
    prompt = f"""
    Evaluate a candidate's interview readiness for the role: {role} ({experience}).
    
    Inputs:
    - Resume Text: {resume_text[:2000]}
    - Technical Answers: {tech_answers}
    - Communication Transcript: {comm_text}
    - Portfolio URL: {portfolio_url or "Not provided"}
    
    Tasks:
    1. Score Technical Skills (0-100)
    2. Score Resume Quality (0-100)
    3. Score Communication (0-100)
    4. Score Portfolio/Proof (0-100)
    5. Calculate Weighted Total Score (Tech: 30%, Resume: 25%, Comm: 25%, Port: 20%)
    6. List 2 key strengths.
    7. List 2 key gaps.
    8. Provide a 7-day action plan.
    9. Estimate timeline to be ready.
    
    Return the result strictly in JSON format:
    {{
        "overall_score": 0,
        "breakdown": {{ "technical": 0, "resume": 0, "communication": 0, "portfolio": 0 }},
        "strengths": ["...", "..."],
        "gaps": ["...", "..."],
        "action_plan": ["...", "...", "..."],
        "timeline": "..."
    }}
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        print(f"Evaluation Error: {e}")
        return {
            "overall_score": 60,
            "breakdown": { "technical": 60, "resume": 60, "communication": 60, "portfolio": 60 },
            "strengths": ["Basic knowledge present", "Resume is readable"],
            "gaps": ["Lacks depth in technical topics", "Communication needs focus"],
            "action_plan": ["Review fundamentals", "Practice behavioral questions", "Optimize resume"],
            "timeline": "4 weeks"
        }
