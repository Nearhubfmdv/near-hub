import { EMAIL, MAILTO } from '../content.js'
import Logo from './Logo.jsx'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <a href="#top" className="site-footer__brand" aria-label="NEAR, back to top">
          <Logo />
        </a>
        <p className="site-footer__org">NEAR AI Ventures · NearHub</p>
        <a className="site-footer__email" href={MAILTO}>
          {EMAIL}
        </a>
        <p className="site-footer__legal">© {year} NEAR AI Ventures. All rights reserved.</p>
      </div>
    </footer>
  )
}
