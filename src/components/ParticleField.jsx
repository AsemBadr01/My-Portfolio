import { useEffect, useRef } from 'react'

// Full-viewport neural constellation behind every section.
// Budget: ~55 nodes, 30fps cap, transform-free (single canvas), desktop only.
// The node color lerps toward the active section accent, so the whole world
// shifts hue smoothly as the visitor travels.

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export default function ParticleField({ accent }) {
  const canvasRef = useRef(null)
  const accentRef = useRef(accent)

  useEffect(() => {
    accentRef.current = accent
  }, [accent])

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const N = 55
    const LINK = 130
    let raf
    let last = 0
    let w, h
    let pts = []
    const col = hexToRgb(accentRef.current)

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      if (!pts.length) {
        pts = Array.from({ length: N }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
        }))
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const frame = (t) => {
      raf = requestAnimationFrame(frame)
      if (t - last < 33) return // ~30fps
      last = t

      const target = hexToRgb(accentRef.current)
      col.r += (target.r - col.r) * 0.04
      col.g += (target.g - col.g) * 0.04
      col.b += (target.b - col.b) * 0.04
      const c = `${col.r | 0},${col.g | 0},${col.b | 0}`

      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10
      }
      ctx.lineWidth = 1
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d2 = dx * dx + dy * dy
          if (d2 > LINK * LINK) continue
          const a = (1 - Math.sqrt(d2) / LINK) * 0.14
          ctx.strokeStyle = `rgba(${c},${a.toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(pts[i].x, pts[i].y)
          ctx.lineTo(pts[j].x, pts[j].y)
          ctx.stroke()
        }
      }
      ctx.fillStyle = `rgba(${c},0.55)`
      for (const p of pts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas className="pfield" ref={canvasRef} aria-hidden="true" />
}
