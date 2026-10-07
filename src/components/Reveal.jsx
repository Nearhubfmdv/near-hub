import { m as motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

// Gentle one-time fade/rise as content enters the viewport.
// With reduced motion, only the fade remains.
export default function Reveal({ as = 'div', delay = 0, y = 18, children, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
