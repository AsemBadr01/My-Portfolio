const GROUPS = [
  { glyph: '{ }', title: 'Programming', items: ['Python', 'C++', 'C#', 'Java', 'JavaScript', 'Scala'] },
  { glyph: 'ƒ(x)', title: 'Machine Learning', items: ['Neural Networks', 'Model Evaluation', 'Feature Selection'] },
  { glyph: '∇', title: 'Deep Learning', items: ['Transformers', 'PyTorch', 'NLP', 'Speech Recognition', 'Whisper'] },
  { glyph: '▦', title: 'Data & Tools', items: ['Pandas', 'NumPy', 'OpenCV', 'MFCC'] },
  { glyph: '☁', title: 'Cloud & Deployment', items: ['Microsoft Azure', 'WebSockets', 'Real-time Systems'] },
  { glyph: '◈', title: 'Foundations', items: ['Data Structures', 'Algorithms', 'OOP'] },
]

export default function Skills({ active }) {
  return (
    <section className={`sec s-skills${active ? ' active' : ''}`} data-sec="3">
      <div className="ghost plx" data-depth="0.25" aria-hidden="true">ƒx</div>
      <div className="ch-inner wide">
        <p className="kicker rv" style={{ '--i': 0 }}>02 · SKILLS</p>
        <h2 className="rv" style={{ '--i': 1 }}>The toolbox</h2>
        <div className="skill-grid">
          {GROUPS.map((g, i) => (
            <div key={g.title} className="skill-card rv" style={{ '--i': i + 2 }}>
              <span className="glyph" aria-hidden="true">{g.glyph}</span>
              <h3>{g.title}</h3>
              <div className="chips">
                {g.items.map((it) => (
                  <span key={it}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
