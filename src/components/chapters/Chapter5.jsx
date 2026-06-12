const SKILLS = ['Python', 'PyTorch', 'Transformers', 'Azure', 'WebSockets', 'Whisper', 'NLP', 'C++', 'JavaScript']

export default function Chapter5({ active }) {
  return (
    <section className={`chapter c5${active ? ' active' : ''}`} data-ch="5">
      <div className="ch-inner">
        <h2>2024. Deployed.</h2>
        <p className="sub">Fine-tuned. Deployed. Real-time. Graduated with Very Good.</p>
        <p className="body">From Cairo to the cloud. The system went live.</p>

        <div className="pills">
          {SKILLS.map((s, i) => (
            <span key={s} style={{ '--i': i }}>
              {s}
            </span>
          ))}
        </div>

        <div className="contactcard">
          <img src="/assem-headshot.webp" alt="Assem Badr" width="92" height="92" />
          <ul>
            <li>📧 <a href="mailto:asemmosa202@gmail.com">asemmosa202@gmail.com</a></li>
            <li>💼 <a href="https://www.linkedin.com/in/assem-badr/" target="_blank" rel="noreferrer">linkedin.com/in/assem-badr</a></li>
            <li>🐙 <a href="https://github.com/AsemBadr01" target="_blank" rel="noreferrer">github.com/AsemBadr01</a></li>
            <li>📍 Cairo, Egypt <span className="status">Open to opportunities</span></li>
          </ul>
        </div>

        <div className="next">
          <div className="kicker">CHAPTER 06</div>
          <h3>GridNox.ai</h3>
          <p>2026 — the next chapter is already written. The story keeps going.</p>
          <a className="cta" href="mailto:asemmosa202@gmail.com?subject=Let's%20build%20something%20together">
            Let's talk →
          </a>
        </div>

        <p className="endcard">← scroll back to revisit any chapter · or ask the Oracle anything ↘</p>
      </div>
    </section>
  )
}
