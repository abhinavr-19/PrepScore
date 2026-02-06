from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from typing import List, Optional
import PyPDF2
import io
import json
from pydantic import BaseModel
from services.ai_service import generate_assessment_questions, evaluate_readiness

app = FastAPI(title="PrepPulse AI API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PrepPulse AI API is running"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return {"text": text[:5000]}
    except Exception as e:
        return {"error": str(e), "text": ""}

@app.post("/generate-questions")
async def generate_questions_endpoint(role: str = Form(...), experience: str = Form(...)):
    questions = await generate_assessment_questions(role, experience)
    return questions

@app.post("/calculate-score")
async def calculate_score_endpoint(
    role: str = Form(...),
    experience: str = Form(...),
    tech_answers: str = Form(...),
    comm_text: str = Form(""),
    resume_text: str = Form(...),
    portfolio_url: Optional[str] = Form(None)
):
    result = await evaluate_readiness(
        role, experience, resume_text, tech_answers, comm_text, portfolio_url
    )
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
