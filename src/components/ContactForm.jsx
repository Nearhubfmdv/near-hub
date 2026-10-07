import { useEffect, useRef, useState } from 'react'
import { EMAIL, MAILTO } from '../content.js'

const ENDPOINT = (import.meta.env.VITE_CONTACT_FORM_ENDPOINT || '').trim()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { name: '', email: '', phone: '', message: '' }

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address, like name@company.com.'
  if (!v.message.trim()) e.message = 'Please tell us about your project.'
  return e
}

function Field({ id, label, required, error, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label} <span className="field__hint">{required ? '(required)' : '(optional)'}</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field__error">
          <span aria-hidden="true">!</span> {error}
        </p>
      )}
    </div>
  )
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [attempted, setAttempted] = useState(false)
  // idle | sending | success | error | unconfigured
  const [status, setStatus] = useState('idle')
  const formRef = useRef(null)
  const successRef = useRef(null)
  const prevStatus = useRef(status)
  // Bumped on every unconfigured submit so the notice is re-announced.
  const [attempts, setAttempts] = useState(0)

  // The form and the confirmation replace each other, so move focus explicitly.
  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
    else if (prevStatus.current === 'success') formRef.current?.elements.name?.focus()
    prevStatus.current = status
  }, [status])

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    if (attempted) setErrors(validate(next))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setAttempted(true)
    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current?.elements[first]?.focus()
      return
    }

    if (!ENDPOINT) {
      setAttempts((n) => n + 1)
      setStatus('unconfigured')
      return
    }

    setStatus('sending')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
        }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('success')
      setValues(EMPTY)
      setAttempted(false)
    } catch {
      setStatus('error')
    } finally {
      clearTimeout(timer)
    }
  }

  if (status === 'success') {
    return (
      <div ref={successRef} tabIndex={-1} className="form-status form-status--success" role="status">
        <h3>Thank you. Your inquiry has been sent.</h3>
        <p>
          You can also reach us directly at{' '}
          <a href={MAILTO}>{EMAIL}</a>.
        </p>
        <button type="button" className="text-button" onClick={() => setStatus('idle')}>
          Send another inquiry
        </button>
      </div>
    )
  }

  const sending = status === 'sending'
  const describe = (id) => (errors[id] ? `${id}-error` : undefined)

  return (
    <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate aria-label="Inquiry form">
      <Field id="name" label="Name" required error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={onChange}
          readOnly={sending}
          aria-invalid={!!errors.name}
          aria-describedby={describe('name')}
        />
      </Field>

      <div className="contact-form__row">
        <Field id="email" label="Email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={values.email}
            onChange={onChange}
            readOnly={sending}
            aria-invalid={!!errors.email}
            aria-describedby={describe('email')}
          />
        </Field>
        <Field id="phone" label="Phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={onChange}
            readOnly={sending}
          />
        </Field>
      </div>

      <Field id="message" label="Project details" required error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={onChange}
          readOnly={sending}
          aria-invalid={!!errors.message}
          aria-describedby={describe('message')}
        />
      </Field>

      <div className="contact-form__footer">
        <button type="submit" className="button" disabled={sending} aria-busy={sending}>
          {sending ? 'Sending…' : 'Submit inquiry'}{' '}
          {!sending && (
            <span className="button__arrow" aria-hidden="true">
              →
            </span>
          )}
        </button>

        <div className="contact-form__live">
          {status === 'error' && (
            <p className="form-status form-status--error" role="alert">
              Your inquiry could not be sent. Please try again, or email us directly at{' '}
              <a href={MAILTO}>{EMAIL}</a>.
            </p>
          )}
          {status === 'unconfigured' && (
            <p key={attempts} className="form-status form-status--notice" role="alert">
              Online inquiries are not connected yet, so this form was not sent. Please email your
              project details to <a href={MAILTO}>{EMAIL}</a>.
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
