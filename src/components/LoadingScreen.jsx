import { useEffect, useState } from 'react'

const LINE = 'Five chapters. One story. Ready to begin?'

export default function LoadingScreen({ onPlay }) {
  const [typed, setTyped] = useState('')
  const [showPlay, setShowPlay] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setTyped(LINE)
      setShowPlay(true)
      return
    }
    let i = 0
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1
        setTyped(LINE.slice(0, i))
        if (i >= LINE.length) {
          clearInterval(id)
          setShowPlay(true)
        }
      }, 40)
    }, 1500)
    return () => clearTimeout(start)
  }, [])

  const play = () => {
    setLeaving(true)
    setTimeout(onPlay, 350)
  }

  return (
    <div className="loading" style={leaving ? { opacity: 0, transition: 'opacity 0.35s ease' } : undefined}>
      <div className="name">ASSEM BADR</div>
      <div className="sub">AI ENGINEER · 2020 — 2026</div>
      <div className="typeline">
        {typed}
        <span className="cursor">|</span>
      </div>
      {showPlay && (
        <button className="playbtn" onClick={play}>
          PLAY ▶
        </button>
      )}
      <a className="skiplink" href="/resume">
        in a hurry? skip to the plain resume →
      </a>
    </div>
  )
}
