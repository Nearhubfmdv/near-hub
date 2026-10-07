import { m as motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

// Thin bar along the top edge that fills left to right with page scroll.
export default function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 })
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
      aria-hidden="true"
    />
  )
}
