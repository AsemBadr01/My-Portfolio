const stagger = (word) =>
  word.split('').map((c, i) => (
    <span key={i} style={{ '--i': i }}>
      {c}
    </span>
  ))

// sigmoid path: x in [-6,6] → svg 320x120
const sigmoidPath = () => {
  const pts = []
  for (let i = 0; i <= 60; i++) {
    const x = -6 + (12 * i) / 60
    const y = 1 / (1 + Math.exp(-x))
    pts.push(`${(10 + (i / 60) * 300).toFixed(1)} ${(105 - y * 90).toFixed(1)}`)
  }
  return 'M ' + pts.join(' L ')
}

export default function Chapter2({ active }) {
  return (
    <section className={`chapter c2${active ? ' active' : ''}`} data-ch="2">
      <div className="ch-inner">
        <h2>2021 — First Encounter with Machine Learning</h2>
        <div className="formula">L = −Σ y · log(ŷ)</div>
        <svg className="sigmoid" viewBox="0 0 320 120" width="320" height="120" aria-hidden="true">
          <line className="axis" x1="10" y1="105" x2="310" y2="105" />
          <line className="axis" x1="160" y1="10" x2="160" y2="112" />
          <path className="curve" d={sigmoidPath()} />
        </svg>
        <div className="duo">
          <span className="w1">{stagger('PERCEPTRON')}</span>
          <span className="w2">{stagger('ADALINE')}</span>
        </div>
        <p className="body">Perceptron. Adaline. Gradient Descent. The world made mathematical sense.</p>
        <p className="note">Dry Bean Classification — Perceptron vs Adaline, binary classification.</p>
        <p className="annot">The math clicked. Everything changed.</p>
      </div>
    </section>
  )
}
