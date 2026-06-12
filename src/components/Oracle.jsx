import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { useExp } from './Experience'
import { CHAPTERS, TOUR_OFFER, CONTACT_REPLY, NAV_CONFIRMS } from '../constants/chapterData'
import { streamOracle } from '../lib/streamApi'
import { detectNavIntent, isHireIntent, isBasmala, isMatrixEgg } from '../lib/intent'

const OPENING =
  "Hi! I'm Assem's AI portfolio assistant. I know everything about his work in speech recognition, deep learning, and AI systems. What would you like to know? 👋"

let MID = 0
const mkMsg = (role, content, extra = {}) => ({ id: ++MID, role, content, ...extra })

export default function Oracle() {
  const { chapter, name, goToChapter, guided, setGuided } = useExp()
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

  const data = CHAPTERS[chapter - 1]

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
  const typeLocal = useCallback(
    (text, { thenIdle = false } = {}) => {
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
    },
    []
  )

  /* ---------- first-visit tour offer ---------- */

  useEffect(() => {
    let prompted = true
    try {
      prompted = !!localStorage.getItem('epoch_tour_prompted')
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
      localStorage.setItem('epoch_tour_prompted', '1')
    } catch {}
    setOfferMode(false)
  }

  const answerOffer = (start) => {
    try {
      localStorage.setItem('epoch_tour_prompted', '1')
    } catch {}
    setOfferMode(false)
    if (start) {
      setGuided(true)
      narrated.current.delete(chapter)
    } else {
      typeLocal('Sounds good — explore freely. I\'m right here whenever you have a question. ✨', { thenIdle: true })
    }
  }

  /* ---------- guided tour narration ---------- */

  useEffect(() => {
    if (!guided) return
    if (narrated.current.has(chapter)) return
    narrated.current.add(chapter)
    setOpen(true)
    typeLocal(CHAPTERS[chapter - 1].narration, { thenIdle: true })
  }, [chapter, guided, typeLocal])

  /* ---------- voice input ---------- */

  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  const toggleMic = () => {
    if (listening) {
      recRef.current?.stop()
      return
    }
    const rec = new SR()
    recRef.current = rec
    rec.lang = chapter === 4 ? 'ar-EG' : 'en-US'
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
    if (isMatrixEgg(text)) {
      window.dispatchEvent(new Event('matrix-boost'))
      goToChapter(3)
      typeLocal('🟢 Speed of thought. Watch the rain.')
      return
    }
    if (isBasmala(text)) {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: ['#C9A84C', '#F5E6B8', '#8A6F2E'] })
    }
    const navN = detectNavIntent(text)
    if (navN) {
      goToChapter(navN)
      typeLocal(NAV_CONFIRMS[navN])
      return
    }

    // real Oracle call
    setBusy(true)
    const aiId = append(mkMsg('assistant', '', { streaming: true }))
    const history = [...msgs, { role: 'user', content: text }]
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map((m, i, arr) => ({
        role: m.role,
        content: i === arr.length - 1 ? `[visitor is on chapter ${chapter}: ${name}] ${m.content}` : m.content,
      }))

    abortRef.current = new AbortController()
    await streamOracle(history, {
      signal: abortRef.current.signal,
      onToken: (t) => patch(aiId, (m) => ({ ...m, content: m.content + t })),
      onNavigate: (n) => goToChapter(n),
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
      <button className="orb orbskin" data-ch={chapter} onClick={() => setOpen(true)} aria-label="Open the Oracle chat">
        <img src="/assem-avatar.webp" alt="" />
        <span className="tip">Ask me anything</span>
      </button>
    )
  }

  const pills = offerMode ? ['▶ Start tour', 'Explore on my own'] : data.pills

  return (
    <div className="oracle" data-ch={chapter} role="dialog" aria-label="Oracle chat">
      <div className="o-head">
        <img src="/assem-avatar.webp" alt="Assem" />
        <span className="label">{data.label}</span>
        <button className="x" onClick={close} aria-label="Close chat">✕</button>
      </div>

      <div className="o-msgs" ref={scrollRef}>
        {msgs.map((m) => (
          <div key={m.id} className={`msg ${m.role === 'user' ? 'user' : 'ai'}${m.streaming ? ' streaming' : ''}`} dir="auto">
            {m.role === 'assistant' && <span className="prefix">{data.label}</span>}
            {m.content}
          </div>
        ))}
      </div>

      <div className="o-pills">
        {pills.map((p) => (
          <button key={p} onClick={() => (offerMode ? answerOffer(p.startsWith('▶')) : send(p))}>
            {p}
          </button>
        ))}
      </div>

      <div className="o-input">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            clearIdle()
          }}
          onFocus={clearIdle}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={chapter === 4 ? 'Ask me anything… اسألني بالعربية' : 'Ask me anything…'}
          aria-label="Message the Oracle"
        />
        {SR && (
          <button className={`mic${listening ? ' listening' : ''}`} onClick={toggleMic} aria-label="Voice input">
            🎙
          </button>
        )}
        <button onClick={() => send()} disabled={busy || !input.trim()} aria-label="Send">
          ➤
        </button>
      </div>
    </div>
  )
}
