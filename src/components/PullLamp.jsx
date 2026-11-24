import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// A bulb hanging from the menu bar. Pull the cord down to switch the theme.
// Light mode = bulb on. Switching on flickers like an old tube light;
// switching off leaves a warm orange glow that cools down.
const NEED = 34      // how far (px) the cord must be pulled
const MAX = 64

export default function PullLamp({ theme, setTheme }) {
  const reduce = useReducedMotion()
  const on = theme === 'light'
  const [pull, setPull] = useState(0)
  const [lit, setLit] = useState(on)          // what the bulb shows (can flicker)
  const [warm, setWarm] = useState(false)
  const [swing, setSwing] = useState(0)
  const [hint, setHint] = useState(() => { try { return !localStorage.getItem('sm-pulled') } catch { return true } })
  const [nudge, setNudge] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const drag = useRef(null)
  const timers = useRef([])
  const raf = useRef(0)

  useEffect(() => { if (!timers.current.length) setLit(on) }, [on])
  // the "Pull me" label only shows on the first screen
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 120)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => () => { timers.current.forEach(clearTimeout); cancelAnimationFrame(raf.current) }, [])

  const later = (fn, ms) => { const t = setTimeout(() => { timers.current = timers.current.filter((x) => x !== t); fn() }, ms); timers.current.push(t) }

  const springBack = (from) => {
    cancelAnimationFrame(raf.current)
    if (reduce) { setPull(0); return }
    let p = from, v = 0
    const step = () => {
      v += -p * 0.25; v *= 0.72; p += v
      setPull(p)
      if (Math.abs(p) > 0.3 || Math.abs(v) > 0.3) raf.current = requestAnimationFrame(step)
      else setPull(0)
    }
    raf.current = requestAnimationFrame(step)
  }

  const toggle = () => {
    try { localStorage.setItem('sm-pulled', '1') } catch { /* ignore */ }
    setHint(false)
    setSwing((s) => s + 1)
    if (!on) {
      if (reduce) { setLit(true); setTheme('light'); return }
      // flicker like a tube light, then settle on
      const seq = [[1, 0], [0, 80], [1, 150], [0, 230], [0, 300], [1, 380]]
      seq.forEach(([v, t]) => later(() => setLit(!!v), t))
      later(() => setTheme('light'), 420)
    } else {
      setLit(false); setTheme('dark')
      if (!reduce) { setWarm(true); later(() => setWarm(false), 900) }
    }
  }

  const onDown = (e) => {
    cancelAnimationFrame(raf.current)
    drag.current = { y: e.clientY, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e) => {
    if (!drag.current) return
    const p = Math.max(0, Math.min(MAX, e.clientY - drag.current.y))
    if (p > 3) drag.current.moved = true
    setPull(p)
  }
  const onUp = () => {
    if (!drag.current) return
    const moved = drag.current.moved
    drag.current = null
    if (pull >= NEED) toggle()
    else if (!moved) { setNudge(true); later(() => setNudge(false), 1600) }
    springBack(pull)
  }
  // keyboard: Enter or Space plays a full pull
  const onKey = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    setPull(NEED + 6); later(() => springBack(NEED + 6), 120); toggle()
  }

  const showTip = nudge || (hint && atTop)
  return (
    <div className={`lamp${lit ? ' is-lit' : ''}${warm ? ' is-warm' : ''}`}>
      <div className="lamp__rig" key={swing} data-swing={swing > 0 && !reduce ? '' : undefined}>
        <span className="lamp__wire" />
        <span className="lamp__cap" />
        <span className="lamp__glass"><span className="lamp__filament" /></span>
      </div>
      <span className="lamp__cord" style={{ height: 26 + pull }} />
      <button
        type="button"
        className="lamp__knob"
        style={{ transform: `translateY(${pull}px)` }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onKeyDown={onKey}
        aria-label={on ? 'Pull the cord to switch to dark mode' : 'Pull the cord to switch to light mode'}
      />
      {(hint || nudge) && <span className={`lamp__tip${showTip ? '' : ' is-hidden'}`} aria-hidden={!showTip} style={{ transform: `translateY(${pull}px)` }}>{nudge ? 'Pull down ↓' : 'Pull me'}</span>}
    </div>
  )
}
