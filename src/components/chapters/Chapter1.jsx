export default function Chapter1({ active }) {
  return (
    <section className={`chapter c1${active ? ' active' : ''}`} data-ch="1">
      <div className="ch-inner">
        <div className="card">
          <div className="year">
            2020
            <svg className="yearcircle" viewBox="0 0 300 140" aria-hidden="true">
              <path d="M150 12 C 240 6, 292 38, 290 70 C 288 108, 222 132, 148 130 C 70 128, 10 104, 12 68 C 14 34, 76 10, 158 14" />
            </svg>
          </div>
          <div className="sub">
            A Computer Science student joins{' '}
            <span className="uline">
              Ain Shams University
              <svg viewBox="0 0 320 10" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 6 C 50 2, 90 9, 140 5 S 250 8, 318 4" />
              </svg>
            </span>
            , Cairo.
          </div>
          <p className="body">One of Egypt's largest universities. One among many. But not for long.</p>
          <p className="annot">B.Sc. Computer &amp; Information Science · 2020–2024</p>
        </div>
      </div>
    </section>
  )
}
