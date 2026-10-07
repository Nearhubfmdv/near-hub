import { useRef } from 'react'
import { m as motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

const rise = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
})

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // As About arrives, the Earth darkens and the copy recedes. Opacity only.
  const shade = useTransform(scrollYProgress, [0, 0.85], [0, reduce ? 0 : 0.7])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0])

  return (
    <section id="top" ref={ref} className="hero" aria-labelledby="hero-title">
      <motion.div
        className="hero__media"
        // Starts partly visible so the LCP image paints immediately.
        initial={{ opacity: 0.4, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <img
          src="/images/planet-1600.webp"
          srcSet="/images/planet-960.webp 960w, /images/planet-1600.webp 1600w, /images/planet-2500.webp 2500w"
          sizes="100vw"
          width="2500"
          height="1664"
          alt="Night-time view of Earth from orbit, with city lights spread across the continent."
          fetchPriority="high"
          decoding="async"
        />
      </motion.div>
      <div className="hero__overlay" aria-hidden="true" />
      <motion.div className="hero__shade" style={{ opacity: shade }} aria-hidden="true" />

      <motion.div className="container hero__content" style={{ opacity: contentOpacity }}>
        <motion.p className="eyebrow" {...rise(0.25)}>
          Nearshore deep-learning infrastructure
        </motion.p>
        <h1 id="hero-title" className="hero__title">
          <motion.span className="hero__line" {...rise(0.35)}>
            We do the deep learning&nbsp;—
          </motion.span>{' '}
          <motion.span className="hero__line" {...rise(0.5)}>
            so you don’t have to.
          </motion.span>
        </h1>
        <motion.p className="hero__lede" {...rise(0.7)}>
          NEAR is building the first nearshoring hub for deep learning in North America: the
          infrastructure to train, evaluate, and deploy high-quality AI, operated from Mexico with
          U.S.-grade compliance.
        </motion.p>
        <motion.div {...rise(0.85)}>
          <a className="button" href="#engage">
            Engage NEAR <span className="button__arrow" aria-hidden="true">→</span>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <div className="hero__meta">
          <p>Operating from Mexico · U.S.-grade compliance</p>
          <a href="#about" className="hero__scroll">
            Scroll <span aria-hidden="true">↓</span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
