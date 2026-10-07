import { CAPABILITIES } from '../content.js'
import Reveal from './Reveal.jsx'
import SectionLabel from './SectionLabel.jsx'

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
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
              <SectionLabel index="01">About</SectionLabel>
              <h2 id="about-title" className="heading-lg">
                The back-office infrastructure behind AI systems.
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
                pipelines, human-in-the-loop quality controls, and model-training operations. Not
                chatbots or end-user apps.
              </p>
              <p>
                By operating from Mexico with U.S.-grade compliance, we help teams run governed AI
                workloads faster, more reliably, and at materially lower cost—while staying close to
                their end markets.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal as="div" className="capabilities">
          <h3 className="capabilities__title">What we provide</h3>
          <ol className="capabilities__list">
            {CAPABILITIES.map((c) => (
              <li key={c.n} className="capability">
                <span className="capability__n" aria-hidden="true">
                  {c.n}
                </span>
                <span className="capability__name">{c.title}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
