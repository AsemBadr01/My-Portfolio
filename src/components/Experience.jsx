import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import { SECTIONS, sectionName } from '../constants/sectionData'
import ParticleField from './ParticleField'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Journey from './sections/Journey'
import Contact from './sections/Contact'
import Echo from './Echo'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const ExpCtx = createContext(null)
export const useExp = () => useContext(ExpCtx)

export default function Experience() {
  const [section, setSection] = useState(1)
  const [progress, setProgress] = useState(0)
  const [guided, setGuided] = useState(false)
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const flashRef = useRef(null)
  const stRef = useRef(null)

  const flash = useCallback(() => {
    const el = flashRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.remove('go')
    void el.offsetWidth
    el.classList.add('go')
  }, [])

  const goToSection = useCallback(
    (n, { withFlash = true } = {}) => {
      n = Math.max(1, Math.min(6, n))
      if (withFlash) flash()
      const st = stRef.current
      if (st) {
        const y = st.start + ((n - 1) / 5) * (st.end - st.start)
        gsap.to(window, { scrollTo: y, duration: 1.4, ease: 'power3.inOut' })
      } else {
        document.querySelector(`.sec[data-sec="${n}"]`)?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [flash]
  )

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current
      const dist = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          pin: true,
          scrub: 1.2,
          end: () => '+=' + dist(),
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress)
            // switch active section at the midpoint of each panel transition
            const s = Math.max(1, Math.min(6, Math.round(self.progress * 5) + 1))
            setSection((c) => (c === s ? c : s))
          },
        },
      })
      stRef.current = tween.scrollTrigger

      // parallax depth layers: decorative elements drift at their own speed
      const plxTweens = gsap.utils.toArray('.plx').map((el) => {
        const d = parseFloat(el.dataset.depth || 0.2)
        return gsap.fromTo(
          el,
          { x: () => d * window.innerWidth },
          {
            x: () => -d * window.innerWidth,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        )
      })

      return () => {
        stRef.current = null
        plxTweens.forEach((t) => {
          t.scrollTrigger?.kill()
          t.kill()
        })
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
      const sections = gsap.utils.toArray('.sec')
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              const n = Number(e.target.dataset.sec)
              setSection(n)
              setProgress((n - 1) / 5)
            }
          }
        },
        { threshold: 0.4 }
      )
      sections.forEach((s) => obs.observe(s))
      return () => obs.disconnect()
    })

    return () => mm.revert()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') goToSection(section + 1)
      if (e.key === 'ArrowLeft') goToSection(section - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [section, goToSection])

  const ctx = { section, name: sectionName(section), goToSection, guided, setGuided }
  const accent = SECTIONS[section - 1].accent

  return (
    <ExpCtx.Provider value={ctx}>
      <ParticleField accent={accent} />
      <div className="flash" ref={flashRef} />

      <header className="topnav" style={{ '--accent': accent }}>
        <button className="brand" onClick={() => goToSection(1)} aria-label="Back to start">
          AB<span>.</span>
        </button>
        <nav aria-label="Sections">
          {SECTIONS.map((s) => (
            <button
              key={s.n}
              className={section === s.n ? 'on' : ''}
              aria-current={section === s.n ? 'true' : undefined}
              onClick={() => goToSection(s.n)}
            >
              {s.name}
            </button>
          ))}
        </nav>
      </header>

      <div className="gui" style={{ '--accent': accent }}>
        <div className="progress">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <button className={`tourtoggle${guided ? ' on' : ''}`} onClick={() => setGuided((g) => !g)}>
          ✦ GUIDED TOUR
        </button>
      </div>

      <div className="hwrap" ref={wrapRef} style={{ '--accent': accent }}>
        <div className="track" ref={trackRef}>
          <Hero active={section === 1} />
          <About active={section === 2} />
          <Skills active={section === 3} />
          <Projects active={section === 4} />
          <Journey active={section === 5} />
          <Contact active={section === 6} />
        </div>
      </div>

      <Echo />
    </ExpCtx.Provider>
  )
}
