import React, { useState, useEffect } from 'react'
import {
    User,
    FileText,
    Mic,
    Search,
    CheckCircle,
    ArrowRight,
    Loader2,
    Github,
    Linkedin,
    Briefcase,
    Trophy,
    Target,
    AlertCircle
} from 'lucide-react'

function App() {
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({
        role: 'SDE',
        experience: 'Student',
        resumeFile: null,
        resumeText: '',
        github: '',
        linkedin: ''
    })
    const [assessment, setAssessment] = useState({
        mcqs: [],
        shortAnswer: '',
        commTranscript: '',
        isRecording: false
    })
    const [results, setResults] = useState(null)

    const API_BASE = 'http://localhost:8000'

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfile(prev => ({ ...prev, [name]: value }))
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        setProfile(prev => ({ ...prev, resumeFile: file }))

        // Auto-parse resume
        const formData = new FormData()
        formData.append('file', file)
        try {
            const resp = await fetch(`${API_BASE}/parse-resume`, { method: 'POST', body: formData })
            const data = await resp.json()
            setProfile(prev => ({ ...prev, resumeText: data.text }))
        } catch (err) {
            console.error("Resume parsing error", err)
        }
    }

    const startAssessment = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('role', profile.role)
            formData.append('experience', profile.experience)
            const resp = await fetch(`${API_BASE}/generate-questions`, { method: 'POST', body: formData })
            const data = await resp.json()
            setAssessment(prev => ({ ...prev, mcqs: data }))
            setLoading(false)
            nextStep()
        } catch (err) {
            console.error("Question generation error", err)
            setLoading(false)
        }
    }

    const submitAssessment = async () => {
        setStep(5) // Processing
        try {
            const formData = new FormData()
            formData.append('role', profile.role)
            formData.append('experience', profile.experience)
            formData.append('resume_text', profile.resumeText)
            formData.append('tech_answers', JSON.stringify({
                mcqs: assessment.mcqs,
                short: assessment.shortAnswer
            }))
            formData.append('comm_text', assessment.commTranscript)

            const resp = await fetch(`${API_BASE}/calculate-score`, { method: 'POST', body: formData })
            const data = await resp.json()
            setResults(data)
            setStep(6)
        } catch (err) {
            console.error("Scoring error", err)
            setStep(6)
        }
    }

    return (
        <div className="container">
            {step > 0 && step < 6 && (
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>
            )}

            {step === 0 && <WelcomeView onStart={nextStep} />}
            {step === 1 && <ProfileStep profile={profile} onChange={handleProfileChange} onFile={handleFileUpload} onNext={startAssessment} loading={loading} />}
            {step === 2 && <MCQStep mcqs={assessment.mcqs} onNext={nextStep} />}
            {step === 3 && <ShortAnswerStep onComplete={(val) => setAssessment(prev => ({ ...prev, shortAnswer: val }))} onNext={nextStep} />}
            {step === 4 && <CommStep onComplete={(val) => setAssessment(prev => ({ ...prev, commTranscript: val }))} onNext={submitAssessment} />}
            {step === 5 && <ProcessingView />}
            {step === 6 && <ResultsView results={results} onReset={() => setStep(0)} />}
        </div>
    )
}

function WelcomeView({ onStart }) {
    return (
        <div className="glass-card animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ background: 'var(--bauhaus-red)', width: '80px', height: '80px', border: 'var(--border-thick)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', borderRadius: '50%' }}>
                <Target size={40} color="white" />
            </div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '0.8' }}>PrepPulse<br />AI</h1>
            <p style={{ fontWeight: '600', marginBottom: '2.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>
                Objective Interview Readiness <br /> in 120 Seconds.
            </p>
            <button className="btn btn-primary" onClick={onStart} style={{ width: '100%' }}>
                Start Assessment <ArrowRight size={22} />
            </button>
            <div style={{ marginTop: '3rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                <div style={{ border: '2px solid black', padding: '0.5rem 1rem', background: 'var(--bauhaus-yellow)' }}>Technical</div>
                <div style={{ border: '2px solid black', padding: '0.5rem 1rem', background: 'var(--bauhaus-blue)', color: 'white' }}>Communication</div>
                <div style={{ border: '2px solid black', padding: '0.5rem 1rem', background: 'var(--bauhaus-red)', color: 'white' }}>Resume</div>
            </div>
        </div>
    )
}

function ProfileStep({ profile, onChange, onFile, onNext, loading }) {
    return (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Profile Setup</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Target Role</label>
                    <select name="role" className="input-field" value={profile.role} onChange={onChange}>
                        <option>SDE</option>
                        <option>Data Science</option>
                        <option>AI Engineer</option>
                        <option>Frontend</option>
                        <option>Backend</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Experience Level</label>
                    <select name="experience" className="input-field" value={profile.experience} onChange={onChange}>
                        <option>Student</option>
                        <option>Fresher</option>
                        <option>1-3 Years</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Resume (PDF)</label>
                    <input type="file" onChange={onFile} className="input-field" accept=".pdf" />
                </div>
                <button className="btn btn-primary" onClick={onNext} disabled={loading || !profile.resumeFile}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Start Assessments'}
                </button>
            </div>
        </div>
    )
}

function MCQStep({ mcqs, onNext }) {
    const [answers, setAnswers] = useState({})

    return (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                <Briefcase size={20} /> <span>Technical Signal</span>
            </div>
            {mcqs.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: '2rem' }}>
                    <p style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>{idx + 1}. {q.text}</p>
                    <div style={{ display: 'grid', gap: '0' }}>
                        {q.options.map((opt, oIdx) => (
                            <div
                                key={oIdx}
                                className={`mcq-option ${answers[q.id] === oIdx ? 'selected' : ''}`}
                                onClick={() => setAnswers({ ...answers, [q.id]: oIdx })}
                            >
                                <div style={{ width: '24px', height: '24px', border: '2px solid black', borderRadius: '50%', background: answers[q.id] === oIdx ? 'white' : 'transparent', flexShrink: 0 }}></div>
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <button className="btn btn-primary" onClick={onNext} style={{ width: '100%' }}>Next</button>
        </div>
    )
}

function ShortAnswerStep({ onComplete, onNext }) {
    return (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                <CheckCircle size={20} /> <span>Conceptual Clarity</span>
            </div>
            <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Explain how you would handle a sudden traffic spike in your application.</p>
            <textarea
                className="input-field"
                rows="4"
                placeholder="Type 2-3 lines here..."
                style={{ marginBottom: '1.5rem' }}
                onChange={(e) => onComplete(e.target.value)}
            ></textarea>
            <button className="btn btn-primary" onClick={onNext} style={{ width: '100%' }}>Next Step</button>
        </div>
    )
}

function CommStep({ onComplete, onNext }) {
    const [isRecording, setIsRecording] = useState(false)
    const [timer, setTimer] = useState(20)
    const [recognition, setRecognition] = useState(null)

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            const rec = new SpeechRecognition()
            rec.continuous = true
            rec.interimResults = true
            rec.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('')
                onComplete(transcript)
            }
            setRecognition(rec)
        }
    }, [])

    const toggleRecording = () => {
        if (isRecording) {
            recognition?.stop()
            setIsRecording(false)
        } else {
            setTimer(20)
            recognition?.start()
            setIsRecording(true)
        }
    }

    useEffect(() => {
        let interval;
        if (isRecording && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000)
        } else if (timer === 0 && isRecording) {
            recognition?.stop()
            setIsRecording(false)
        }
        return () => clearInterval(interval)
    }, [isRecording, timer])

    return (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>
                <Mic size={20} /> <span>Communication Signal</span>
            </div>
            <p style={{ fontWeight: '600', marginBottom: '1.5rem' }}>Describe your most impactful project in 20 seconds.</p>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: timer < 5 ? 'var(--error)' : 'white' }}>{timer}s</div>
                <button
                    className={`btn ${isRecording ? 'btn-error' : 'btn-primary'}`}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', padding: '0', background: isRecording ? 'var(--error)' : '' }}
                    onClick={toggleRecording}
                >
                    {isRecording ? <div className="animate-pulse" style={{ background: 'white', width: '20px', height: '20px', borderRadius: '4px' }}></div> : <Mic size={28} />}
                </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Click to {isRecording ? 'stop' : 'start'} recording. We'll analyze your clarity and confidence.
            </p>

            <button className="btn btn-primary" onClick={onNext} disabled={timer === 20 || isRecording} style={{ width: '100%' }}>Analyze My Readiness</button>
        </div>
    )
}

function ProcessingView() {
    return (
        <div className="glass-card animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 2rem' }} />
            <h2>Calculating Your Readiness...</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Our AI is scoring your technical skills, resume impact, and communication signals.</p>
        </div>
    )
}

function ResultsView({ results, onReset }) {
    return (
        <div className="animate-fade-in">
            <div className="glass-card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Rediness Score</h2>
                <div className="score-circle">
                    <span style={{ fontSize: '4rem', fontWeight: '900' }}>{results.score}</span>
                </div>
                <div style={{ background: 'black', color: 'white', display: 'inline-block', padding: '0.5rem 1.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                    Highly Ready
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.2rem' }}>Signal Breakdown</h3>
                    {Object.entries(results.breakdown).map(([key, val]) => (
                        <div key={key} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                <span>{key}</span>
                                <span>{val}%</span>
                            </div>
                            <div className="breakdown-bar">
                                <div className="breakdown-fill" style={{ width: `${val}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bauhaus-yellow)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.2rem' }}>Insights</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        {results.strengths.map((s, i) => <div key={i} style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>● {s}</div>)}
                    </div>
                    <div>
                        {results.gaps.map((g, i) => <div key={i} style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', color: 'var(--bauhaus-red)' }}>× {g}</div>)}
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ marginBottom: '1.5rem' }}>Action Plan</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {results.plan.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'var(--bauhaus-red)', border: '2px solid black', color: 'white', width: '32px', height: '32px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '900' }}>{i + 1}</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{step}</div>
                        </div>
                    ))}
                </div>
                <button className="btn btn-primary" onClick={onReset} style={{ width: '100%', marginTop: '2.5rem' }}>Retake Assessment</button>
            </div>
        </div>
    )
}

export default App
