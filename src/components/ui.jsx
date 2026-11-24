import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export const ease = [0.22, 1, 0.36, 1]

export function Section({ id, label, title, intro, children, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <section id={id} className={`section ${className}`}>
      <motion.header
        className="section__head"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease }}
      >
        <p className="section__label"><span className="dot" />{label}</p>
        <h2>{title}</h2>
        {intro && <p className="section__intro">{intro}</p>}
      </motion.header>
      {children}
    </section>
  )
}

export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease, delay }}
    >
      {children}
    </M>
  )
}

export function PassBadge({ children = 'PASS', tone = 'pass' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function CopyButton({ text, label }) {
  const [done, setDone] = useState(false)
  async function copy() {
    try { await navigator.clipboard.writeText(text) } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      t.remove()
    }
    setDone(true); setTimeout(() => setDone(false), 1600)
  }
  return (
    <button type="button" className={`copy${done ? ' is-done' : ''}`} onClick={copy} aria-label={`Copy ${label}`}>
      {done ? <Check size={16} /> : <Copy size={16} />}
      <span aria-live="polite">{done ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
