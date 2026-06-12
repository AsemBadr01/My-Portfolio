import { useEffect, useRef } from 'react'

const GLYPHS = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي{}[]=<>/+*#01'.split('')

export default function Chapter3({ active }) {
  const canvasRef = useRef(null)
  const boostRef = useRef(1)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf
    let last = 0
    let drops = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const cols = Math.floor(canvas.width / 20)
      drops = Array.from({ length: cols }, () => ({
        y: Math.random() * canvas.height,
        speed: 2 + Math.random() * 3,
      }))
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const drawFrame = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '14px monospace'
      drops.forEach((d, i) => {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0]
        ctx.fillStyle = '#39FF14'
        ctx.globalAlpha = 1
        ctx.fillText(ch, i * 20, d.y)
        ctx.globalAlpha = 0.35
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * 20, d.y - 18)
        ctx.globalAlpha = 1
        d.y += d.speed * boostRef.current
        if (d.y > canvas.height + 20) d.y = -10
      })
    }

    if (reduce) {
      for (let i = 0; i < 40; i++) drawFrame() // one settled static frame
    } else {
      const loop = (t) => {
        raf = requestAnimationFrame(loop)
        if (t - last < 33) return // ~30fps cap
        last = t
        drawFrame()
      }
      raf = requestAnimationFrame(loop)
    }

    const onBoost = () => {
      boostRef.current = 3
      setTimeout(() => (boostRef.current = 1), 3000)
    }
    window.addEventListener('matrix-boost', onBoost)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('matrix-boost', onBoost)
    }
  }, [])

  const words = ['PYTORCH', 'TRANSFORMERS', 'ATTENTION', 'DEEP LEARNING']

  return (
    <section className={`chapter c3${active ? ' active' : ''}`} data-ch="3">
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="ch-inner">
        <h2>2022. I went deeper.</h2>
        <div className="words">
          {words.map((w, i) => (
            <span key={w} style={{ '--i': i }}>
              {w}
            </span>
          ))}
        </div>
        <p className="quote">"The Transformer wasn't just code. It was a revelation."</p>
        <p className="ref">Vaswani et al., 2017 — Attention Is All You Need</p>
      </div>
    </section>
  )
}
