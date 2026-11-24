import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'
import PullLamp from './PullLamp'
import { RESUME_URL } from '../data'

const LINKS = [
  ['about', 'About'], ['experience', 'Experience'], ['testing', 'Try it'], ['skills', 'Skills'],
  ['projects', 'Projects'], ['education', 'Education'], ['contact', 'Contact'],
]

export default function Nav({ theme, setTheme }) {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    LINKS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    const hero = document.getElementById('top')
    const ioTop = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive('') }, { rootMargin: '-45% 0px -50% 0px' })
    if (hero) ioTop.observe(hero)
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); ioTop.disconnect() }
  }, [])

  const go = (e, id) => { e.preventDefault(); setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <motion.div className="nav__progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="nav__inner">
        <a href="#top" className="nav__brand" onClick={(e) => go(e, 'top')} aria-label="Sakshi Mane, back to top">
          <span className="nav__logo nav__logo--photo"><img src={`${import.meta.env.BASE_URL}sakshi.jpg`} alt="Sakshi Mane" width="40" height="40" /></span>
          <span className="nav__name">Sakshi Mane</span>
        </a>
        <nav aria-label="Sections" className="nav__links">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => go(e, id)} className={active === id ? 'is-active' : ''}>
              {label}
              {active === id && <motion.span layoutId="navline" className="nav__line" />}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <PullLamp theme={theme} setTheme={setTheme} />
          {RESUME_URL && <a className="btn btn--small" href={RESUME_URL} download><Download size={16} /> Resume</a>}
          <button className="icon-btn nav__menu" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Open menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav className="nav__mobile" aria-label="Sections" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {LINKS.map(([id, label]) => <a key={id} href={`#${id}`} onClick={(e) => go(e, id)}>{label}</a>)}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
