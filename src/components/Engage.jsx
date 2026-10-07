import ContactForm from './ContactForm.jsx'
import Reveal from './Reveal.jsx'

export default function Engage() {
  return (
    <section className="section engage" aria-labelledby="engage-title">
      <div id="engage" className="container engage__grid anchor">
        <Reveal className="engage__intro">
          <h2 id="engage-title" className="section-title">
            Engage NEAR
          </h2>
          <p className="engage__copy">
            Tell us what you need to train, evaluate, or deploy. We’ll talk through the compute,
            data pipelines, quality controls, and training operations behind it.
          </p>
        </Reveal>

        <Reveal className="engage__form" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
