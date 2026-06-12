import { useEffect, useRef, useState } from 'react'

const SIDE_PROJECTS = [
  {
    title: 'Dry Bean Classification',
    text: 'Perceptron vs Adaline, head to head — binary classification with feature selection, comparing gradient-based and threshold-based learning.',
    tags: ['Python', 'ML'],
  },
  {
    title: 'Mini Amazon',
    text: 'An e-commerce engine built in C++ on top of custom data structures.',
    tags: ['C++', 'Data Structures'],
  },
  {
    title: 'Blackjack',
    text: 'A Java card game with a clean object-oriented design.',
    tags: ['Java', 'OOP'],
  },
]

export default function Projects({ active }) {
  const [wer, setWer] = useState(119)
  const [done, setDone] = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (!active || ran.current) return
    ran.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWer(27)
      setDone(true)
      return
    }
    const t0 = performance.now()
    const dur = 2200
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setWer(Math.round(119 - eased * (119 - 27)))
      if (p < 1) requestAnimationFrame(tick)
      else setDone(true)
    }
    const start = setTimeout(() => requestAnimationFrame(tick), 900)
    return () => clearTimeout(start)
  }, [active])

  return (
    <section className={`sec s-projects${active ? ' active' : ''}`} data-sec="4">
      <div className="ghost arabic plx" data-depth="0.25" aria-hidden="true">مخرج</div>
      <div className="ch-inner wide">
        <p className="kicker rv" style={{ '--i': 0 }}>03 · PROJECTS</p>
        <h2 className="rv" style={{ '--i': 1 }}>Built to be heard</h2>
        <div className="proj-grid">
          <article className="featured rv" style={{ '--i': 2 }}>
            <div className="feat-head">
              <span className="makhraj" lang="ar">مخرج</span>
              <div>
                <h3>Makhraj — Quran Recitation Recognizer</h3>
                <p className="feat-sub">Graduation project · Grade A · Ain Shams University · team of 4</p>
              </div>
            </div>
            <p className="feat-text">
              An app that listens to Quran recitation and flags mistakes in real time — both wrong
              words and wrong Tashkeel (diacritics). We fine-tuned OpenAI Whisper on 13,753 Quranic
              audio files and built the matching algorithm from scratch: dual pointers,
              diacritic-aware comparison, prefix buffering across audio chunks, and mid-recitation
              backtracking.
            </p>
            <div className="wer-row">
              <div className={`wer-num${done ? ' done' : ''}`}>{wer}%</div>
              <div className="wer-cap">
                Word Error Rate with full Tashkeel<br />119% before fine-tuning → 27% after
              </div>
            </div>
            <div className="feat-tags">
              <span>Whisper · fine-tuned</span>
              <span>PyTorch</span>
              <span>WebSockets · real-time</span>
              <span>Microsoft Azure</span>
            </div>
            <a className="btn solid sm" href="https://github.com/AsemBadr01/Makhraj" target="_blank" rel="noreferrer">
              View on GitHub →
            </a>
          </article>
          <div className="side-stack">
            {SIDE_PROJECTS.map((p, i) => (
              <article key={p.title} className="proj-card rv" style={{ '--i': i + 3 }}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className="feat-tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
