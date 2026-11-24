import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Briefcase, Mail, MapPin, Play, RotateCcw, Check, Loader2 } from 'lucide-react'
import { profile } from '../data'
import { ease } from './ui'
const TesterScene = lazy(() => import('./TesterScene'))

// Her real highlights, written as checks that "pass".
const CHECKS = [
  ['verify_degree', 'Computer Engineering graduate'],
  ['verify_employer', 'Capgemini · since Dec 2024'],
  ['verify_role', 'Automation Tester'],
  ['verify_growth', 'Analyst → Senior Analyst'],
  ['verify_award', 'Lila Poonawalla Foundation Scholar'],
]

export function ProfileRunner() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [state, setState] = useState(CHECKS.map(() => 'idle'))
  const [running, setRunning] = useState(false)
  const timers = useRef([])

  const run = () => {
    timers.current.forEach(clearTimeout); timers.current = []
    setRunning(true)
    setState(CHECKS.map(() => 'queued'))
    const step = reduce ? 0 : 420
    CHECKS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setState((s) => s.map((v, k) => (k === i ? 'running' : v))), step * i + 60))
      timers.current.push(setTimeout(() => setState((s) => s.map((v, k) => (k === i ? 'pass' : v))), step * i + (reduce ? 80 : 380)))
    })
    timers.current.push(setTimeout(() => setRunning(false), step * CHECKS.length + 400))
  }
  useEffect(() => { if (inView) run() }, [inView]) // eslint-disable-line
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const passed = state.filter((s) => s === 'pass').length
  const done = passed === CHECKS.length

  return (
    <motion.div ref={ref} className="runner" initial={reduce ? false : { opacity: 0, y: 30, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.8, ease, delay: 0.25 }}>
      <div className="runner__bar">
        <span className="runner__dots"><i /><i /><i /></span>
        <span className="runner__file">profile.spec.js</span>
        <button type="button" className="runner__btn" onClick={run} disabled={running} aria-label="Run the profile tests again">
          {running ? <Loader2 size={15} className="spin" /> : done ? <RotateCcw size={15} /> : <Play size={15} />}
          {running ? 'Running' : done ? 'Run again' : 'Run'}
        </button>
      </div>
      <p className="runner__suite">describe(<b>"Sakshi Mane"</b>)</p>
      <ul className="runner__list">
        {CHECKS.map(([fn, text], i) => (
          <li key={fn} className={`runner__row is-${state[i]}`}>
            <span className="runner__icon" aria-hidden="true">
              {state[i] === 'pass' ? <Check size={14} strokeWidth={3} /> : state[i] === 'running' ? <Loader2 size={14} className="spin" /> : null}
            </span>
            <span className="runner__fn">{fn}</span>
            <span className="runner__text">{text}</span>
            <motion.span className="runner__status" animate={{ opacity: state[i] === 'pass' ? 1 : 0, scale: state[i] === 'pass' ? 1 : 0.6 }}>PASS</motion.span>
          </li>
        ))}
      </ul>
      <div className="runner__foot">
        <div className="runner__track"><motion.div className="runner__fill" animate={{ width: `${(passed / CHECKS.length) * 100}%` }} transition={{ duration: 0.35 }} /></div>
        <p aria-live="polite"><b className="txt-pass">{passed} passed</b> · 0 failed · {CHECKS.length} total</p>
      </div>
    </motion.div>
  )
}

export default function Hero({ theme }) {
  const reduce = useReducedMotion()
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const item = (d) => ({ initial: reduce ? false : { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay: d } })
  return (
    <section className="hero" id="top">
      <div className="hero__grid">
        <div className="hero__text">
          <motion.p className="hero__status" {...item(0)}><span className="pulse" /> <b>All checks passed</b></motion.p>
          <motion.h1 {...item(0.08)}>Sakshi Mane</motion.h1>
          <motion.p className="hero__role" {...item(0.16)}>
            <span className="hero__role-main">Senior Analyst @ Capgemini</span>
            <span className="hero__role-sub">Automation &amp; Manual QA</span>
          </motion.p>
          <motion.p className="hero__lede" {...item(0.24)}>{profile.welcome}</motion.p>
          <motion.div className="hero__cta" {...item(0.32)}>
            <button className="btn" type="button" onClick={() => go('projects')}>Explore my work <ArrowRight size={18} /></button>
            <button className="btn btn--ghost" type="button" onClick={() => go('experience')}><Briefcase size={18} /> View my experience</button>
            <button className="btn btn--ghost" type="button" onClick={() => go('contact')}><Mail size={18} /> Contact me</button>
          </motion.div>
          <motion.ul className="hero__facts" {...item(0.4)}>
            <li><span className="sev sev--pass">PASS</span> Capgemini · since Dec 2024</li>
            <li><span className="sev sev--info">UP</span> Analyst → Senior Analyst</li>
            <li><MapPin size={15} /> {profile.location}</li>
          </motion.ul>
        </div>
        <motion.div className="hero__visual" initial={reduce ? false : { opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease, delay: 0.2 }}>
          <Suspense fallback={<div className="scene3d scene3d--loading" />}>
            <TesterScene dark={theme === 'dark'} />
          </Suspense>
        </motion.div>
      </div>
      <p className="hero__tagline">{profile.tagline}</p>
    </section>
  )
}
