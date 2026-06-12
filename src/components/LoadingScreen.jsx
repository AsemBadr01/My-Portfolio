import { useEffect, useState } from 'react'

const NAME = 'ASSEM BADR'
const LINE = 'I teach machines to listen.'
const BARS = Array.from({ length: 16 }, (_, i) => 25 + Math.abs(Math.sin(i * 1.9 + 1)) * 75)

export default function LoadingScreen({ onPlay }) {
  const [typed, setTyped] = useState('')
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setTyped(LINE)
      setReady(true)
      return
    }
    let i = 0
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1
        setTyped(LINE.slice(0, i))
        if (i >= LINE.length) {
          clearInterval(id)
          setReady(true)
        }
      }, 35)
    }, 900)
    return () => clearTimeout(start)
  }, [])

  useEffect(() => {
    if (!ready) return
    const onKey = (e) => e.key === 'Enter' && play()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const play = () => {
    setLeaving(true)
    setTimeout(onPlay, 400)
  }

  return (
    <div className={`loading${leaving ? ' leaving' : ''}`}>
      <div className="eq intro" aria-hidden="true">
        {BARS.map((h, i) => (
          <span key={i} style={{ '--i': i, '--h': `${h}%` }} />
        ))}
      </div>
      <div className="name" aria-label="Assem Badr">
        {NAME.split('').map((c, i) =>
          c === ' ' ? <span key={i} className="sp"> </span> : <span key={i} style={{ '--i': i }}>{c}</span>
        )}
      </div>
      <div className="sub">AI ENGINEER · CAIRO, EGYPT</div>
      <div className="typeline">
        {typed}
        <span className="cursor">|</span>
      </div>
      <button className={`enterbtn${ready ? ' show' : ''}`} onClick={play} disabled={!ready}>
        EXPLORE THE PORTFOLIO →
      </button>
      <a className="skiplink" href="/resume">
        in a hurry? plain resume →
      </a>
    </div>
  )
}
