import { useEffect, useRef, useState } from 'react'
import { NAV } from '../content.js'
import Logo from './Logo.jsx'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const mq = window.matchMedia('(min-width: 768px)')
    const onResize = () => mq.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onResize)
    document.body.classList.add('menu-open')
    // Keep focus inside the open menu: everything behind it is inert.
    const behind = document.querySelectorAll('main, footer, .skip-link')
    behind.forEach((el) => (el.inert = true))
    return () => {
      behind.forEach((el) => (el.inert = false))
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onResize)
      document.body.classList.remove('menu-open')
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`site-header${scrolled || open ? ' is-solid' : ''}`}>
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#top" aria-label="NEAR, back to top" onClick={close}>
          <Logo />
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="menu-toggle__bars" aria-hidden="true" />
        </button>
      </div>

      <nav
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Primary mobile"
        hidden={!open}
      >
        <ul className="container">
          {NAV.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={close}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
