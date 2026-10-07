import { OFFER } from '../content.js'
import Reveal from './Reveal.jsx'

export default function About() {
  return (
    <section className="section about" aria-labelledby="about-title">
      <div id="about" className="container anchor">
        <div className="about__grid">
          <Reveal className="about__media">
            <img
              src="/images/screen-1179.webp"
              srcSet="/images/screen-640.webp 640w, /images/screen-1179.webp 1179w"
              sizes="(min-width: 960px) 46vw, 100vw"
              width="1179"
              height="1149"
              alt="People viewing data visualisations projected on a transparent display."
              loading="lazy"
              decoding="async"
            />
          </Reveal>

          <div className="about__text">
            <Reveal>
              <h2 id="about-title" className="section-title">
                About
              </h2>
            </Reveal>
            <Reveal className="prose" delay={0.1}>
              <p className="prose__lead">
                NEAR is building the first nearshoring hub for deep learning in North America—so
                companies can train, evaluate, and deploy high-quality AI without building massive
                in-house data-science teams.
              </p>
              <p>
                We provide the “back-office” infrastructure behind AI systems: compute, secure data
                pipelines, human-in-the-loop quality controls, and model-training operations (not
                chatbots or end-user apps).
              </p>
              <p>
                By operating from Mexico with U.S.-grade compliance, we help teams run governed AI
                workloads faster, more reliably, and at materially lower cost—while staying close to
                their end markets.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal as="section" className="offer" aria-labelledby="offer-title">
          <h2 id="offer-title" className="section-title">
            What we offer
          </h2>
          <p className="offer__text">{OFFER}</p>
        </Reveal>
      </div>
    </section>
  )
}
