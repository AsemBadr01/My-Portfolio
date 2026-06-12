const STEPS = [
  {
    year: '2020',
    title: 'The beginning',
    text: 'Enrolled in Computer & Information Science at Ain Shams University, Cairo.',
  },
  {
    year: '2021–22',
    title: 'The math clicked',
    text: 'First classifiers — Perceptron vs Adaline — then deeper: PyTorch, Transformers, attention.',
  },
  {
    year: '2023–24',
    title: 'Makhraj',
    text: 'Built and fine-tuned Whisper end-to-end: preprocessing pipelines, model evaluation, real-time WebSockets, deployed on Azure. Graduation project — Grade A.',
  },
  {
    year: '2024',
    title: 'Graduated',
    text: 'B.Sc. Computer & Information Science — grade: Very Good.',
  },
  {
    year: '2026',
    title: 'GridNox.ai',
    text: 'The next chapter begins in July 2026.',
    next: true,
  },
]

export default function Journey({ active }) {
  return (
    <section className={`sec s-journey${active ? ' active' : ''}`} data-sec="5">
      <div className="ghost plx" data-depth="0.25" aria-hidden="true">→</div>
      <div className="ch-inner duo-grid">
        <div className="text-side">
          <p className="kicker rv" style={{ '--i': 0 }}>04 · EXPERIENCE</p>
          <h2 className="rv" style={{ '--i': 1 }}>Four years,<br />one trajectory</h2>
          <p className="lead rv" style={{ '--i': 2 }}>
            From a freshman who liked computers to an engineer who ships real-time AI systems —
            training, evaluating, and deploying Transformer models from end to end.
          </p>
        </div>
        <ol className="tl">
          {STEPS.map((s, i) => (
            <li key={s.year} className={`tl-item rv${s.next ? ' next' : ''}`} style={{ '--i': i + 2 }}>
              <span className="dot" aria-hidden="true" />
              <span className="year">{s.year}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
