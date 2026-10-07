import { DIRECTORS, FOUNDER } from '../content.js'
import Reveal from './Reveal.jsx'
import SectionLabel from './SectionLabel.jsx'

const src = (slug, w) => `/images/${slug}-${w}.webp`

export default function Leadership() {
  return (
    <section id="leadership" className="section leadership" aria-labelledby="leadership-title">
      <div className="container">
        <Reveal className="section-head">
          <SectionLabel index="02">Leadership</SectionLabel>
          <h2 id="leadership-title" className="heading-lg">
            Leadership and board of directors.
          </h2>
        </Reveal>

        <Reveal as="article" className="founder" aria-labelledby="founder-name">
          <div className="portrait founder__portrait">
            <img
              src={src(FOUNDER.slug, 960)}
              srcSet={`${src(FOUNDER.slug, 640)} 640w, ${src(FOUNDER.slug, 960)} 960w`}
              sizes="(min-width: 720px) 40vw, 100vw"
              width="960"
              height="1200"
              alt={`Portrait of ${FOUNDER.name}`}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="founder__text">
            <p className="person__role">{FOUNDER.role}</p>
            <h3 id="founder-name" className="founder__name">
              {FOUNDER.name}
            </h3>
            <p className="founder__bio">{FOUNDER.bio}</p>
          </div>
        </Reveal>

        <div className="board">
          <h3 className="board__title">Board of directors</h3>
          <ul className="board__grid">
            {DIRECTORS.map((p, i) => (
              <Reveal as="li" key={p.slug} className="person" delay={(i % 4) * 0.06}>
                <article aria-labelledby={`${p.slug}-name`}>
                  <div className="portrait person__portrait">
                    <img
                      src={src(p.slug, 640)}
                      width="640"
                      height="800"
                      alt={`Portrait of ${p.name}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="person__head">
                    <h4 id={`${p.slug}-name`} className="person__name">
                      {p.name}
                    </h4>
                    <p className="person__role">{p.role}</p>
                  </div>
                  <p className="person__bio">{p.bio}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
