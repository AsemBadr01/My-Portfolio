import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import { CHAPTERS, chapterName } from '../constants/chapterData'
import Chapter1 from './chapters/Chapter1'
import Chapter2 from './chapters/Chapter2'
import Chapter3 from './chapters/Chapter3'
import Chapter4 from './chapters/Chapter4'
import Chapter5 from './chapters/Chapter5'
import Oracle from './Oracle'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const ExpCtx = createContext(null)
export const useExp = () => useContext(ExpCtx)

export default function Experience() {
  const [chapter, setChapter] = useState(1)
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

  const goToChapter = useCallback(
    (n, { withFlash = true } = {}) => {
      n = Math.max(1, Math.min(5, n))
      if (withFlash) flash()
      const st = stRef.current
      if (st) {
        const y = st.start + ((n - 1) / 4) * (st.end - st.start)
        gsap.to(window, { scrollTo: y, duration: 1.5, ease: 'power2.inOut' })
      } else {
        document.querySelector(`.chapter[data-ch="${n}"]`)?.scrollIntoView({ behavior: 'smooth' })
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
          scrub: 1.5,
          end: () => '+=' + dist(),
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress)
            const ch = Math.min(5, Math.floor(self.progress * 5) + 1)
            setChapter((c) => (c === ch ? c : ch))
          },
        },
      })
      stRef.current = tween.scrollTrigger
      return () => {
        stRef.current = null
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
      const sections = gsap.utils.toArray('.chapter')
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              const n = Number(e.target.dataset.ch)
              setChapter(n)
              setProgress((n - 1) / 4)
            }
          }
        },
        { threshold: 0.5 }
      )
      sections.forEach((s) => obs.observe(s))
      return () => obs.disconnect()
    })

    return () => mm.revert()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') goToChapter(chapter + 1)
      if (e.key === 'ArrowLeft') goToChapter(chapter - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chapter, goToChapter])

  const ctx = { chapter, name: chapterName(chapter), goToChapter, guided, setGuided }
  const accent = CHAPTERS[chapter - 1].accent

  return (
    <ExpCtx.Provider value={ctx}>
      <div className="flash" ref={flashRef} />
      <div className="gui" style={{ '--accent': accent }}>
        <div className="progress">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="chcount">CHAPTER 0{chapter} / 05</div>
        <div className="navarrows">
          <button aria-label="Previous chapter" onClick={() => goToChapter(chapter - 1)}>←</button>
          <button aria-label="Next chapter" onClick={() => goToChapter(chapter + 1)}>→</button>
        </div>
        <button className={`tourtoggle${guided ? ' on' : ''}`} onClick={() => setGuided((g) => !g)}>
          GUIDED TOUR
        </button>
      </div>

      <div className="hwrap" ref={wrapRef} style={{ '--accent': accent }}>
        <div className="track" ref={trackRef}>
          <Chapter1 active={chapter === 1} />
          <Chapter2 active={chapter === 2} />
          <Chapter3 active={chapter === 3} />
          <Chapter4 active={chapter === 4} />
          <Chapter5 active={chapter === 5} />
        </div>
      </div>

      <Oracle />
    </ExpCtx.Provider>
  )
}
