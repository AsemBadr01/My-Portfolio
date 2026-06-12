import { useExp } from '../Experience'

const NAME = 'ASSEM BADR'
// deterministic pseudo-random bar heights for the audio waveform motif
const BARS = Array.from({ length: 28 }, (_, i) => 22 + Math.abs(Math.sin(i * 1.7 + 1)) * 78)

export default function Hero({ active }) {
  const { goToSection } = useExp()
  return (
    <section className={`sec s-hero${active ? ' active' : ''}`} data-sec="1">
      <div className="halo plx" data-depth="0.32" aria-hidden="true" />
      <div className="grid-floor plx" data-depth="0.12" aria-hidden="true" />
      <div className="ch-inner">
        <p className="kicker rv" style={{ '--i': 0 }}>AI ENGINEER — CAIRO, EGYPT</p>
        <h1 aria-label="Assem Badr">
          {NAME.split('').map((c, i) =>
            c === ' ' ? (
              <span key={i} className="sp"> </span>
            ) : (
              <span key={i} style={{ '--i': i }}>{c}</span>
            )
          )}
        </h1>
        <p className="tagline rv" style={{ '--i': 3 }}>
          I teach machines to <em>listen</em>.
        </p>
        <div className="eq rv" style={{ '--i': 4 }} aria-hidden="true">
          {BARS.map((h, i) => (
            <span key={i} style={{ '--i': i, '--h': `${h}%` }} />
          ))}
        </div>
        <p className="sub rv" style={{ '--i': 5 }}>
          Machine learning · Deep learning · Speech recognition · Real-time AI systems
        </p>
        <div className="ctas rv" style={{ '--i': 6 }}>
          <button className="btn solid" onClick={() => goToSection(4)}>View my work →</button>
          <button className="btn ghost" onClick={() => goToSection(6)}>Get in touch</button>
        </div>
      </div>
      <div className="scrollhint" aria-hidden="true">
        scroll <span className="arr">→</span>
      </div>
    </section>
  )
}
