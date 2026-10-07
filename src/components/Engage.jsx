import { EMAIL, MAILTO } from '../content.js'
import ContactForm from './ContactForm.jsx'
import Reveal from './Reveal.jsx'
import SectionLabel from './SectionLabel.jsx'

export default function Engage() {
  return (
    <section id="engage" className="section engage" aria-labelledby="engage-title">
      <div className="container engage__grid">
        <Reveal className="engage__intro">
          <SectionLabel index="03">Engage NEAR</SectionLabel>
          <h2 id="engage-title" className="heading-xl">
            Let’s build closer.
          </h2>
          <p className="engage__copy">
            Tell us what you need to train, evaluate, or deploy. We’ll talk through the compute,
            data pipelines, quality controls, and training operations behind it.
          </p>
          <dl className="engage__contact">
            <div>
              <dt>Company</dt>
              <dd>NEAR AI Ventures</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={MAILTO}>{EMAIL}</a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className="engage__form" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
