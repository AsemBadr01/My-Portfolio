import { useEffect, useRef, useState } from 'react'

export default function Chapter4({ active }) {
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
    const dur = 2500
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setWer(Math.round(119 - eased * (119 - 27)))
      if (p < 1) requestAnimationFrame(tick)
      else setDone(true)
    }
    const start = setTimeout(() => requestAnimationFrame(tick), 1200)
    return () => clearTimeout(start)
  }, [active])

  return (
    <section className={`chapter c4${active ? ' active' : ''}`} data-ch="4">
      <svg className="pcb" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120 H 300 V 320 H 620 V 180 H 1200" />
        <path d="M0 640 H 220 V 480 H 540 V 700 H 1200" />
        <path d="M120 0 V 240 H 420 V 560 H 760 V 800" />
        <path d="M1080 0 V 200 H 860 V 460 H 1010 V 800" />
        <path d="M0 410 H 160 V 560 H 380" />
        <path d="M900 320 H 1200 M 700 620 H 980 V 760" />
      </svg>
      <div className="ch-inner">
        <div className="makhraj-wrap">
          <div className="makhraj">مخرج</div>
          <span className="tashkeel t1" style={{ top: '-10%', right: '8%' }}>َ</span>
          <span className="tashkeel t2" style={{ top: '-18%', right: '42%' }}>ّ</span>
          <span className="tashkeel t3" style={{ bottom: '-14%', right: '24%' }}>ِ</span>
          <span className="tashkeel t4" style={{ top: '-12%', left: '6%' }}>ُ</span>
          <span className="tashkeel t5" style={{ bottom: '-10%', left: '18%' }}>ً</span>
        </div>
        <div className="en">Makhraj — Articulation Point</div>
        <p className="mission">An AI system to help Muslims recite the Holy Quran correctly.</p>

        <div className="metrics">
          <div className="metric m1"><span>🎤 Real-time Feedback</span><b>WebSockets</b></div>
          <div className="metric m2"><span>🧠 Model</span><b>OpenAI Whisper · fine-tuned</b></div>
          <div className="metric m3"><span>☁️ Deployed on</span><b>Microsoft Azure</b></div>
          <div className="metric m4">
            <span>⌥ Source</span>
            <b>
              <a href="https://github.com/AsemBadr01/Makhraj" target="_blank" rel="noreferrer">
                github.com/AsemBadr01/Makhraj
              </a>
            </b>
          </div>
        </div>

        <div className="wer">
          <div className={`num${done ? ' done' : ''}`}>WER: {wer}%</div>
          <div className="cap">Word Error Rate — with full Tashkeel (diacritical marks) · 119% → 27%</div>
        </div>

        <p className="credit">Ain Shams University · Supervised by Dr. Ahmed Salah · Grade: A</p>
      </div>
    </section>
  )
}
