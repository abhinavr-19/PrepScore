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
        <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--primary)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Target size={32} color="white" />
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>PrepPulse AI</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Measure your interview readiness objectively in under 120 seconds.
            </p>
            <button className="btn btn-primary" onClick={onStart}>
                Start Assessment <ArrowRight size={18} />
            </button>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} /> Technical</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mic size={16} /> Communication</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} /> Resume</div>
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
                <div key={q.id} style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontWeight: '600', marginBottom: '1rem' }}>{idx + 1}. {q.text}</p>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {q.options.map((opt, oIdx) => (
                            <label key={oIdx} className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', background: answers[q.id] === oIdx ? 'rgba(99, 102, 241, 0.2)' : '' }}>
                                <input type="radio" name={`q-${q.id}`} onChange={() => setAnswers({ ...answers, [q.id]: oIdx })} checked={answers[q.id] === oIdx} style={{ accentColor: 'var(--primary)' }} />
                                {opt}
                            </label>
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
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Readiness Score</h2>
                <div style={{ position: 'relative', width: '150px', height: '150px', margin: '1.5rem auto' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <path stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray={`${results.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2.5rem', fontWeight: '800' }}>
                        {results.score}
                    </div>
                </div>
                <p style={{ fontWeight: '600', color: 'var(--success)' }}>Highly Ready!</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Breakdown</h3>
                    {Object.entries(results.breakdown).map(([key, val]) => (
                        <div key={key} style={{ marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                <span style={{ textTransform: 'capitalize' }}>{key}</span>
                                <span>{val}%</span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                <div style={{ height: '100%', width: `${val}%`, background: 'var(--primary)', borderRadius: '2px' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Strengths & Gaps</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        {results.strengths.map((s, i) => <div key={i} style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}><CheckCircle size={14} /> {s}</div>)}
                    </div>
                    <div>
                        {results.gaps.map((g, i) => <div key={i} style={{ fontSize: '0.8rem', color: 'var(--error)', display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}><AlertCircle size={14} /> {g}</div>)}
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>7-Day Improvement Plan</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {results.plan.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800' }}>{i + 1}</div>
                            <div style={{ fontSize: '0.95rem' }}>{step}</div>
                        </div>
                    ))}
                </div>
                <button className="btn btn-primary" onClick={onReset} style={{ width: '100%', marginTop: '2rem' }}>Retake Assessment</button>
            </div>
        </div>
    )
}

export default App
