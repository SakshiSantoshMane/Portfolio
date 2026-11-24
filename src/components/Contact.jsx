import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { Mail, Phone, Linkedin, MapPin, ArrowUpRight, ArrowUp, Send, Loader2, CircleCheck, RotateCcw } from 'lucide-react'
import { contact, skills, projects } from '../data'
import { Section, Reveal, CopyButton } from './ui'

function breakable(v) {
  return String(v).split(/(?<=[@/])/).flatMap((part, i) => (i ? [<wbr key={i} />, part] : [part]))
}

const ITEMS = [
  { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}`, copy: contact.email },
  { icon: Phone, label: 'Phone', value: contact.phone, href: contact.phoneHref, copy: contact.phone },
  { icon: Linkedin, label: 'LinkedIn', value: contact.linkedinLabel, href: contact.linkedin, copy: contact.linkedin, ext: true },
  { icon: MapPin, label: 'Location', value: contact.location },
]

const SKILL_COUNT = new Set(skills.map((s) => s.name)).size
const ROWS = [
  { label: 'Sections reviewed', value: 7, total: 7 },
  { label: 'Skills verified', value: SKILL_COUNT },
  { label: 'Projects delivered', value: projects.length },
  { label: 'Open bugs', value: 0 },
]

/* Final test report: numbers count up, then the stamp lands. */
function Report() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const [k, setK] = useState(reduce ? 1 : 0)
  useEffect(() => {
    if (!inView || reduce) return
    let raf, t0
    const tick = (t) => { t0 ??= t; const p = Math.min(1, (t - t0) / 1100); setK(1 - Math.pow(1 - p, 3)); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce])
  const done = k >= 1
  return (
    <div ref={ref} className="report">
      <p className="report__file">portfolio.report</p>
      {ROWS.map((r) => (
        <div key={r.label} className="report__row">
          <span>{r.label}</span>
          <b>{Math.round(r.value * k)}{r.total ? ` / ${r.total}` : ''} {done && '✓'}</b>
        </div>
      ))}
      <div className="report__row report__row--wait"><span>Next release</span><b>awaiting approval ⏳</b></div>
      <div className="report__foot">
        <span>{done ? 'Result: all checks passed' : 'Running checks…'}</span>
        <AnimatePresence>
          {done && (
            <motion.span className="stamp" initial={reduce ? false : { scale: 2.2, opacity: 0, rotate: -6 }} animate={{ scale: 1, opacity: 1, rotate: -6 }} transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.15 }}>
              READY TO CONNECT ✓
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const TYPES = ['Job opportunity', 'Project', 'Just saying hi']

/* Message box: sends straight to her inbox through Web3Forms. */
function MessageBox() {
  const [type, setType] = useState(TYPES[0])
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | sent | failed
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((x) => ({ ...x, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email so I can reply'
    if (form.message.trim().length < 5) e.message = 'Write a short message'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (ev.target.botcheck?.checked) return
    if (!validate()) return
    const subject = `${type} · message from ${form.name.trim()}`
    if (!contact.formKey) {
      // no key yet: open the visitor's email app with everything filled in
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${form.message.trim()}\n\n${form.name.trim()} · ${form.email.trim()}`)}`
      return
    }
    setState('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contact.formKey, subject, from_name: 'Sakshi Mane · Portfolio',
          name: form.name.trim(), email: form.email.trim(), type, message: form.message.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      setState(res.ok && data.success ? 'sent' : 'failed')
    } catch { setState('failed') }
  }

  const reset = () => { setForm({ name: '', email: '', message: '' }); setState('idle') }

  return (
    <div className="msg">
      <div className="msg__head"><span className="msg__tag">NEW TICKET</span><span className="msg__status">open</span></div>
      <AnimatePresence mode="wait">
        {state === 'sent' ? (
          <motion.div key="sent" className="msg__done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <CircleCheck size={40} />
            <h3>Delivered ✓</h3>
            <p>Thanks, {form.name.split(' ')[0] || 'there'}! Your message is in my inbox. I'll reply to {form.email}.</p>
            <button type="button" className="toggle" onClick={reset}><RotateCcw size={16} /> Send another</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="msg__types" role="radiogroup" aria-label="What is this about?">
              {TYPES.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={type === t} className={`msg__type${type === t ? ' is-on' : ''}`} onClick={() => setType(t)}>{t}</button>
              ))}
            </div>
            <div className="msg__row">
              <label className="msg__field"><span>Your name</span>
                <input value={form.name} onChange={set('name')} placeholder="Priya Sharma" autoComplete="name" aria-invalid={!!errors.name} />
                {errors.name && <em>{errors.name}</em>}
              </label>
              <label className="msg__field"><span>Your email</span>
                <input type="email" value={form.email} onChange={set('email')} placeholder="priya@company.com" autoComplete="email" aria-invalid={!!errors.email} />
                {errors.email && <em>{errors.email}</em>}
              </label>
            </div>
            <label className="msg__field"><span>Message</span>
              <textarea rows={4} value={form.message} onChange={set('message')} placeholder="Hi Sakshi, we're looking for a tester to join our team…" aria-invalid={!!errors.message} />
              {errors.message && <em>{errors.message}</em>}
            </label>
            <input type="checkbox" name="botcheck" className="msg__bot" tabIndex={-1} aria-hidden="true" />
            <div className="msg__foot">
              <button className="btn" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? <><Loader2 size={18} className="spin" /> Sending…</> : <><Send size={17} /> Send message</>}
              </button>
              {state === 'failed' && <p className="msg__err">Couldn't send right now. <a href={`mailto:${contact.email}`}>Email me directly</a>.</p>}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Contact() {
  return (
    <Section id="contact" label='describe("Contact")' title="Ready for the next release." intro="Every check passed. If your team needs someone who cares about quality, let's talk.">
      <Reveal><span className="open-badge"><i /> Open to new opportunities</span></Reveal>
      <div className="finale">
        <div className="finale__left">
          <Reveal><Report /></Reveal>
          <div className="clist">
            {ITEMS.map((it, i) => (
              <Reveal key={it.label} delay={i * 0.05} className="ccard">
                <span className="ccard__icon"><it.icon size={20} /></span>
                <div className="ccard__info">
                  <p className="mini-label">{it.label}</p>
                  {it.href ? <a href={it.href} target={it.ext ? '_blank' : undefined} rel={it.ext ? 'noopener' : undefined}>{breakable(it.value)}{it.ext && <ArrowUpRight size={15} />}</a> : <p>{breakable(it.value)}</p>}
                </div>
                {it.copy && <CopyButton text={it.copy} label={it.label} />}
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.1}><MessageBox /></Reveal>
      </div>
    </Section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="footer__name">Sakshi Mane</p>
        <p className="muted">Senior Analyst at Capgemini</p>
      </div>
      <p className="footer__quote">Designed with passion. Driven by curiosity. Focused on quality.</p>
      <div className="footer__end">
        <p className="muted">© 2026 Sakshi Mane. All Rights Reserved.</p>
        <motion.button className="icon-btn" type="button" whileHover={{ y: -3 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp size={18} /></motion.button>
      </div>
    </footer>
  )
}
