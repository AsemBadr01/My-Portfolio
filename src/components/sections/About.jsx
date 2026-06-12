export default function About({ active }) {
  return (
    <section className={`sec s-about${active ? ' active' : ''}`} data-sec="2">
      <div className="ghost plx" data-depth="0.25" aria-hidden="true">عن</div>
      <div className="ch-inner duo-grid">
        <div className="photo-side rv" style={{ '--i': 0 }}>
          <div className="photo-frame">
            <img src="/assem-headshot.webp" alt="Assem Badr" width="280" height="280" loading="lazy" />
          </div>
        </div>
        <div className="text-side">
          <p className="kicker rv" style={{ '--i': 0 }}>01 · ABOUT</p>
          <h2 className="rv" style={{ '--i': 1 }}>The engineer behind the signal</h2>
          <p className="lead rv" style={{ '--i': 2 }}>
            I'm Assem Moussa Badr, an AI engineer from Cairo with hands-on experience in machine
            learning, deep learning, and speech-recognition systems. I earned my B.Sc. in Computer
            &amp; Information Science from Ain Shams University (2020–2024), graduating with a grade
            of Very Good. I specialize in fine-tuning Transformer models — most notably OpenAI's
            Whisper — and deploying real-time AI over WebSockets on Microsoft Azure. I'm passionate
            about building scalable AI that solves real problems for real people.
          </p>
          <div className="stats">
            <div className="stat rv" style={{ '--i': 3 }}>
              <b>119% → 27%</b>
              <span>WER after fine-tuning Whisper</span>
            </div>
            <div className="stat rv" style={{ '--i': 4 }}>
              <b>Grade A</b>
              <span>Graduation project — Makhraj</span>
            </div>
            <div className="stat rv" style={{ '--i': 5 }}>
              <b>End-to-end</b>
              <span>From dataset to live deployment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
