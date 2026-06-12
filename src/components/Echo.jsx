import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { useExp } from './Experience'
import { SECTIONS, TOUR_OFFER, CONTACT_REPLY, NAV_CONFIRMS } from '../constants/sectionData'
import { streamOracle } from '../lib/streamApi'
import { detectNavIntent, isHireIntent, isBasmala } from '../lib/intent'

const OPENING =
  "Hey — I'm Echo 🎧 Assem's AI guide. I know his whole story: the models, Makhraj, the journey. Ask me anything, or tell me where to take you."

let MID = 0
const mkMsg = (role, content, extra = {}) => ({ id: ++MID, role, content, ...extra })

export default function Echo() {
  const { section, name, goToSection, guided, setGuided } = useExp()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([mkMsg('assistant', OPENING)])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [offerMode, setOfferMode] = useState(false)
  const [listening, setListening] = useState(false)

  const abortRef = useRef(null)
  const scrollRef = useRef(null)
  const idleRef = useRef(null)
  const typeRef = useRef(null)
  const narrated = useRef(new Set())
  const recRef = useRef(null)

  const data = SECTIONS[section - 1]

  /* ---------- helpers ---------- */

  const scrollDown = () => {
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }

  const append = useCallback((msg) => {
    setMsgs((m) => [...m, msg])
    scrollDown()
    return msg.id
  }, [])

  const patch = useCallback((id, fn) => {
    setMsgs((m) => m.map((x) => (x.id === id ? fn(x) : x)))
    scrollDown()
  }, [])

  const clearIdle = () => {
    if (idleRef.current) clearTimeout(idleRef.current)
    idleRef.current = null
  }
  const armIdleCollapse = () => {
    clearIdle()
    idleRef.current = setTimeout(() => setOpen(false), 8000)
  }

  // Typewriter for local (non-API) replies.
  const typeLocal = useCallback((text, { thenIdle = false } = {}) => {
    if (typeRef.current) {
      clearInterval(typeRef.current)
      typeRef.current = null
      setMsgs((m) => m.map((x) => (x.streaming ? { ...x, streaming: false } : x)))
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = ++MID
    if (reduce) {
      setMsgs((m) => [...m, { id, role: 'assistant', content: text }])
      scrollDown()
      if (thenIdle) armIdleCollapse()
      return
    }
    setMsgs((m) => [...m, { id, role: 'assistant', content: '', streaming: true }])
    let i = 0
    setBusy(true)
    typeRef.current = setInterval(() => {
      i += 2
      const slice = text.slice(0, i)
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, content: slice, streaming: i < text.length } : x)))
      scrollDown()
      if (i >= text.length) {
        clearInterval(typeRef.current)
        typeRef.current = null
        setBusy(false)
        if (thenIdle) armIdleCollapse()
      }
    }, 18)
  }, [])

  /* ---------- first-visit tour offer ---------- */

  useEffect(() => {
    let prompted = true
    try {
      prompted = !!localStorage.getItem('echo_tour_prompted')
    } catch {}
    if (prompted) return
    const t = setTimeout(() => {
      setOpen(true)
      setOfferMode(true)
      typeLocal(TOUR_OFFER)
    }, 1600)
    return () => clearTimeout(t)
  }, [typeLocal])

  const dismissOffer = () => {
    try {
      localStorage.setItem('echo_tour_prompted', '1')
    } catch {}
    setOfferMode(false)
  }

  const answerOffer = (start) => {
    try {
      localStorage.setItem('echo_tour_prompted', '1')
    } catch {}
    setOfferMode(false)
    if (start) {
      setGuided(true)
      narrated.current.delete(section)
    } else {
      typeLocal("Sounds good — explore freely. I'm right here whenever you have a question. ✨", { thenIdle: true })
    }
  }

  /* ---------- guided tour narration ---------- */

  useEffect(() => {
    if (!guided) return
    if (narrated.current.has(section)) return
    narrated.current.add(section)
    setOpen(true)
    typeLocal(SECTIONS[section - 1].narration, { thenIdle: true })
  }, [section, guided, typeLocal])

  /* ---------- voice input ---------- */

  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  const toggleMic = () => {
    if (listening) {
      recRef.current?.stop()
      return
    }
    const rec = new SR()
    recRef.current = rec
    rec.lang = section === 4 ? 'ar-EG' : 'en-US'
    rec.interimResults = true
    rec.continuous = false
    let final = ''
    rec.onresult = (e) => {
      let interim = ''
      for (const r of e.results) {
        if (r.isFinal) final += r[0].transcript
        else interim += r[0].transcript
      }
      setInput(final || interim)
    }
    rec.onend = () => {
      setListening(false)
      if (final.trim()) send(final.trim())
    }
    rec.onerror = () => setListening(false)
    setListening(true)
    rec.start()
  }

  /* ---------- send ---------- */

  const send = async (raw) => {
    const text = (raw ?? input).trim()
    if (!text || busy) return
    setInput('')
    clearIdle()
    if (offerMode) dismissOffer()
    append(mkMsg('user', text))

    // zero-cost client-side intents first
    if (isHireIntent(text)) {
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.7 } })
      typeLocal(CONTACT_REPLY)
      return
    }
    if (isBasmala(text)) {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: ['#d4a843', '#f5e6b8', '#8a6f2e'] })
    }
    const navN = detectNavIntent(text)
    if (navN) {
      goToSection(navN)
      typeLocal(NAV_CONFIRMS[navN])
      return
    }

    // real Echo call
    setBusy(true)
    const aiId = append(mkMsg('assistant', '', { streaming: true }))
    const history = [...msgs, { role: 'user', content: text }]
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map((m, i, arr) => ({
        role: m.role,
        content: i === arr.length - 1 ? `[visitor is on section ${section}: ${name}] ${m.content}` : m.content,
      }))

    abortRef.current = new AbortController()
    await streamOracle(history, {
      signal: abortRef.current.signal,
      onToken: (t) => patch(aiId, (m) => ({ ...m, content: m.content + t })),
      onNavigate: (n) => goToSection(n),
      onBusy: (fb) => patch(aiId, (m) => ({ ...m, content: fb, streaming: false })),
      onDone: () => patch(aiId, (m) => ({ ...m, streaming: false })),
    })
    setBusy(false)
  }

  const close = () => {
    abortRef.current?.abort()
    if (typeRef.current) {
      clearInterval(typeRef.current)
      typeRef.current = null
      setBusy(false)
      setMsgs((m) => m.map((x) => ({ ...x, streaming: false })))
    }
    clearIdle()
    if (offerMode) dismissOffer()
    setOpen(false)
  }

  useEffect(() => () => abortRef.current?.abort(), [])

  /* ---------- render ---------- */

  if (!open) {
    return (
      <button
        className="echo-orb"
        style={{ '--accent': data.accent }}
        onClick={() => setOpen(true)}
        aria-label="Open Echo, the AI guide"
      >
        <img src="/assem-avatar.webp" alt="" />
        <span className="ring" aria-hidden="true" />
        <span className="tip">Chat with Echo</span>
      </button>
    )
  }

  const pills = offerMode ? ['▶ Start tour', 'Explore on my own'] : data.pills

  return (
    <div className="echo" style={{ '--accent': data.accent }} role="dialog" aria-label="Echo chat">
      <div className="e-head">
        <img src="/assem-avatar.webp" alt="" />
        <div className="who">
          <b>ECHO</b>
          <span>Assem's AI guide</span>
        </div>
        <button className="x" onClick={close} aria-label="Close chat">✕</button>
      </div>

      <div className="e-msgs" ref={scrollRef}>
        {msgs.map((m) => (
          <div key={m.id} className={`msg ${m.role === 'user' ? 'user' : 'ai'}${m.streaming ? ' streaming' : ''}`} dir="auto">
            {m.content}
          </div>
        ))}
      </div>

      <div className="e-pills">
        {pills.map((p) => (
          <button key={p} onClick={() => (offerMode ? answerOffer(p.startsWith('▶')) : send(p))}>
            {p}
          </button>
        ))}
      </div>

      <div className="e-input">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            clearIdle()
          }}
          onFocus={clearIdle}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={section === 4 ? 'Ask about Makhraj… اسألني بالعربية' : 'Ask Echo anything…'}
          aria-label="Message Echo"
        />
        {SR && (
          <button className={`mic${listening ? ' listening' : ''}`} onClick={toggleMic} aria-label="Voice input">
            🎙
          </button>
        )}
        <button className="go" onClick={() => send()} disabled={busy || !input.trim()} aria-label="Send">
          ➤
        </button>
      </div>
    </div>
  )
}
