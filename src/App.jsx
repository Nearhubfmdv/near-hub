import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import ScrollProgress from './components/ScrollProgress.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Leadership from './components/Leadership.jsx'
import Engage from './components/Engage.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollProgress />
        <Header />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Leadership />
          <Engage />
        </main>
        <Footer />
      </MotionConfig>
    </LazyMotion>
  )
}
