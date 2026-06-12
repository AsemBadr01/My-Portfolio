export default function Contact({ active }) {
  return (
    <section className={`sec s-contact${active ? ' active' : ''}`} data-sec="6">
      <div className="halo plx" data-depth="0.3" aria-hidden="true" />
      <div className="ch-inner">
        <p className="kicker rv" style={{ '--i': 0 }}>05 · CONTACT</p>
        <h2 className="big rv" style={{ '--i': 1 }}>
          Let's build something<br />worth listening to.
        </h2>
        <p className="lead rv" style={{ '--i': 2 }}>
          Open to opportunities — based in Cairo, Egypt 🇪🇬
        </p>
        <div className="contact-grid">
          <a className="contact-card rv" style={{ '--i': 3 }} href="mailto:asemmosa202@gmail.com">
            <span className="label">EMAIL</span>
            <b>asemmosa202@gmail.com</b>
          </a>
          <a className="contact-card rv" style={{ '--i': 4 }} href="https://www.linkedin.com/in/assem-badr" target="_blank" rel="noreferrer">
            <span className="label">LINKEDIN</span>
            <b>in/assem-badr</b>
          </a>
          <a className="contact-card rv" style={{ '--i': 5 }} href="https://github.com/AsemBadr01" target="_blank" rel="noreferrer">
            <span className="label">GITHUB</span>
            <b>AsemBadr01</b>
          </a>
        </div>
        <div className="ctas rv" style={{ '--i': 6 }}>
          <a className="btn solid" href="mailto:asemmosa202@gmail.com?subject=Let's%20build%20something%20together">
            Say hello →
          </a>
          <a className="btn ghost" href="/Assem_Badr_AI_Engineer_CV.pdf" download>
            Download CV ↓
          </a>
        </div>
        <p className="endnote rv" style={{ '--i': 7 }}>
          ← scroll back any time · or ask <b>Echo</b> in the corner ↘
        </p>
      </div>
    </section>
  )
}
