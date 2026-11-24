import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Check, ChevronDown, Building2, MapPin, CalendarDays, ArrowUpRight, X, Smartphone, Globe, Award,
  GraduationCap, Sprout, Plane, Clapperboard, Languages, Bug, Play, RotateCcw, Loader2, CircleCheck, Search, Bot, Eye, MousePointerClick,
} from 'lucide-react'
import { about, highlights, experience, skills, skillCats, catLabel, projects, education, scholarship, languages, interests } from '../data'
import { Section, Reveal, PassBadge, ease } from './ui'

/* ---------------- About ---------------- */
export function About() {
  return (
    <Section id="about" label='describe("About me")' title="Quality is a habit, not a phase.">
      <div className="about">
        <Reveal className="about__text">{about.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</Reveal>
        <ul className="checklist">
          {highlights.map((h, i) => (
            <Reveal as="li" key={h} delay={i * 0.06} className="checklist__item">
              <motion.span className="checklist__box" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 + i * 0.08 }}>
                <Check size={14} strokeWidth={3} />
              </motion.span>
              {h}
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}

/* ---------------- Experience ---------------- */
function CompanyLogo() {
  const [hasImg, setHasImg] = useState(Boolean(experience.logo))
  const reduce = useReducedMotion()
  const v = reduce ? {} : { initial: 'off', whileInView: 'on', viewport: { once: true, amount: 0.6 } }
  return (
    <motion.span className="exp__logo exp__logo--live" {...v} whileHover={{ scale: 1.06, rotate: -2 }}>
      <motion.svg className="exp__ring" viewBox="0 0 100 100" aria-hidden="true">
        <motion.circle cx="50" cy="50" r="46" variants={{ off: { pathLength: 0 }, on: { pathLength: 1, transition: { duration: 1.1, ease } } }} />
      </motion.svg>
      {!reduce && <span className="exp__scan" aria-hidden="true" />}
      <motion.span className="exp__mark" variants={{ off: { scale: 0.4, opacity: 0, rotate: -25 }, on: { scale: 1, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 16, delay: 0.35 } } }}>
        {hasImg
          ? <img src={experience.logo} alt="Capgemini" onError={() => setHasImg(false)} />
          : <Building2 size={28} aria-label="Capgemini" />}
      </motion.span>
      <motion.span className="exp__tick" aria-hidden="true" variants={{ off: { scale: 0 }, on: { scale: 1, transition: { type: 'spring', stiffness: 420, damping: 14, delay: 1.1 } } }}>✓</motion.span>
    </motion.span>
  )
}

export function Experience() {
  const [sel, setSel] = useState('senior')
  const [open, setOpen] = useState(false)
  const step = experience.steps.find((s) => s.id === sel)
  return (
    <Section id="experience" label='describe("Experience")' title="Where I work today.">
      <Reveal className="exp">
        <div className="exp__head">
          <CompanyLogo />
          <div>
            <h3>{experience.company}</h3>
            <p className="exp__role">{experience.role} · <span>Senior Analyst</span></p>
          </div>
          <PassBadge tone="info">Active</PassBadge>
        </div>
        <p className="exp__meta"><span><CalendarDays size={16} /> {experience.period}</span><span><MapPin size={16} /> {experience.place}</span></p>
        <p className="exp__overview">{experience.overview}</p>

        <p className="mini-label">Career progression · click a step</p>
        <div className="ladder" role="tablist" aria-label="Career progression">
          {experience.steps.map((s, i) => (
            <button key={s.id} role="tab" aria-selected={sel === s.id} className={`ladder__step${sel === s.id ? ' is-on' : ''}`} onClick={() => setSel(s.id)}>
              <span className="ladder__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="ladder__title">{s.title}</span>
              <span className="ladder__sub">{s.sub}</span>
              {sel === s.id && <motion.span layoutId="ladderbg" className="ladder__bg" transition={{ duration: 0.35, ease }} />}
            </button>
          ))}
          <span className="ladder__arrow" aria-hidden="true">→</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={sel} className="ladder__detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <PassBadge>{step.when}</PassBadge><p>{step.text}</p>
          </motion.div>
        </AnimatePresence>

        <button className="toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? 'Hide responsibilities' : 'Show responsibilities'} <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ display: 'grid' }}><ChevronDown size={18} /></motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ol className="steps" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}>
              {experience.duties.map((d, i) => (
                <motion.li key={d} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <span className="steps__n">Step {i + 1}</span><span>{d}</span>
                  <motion.span className="steps__ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 + 0.05 * i, type: 'spring', stiffness: 400 }}><Check size={14} strokeWidth={3} /></motion.span>
                </motion.li>
              ))}
            </motion.ol>
          )}
        </AnimatePresence>
      </Reveal>
    </Section>
  )
}

/* ---------------- Testing (interactive demos) ---------------- */
/* The same sample login page is used in both demos, so the difference is easy to see. */
function MockLogin({ scan, fixed, found, auto, onPart, onBug }) {
  const cls = (k) => (scan === k ? ' is-scan' : '')
  return (
    <div className={`mock${auto ? ' mock--auto' : ''}${found ? ' is-found' : ''}${scan === 'page' ? ' is-scan-page' : ''}`}>
      <div className="mock__bar"><i /><i /><i /><span>shop.example.com/login</span></div>
      <div className="mock__body">
        <p className="mock__title" onClick={() => onPart?.('The heading')}>Welcome back</p>
        <label className={`mock__field${cls('email')}`} onClick={() => onPart?.('The email box')}><span>Email</span><input readOnly value="sakshi@example.com" tabIndex={-1} /></label>
        <label className={`mock__field${cls('password')}`} onClick={() => onPart?.('The password box')}><span>Password</span><input readOnly type="password" value="secret123" tabIndex={-1} /></label>
        <button type="button" tabIndex={auto ? -1 : 0} className={`mock__btn${cls('button')}${found && !fixed ? ' is-bug' : ''}`} onClick={() => onBug?.()} aria-label={auto ? undefined : 'Sign in button on the sample page'}>
          {fixed ? 'Sign in' : 'Sigm in'}
          {found && !fixed && <motion.span className="mock__bugpin" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }}><Bug size={16} /></motion.span>}
        </button>
        <p className="mock__link" onClick={() => onPart?.('The link')}>Forgot password?</p>
      </div>
    </div>
  )
}

const STEPS = [
  { key: 'page', text: 'Open the login page', ms: '0.4s' },
  { key: 'email', text: 'Type an email', ms: '0.2s' },
  { key: 'password', text: 'Type a password', ms: '0.2s' },
  { key: 'button', text: 'Press the button. Did it log in?', ms: '0.6s' },
]

function AutomationDemo() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(-1)          // current step, -1 = not started, STEPS.length = done
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const run = () => {
    timers.current.forEach(clearTimeout); timers.current = []
    const d = reduce ? 0 : 650
    STEPS.forEach((_, k) => timers.current.push(setTimeout(() => setI(k), d * k)))
    timers.current.push(setTimeout(() => setI(STEPS.length), d * STEPS.length))
  }
  const running = i >= 0 && i < STEPS.length
  const done = i === STEPS.length
  return (
    <Reveal className="lab">
      <div className="lab__head"><span className="lab__icon lab__icon--auto"><Bot size={22} /></span>
        <div><h3>Automation Testing</h3><p>A computer program tests the website. You write the steps once, and it repeats them in seconds, every time.</p></div></div>
      <MockLogin auto scan={running ? STEPS[i].key : null} />
      <ol className="asteps">
        {STEPS.map((st, k) => {
          const state = i > k || done ? 'pass' : i === k ? 'run' : 'wait'
          return (
            <li key={st.key} className={`astep is-${state}`}>
              <span className="astep__dot">{state === 'pass' ? <Check size={13} /> : state === 'run' ? <Loader2 size={13} className="spin" /> : k + 1}</span>
              <span className="astep__text">{st.text}</span>
              <span className="astep__ms">{state === 'pass' ? st.ms : ''}</span>
            </li>
          )
        })}
      </ol>
      <div className="lab__foot">
        <button type="button" className="btn btn--small" onClick={run} disabled={running}>
          {running ? <><Loader2 size={16} className="spin" /> Script running</> : done ? <><RotateCcw size={16} /> Run it again</> : <><Play size={16} /> Let the script test it</>}
        </button>
      </div>
      <AnimatePresence>
        {done && (
          <motion.div className="verdict verdict--pass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <b>4 of 4 checks passed in 1.4 seconds.</b> No person needed.
            <span>But a script only checks what it's told to. It didn't notice the spelling mistake on the button. Can you find it? →</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  )
}

function BugHunt() {
  const [found, setFound] = useState(false)
  const [fixed, setFixed] = useState(false)
  const [hint, setHint] = useState('')
  const ok = (what) => { if (!found) { setHint(`${what} looks fine`); setTimeout(() => setHint(''), 1300) } }
  const reset = () => { setFound(false); setFixed(false); setHint('') }
  return (
    <Reveal className="lab" delay={0.1}>
      <div className="lab__head"><span className="lab__icon lab__icon--bug"><Eye size={22} /></span>
        <div><h3>Manual Testing</h3><p>A person uses the website like a real visitor and notices anything that looks or feels wrong.</p></div></div>
      <div className="mock-wrap">
        <MockLogin found={found} fixed={fixed} onPart={ok} onBug={() => !found && setFound(true)} />
        <AnimatePresence>{hint && <motion.p className="mock__hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{hint}</motion.p>}</AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        {found ? (
          <motion.div key={fixed ? 'fixed' : 'open'} className={`ticket${fixed ? ' is-fixed' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="ticket__row"><b>{fixed ? 'Fixed' : 'You found it'}</b><span className={`badge ${fixed ? 'badge--pass' : 'badge--fail'}`}>{fixed ? 'PASS' : 'BUG'}</span></div>
            <p>{fixed ? 'The button now reads "Sign in". A tester checks it again before closing the bug.' : 'The button says "Sigm in" instead of "Sign in". The script missed it because the button still worked. You spotted it by looking.'}</p>
            {fixed ? <button className="toggle" type="button" onClick={reset}><RotateCcw size={16} /> Try again</button>
              : <button className="btn btn--small" type="button" onClick={() => setFixed(true)}><CircleCheck size={16} /> Fix it and check again</button>}
          </motion.div>
        ) : <motion.p key="tip" className="lab__task" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><MousePointerClick size={16} /> Your turn: one thing on this page is wrong. Click it.</motion.p>}
      </AnimatePresence>
    </Reveal>
  )
}

const COMPARE = [
  { icon: Bot, title: 'Automation is best for', items: ['Speed: hundreds of checks in minutes', 'Repeating the same checks after every change', 'Making sure things still work'] },
  { icon: Eye, title: 'Manual is best for', items: ['Spelling, colours and layout', 'Whether it is easy to use', 'New features and surprises'] },
]

export function Testing() {
  return (
    <Section id="testing" label='describe("Try it")' title="Two ways to test a website." intro="Automation uses a script. Manual uses a person. Try both on the same login page.">
      <div className="labs"><AutomationDemo /><BugHunt /></div>
      <div className="compare">
        {COMPARE.map(({ icon: I, title, items }) => (
          <Reveal key={title} className="compare__col">
            <h4><I size={18} /> {title}</h4>
            <ul>{items.map((t) => <li key={t}><Check size={15} /> {t}</li>)}</ul>
          </Reveal>
        ))}
      </div>
      <p className="compare__note">Good testers use both. Sample page for this demo, not from a real project.</p>
    </Section>
  )
}

/* ---------------- Skills ---------------- */
export function Skills() {
  const [cat, setCat] = useState('All')
  const list = skills.filter((s) => cat === 'All' || s.cat === cat).filter((s, i, a) => cat !== 'All' || a.findIndex((x) => x.name === s.name) === i)
  const count = (c) => (c === 'All' ? new Set(skills.map((s) => s.name)).size : skills.filter((s) => s.cat === c).length)
  return (
    <Section id="skills" label='describe("Skills")' title="My toolkit." intro="Filter by category.">
      <Reveal className="filters" >
        <div role="tablist" aria-label="Skill categories" className="filters__row">
          {skillCats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={`chip${cat === c ? ' is-on' : ''}`} onClick={() => setCat(c)}>
              {cat === c && <motion.span layoutId="chipbg" className="chip__bg" transition={{ duration: 0.3, ease }} />}
              <span className="chip__label">{catLabel[c] || c}</span><span className="chip__count">{count(c)}</span>
            </button>
          ))}
        </div>
      </Reveal>
      <motion.ul layout className="skills">
        <AnimatePresence mode="popLayout">
          {list.map((s) => (
            <motion.li layout key={s.key || s.name} className={`skill skill--${s.cat.toLowerCase()}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.25 }}>
              <span className="skill__ok"><Check size={13} strokeWidth={3} /></span>{s.name}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Section>
  )
}

/* ---------------- Projects ---------------- */
function ProjectModal({ p, onClose }) {
  const [tab, setTab] = useState('Overview')
  const closeRef = useRef(onClose); closeRef.current = onClose
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') closeRef.current() }
    window.addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [])
  return (
    <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: .2 } }} onClick={onClose}>
      <motion.div className="modal__card" role="dialog" aria-modal="true" aria-labelledby="pm-title" initial={{ opacity: 0, y: 30, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .97 }} transition={{ duration: .3, ease }} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal__close" type="button" onClick={onClose} aria-label="Close" autoFocus><X size={20} /></button>
        <p className="ticket-id">{p.id} · {p.type} · {p.year}</p>
        <h3 id="pm-title">{p.name}</h3>
        <div className="tabs" role="tablist">
          {['Overview', 'Features', 'Technologies'].map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={`tabs__btn${tab === t ? ' is-on' : ''}`} onClick={() => setTab(t)}>
              {t}{tab === t && <motion.span className="tabs__line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.25, ease }} />}
            </button>
          ))}
        </div>
        <motion.div key={tab} className="tabs__panel" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            {tab === 'Overview' && (<>
              <h4>Overview</h4><p>{p.overview}</p>
              <h4>Problem it addresses</h4><p>{p.problem}</p>
              {p.result && <p className="result"><CircleCheck size={18} /> {p.result}</p>}
              <h4>My contribution</h4><ul className="contrib">{p.contribution.map((c) => <li key={c}><Check size={15} /> {c}</li>)}</ul>
            </>)}
            {tab === 'Features' && <ul className="feat">{p.features.map((f, i) => <motion.li key={f} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}><Check size={16} strokeWidth={3} /> {f}</motion.li>)}</ul>}
            {tab === 'Technologies' && <div className="tech">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>}
          </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function Projects() {
  const [open, setOpen] = useState(null)
  const sel = projects.find((p) => p.id === open)
  return (
    <Section id="projects" label='describe("Projects")' title="Things I've built." intro="Click a project to open its full details.">
      <div className="projects">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1}>
            <motion.button type="button" className="pcard" onClick={() => setOpen(p.id)}>
              <div className="pcard__top">
                <span className="pcard__icon">{p.type.startsWith('Android') ? <Smartphone size={22} /> : <Globe size={22} />}</span>
                <span className="ticket-id">{p.id}</span>
                <PassBadge>Completed</PassBadge>
              </div>
              <h3>{p.name}</h3>
              <p className="pcard__type">{p.type} · {p.year}</p>
              <p className="pcard__sum">{p.summary}</p>
              {p.result && <p className="result"><CircleCheck size={17} /> {p.result}</p>}
              <div className="tech">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
              <span className="pcard__open">Open details <ArrowUpRight size={17} /></span>
            </motion.button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>{sel && <ProjectModal key={sel.id} p={sel} onClose={() => setOpen(null)} />}</AnimatePresence>
    </Section>
  )
}

/* ---------------- Education ---------------- */
export function Education() {
  const [sel, setSel] = useState('be')
  const e = education.find((x) => x.id === sel)
  return (
    <Section id="education" label='describe("Education")' title="Where I learned.">
      <Reveal className="edu">
        <div className="tabs tabs--big" role="tablist" aria-label="Education">
          {education.map((x) => (
            <button key={x.id} role="tab" aria-selected={sel === x.id} className={`tabs__btn${sel === x.id ? ' is-on' : ''}`} onClick={() => setSel(x.id)}>
              {x.short}<span className="tabs__yr">{x.years}</span>{sel === x.id && <motion.span layoutId="eduline" className="tabs__line" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={sel} className="edu__panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <span className="edu__icon"><GraduationCap size={30} /></span>
            <div className="edu__info">
              <h3>{e.title}</h3>
              <p>{e.school}</p>
              <p className="muted">{e.years}</p>
            </div>
            <div className="edu__score">
              {e.score ? (<>
                <p className="edu__num">{e.score}%</p>
                <div className="runner__track"><motion.div className="runner__fill" initial={{ width: 0 }} animate={{ width: `${e.score}%` }} transition={{ duration: 0.9, ease }} /></div>
                <PassBadge>Passed</PassBadge>
              </>) : <><p className="edu__num edu__num--done">Completed</p><PassBadge>Graduated 2024</PassBadge></>}
            </div>
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </Section>
  )
}

/* ---------------- Achievements, languages, interests ---------------- */
const INTEREST_ICON = { Gardening: Sprout, Travelling: Plane, 'Watching Movies': Clapperboard }
export function Beyond() {
  return (
    <Section id="achievements" label='describe("Achievements")' title="Recognition and more.">
      <div className="beyond">
        <Reveal className="award">
          <motion.span className="award__icon" whileHover={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 0.5 }}><Award size={34} /></motion.span>
          <div>
            <p className="ticket-id">Scholarship · {scholarship.year}</p>
            <h3>{scholarship.title}</h3>
            <p>{scholarship.text}</p>
          </div>
          <PassBadge>Awarded</PassBadge>
        </Reveal>
        <Reveal className="lang" delay={0.08}>
          <h3><Languages size={20} /> Languages</h3>
          {languages.map((l, i) => (
            <div key={l.name} className="lang__row">
              <span className="lang__name">{l.name}</span>
              <span className="lang__dots">{[1, 2, 3].map((n) => <motion.i key={n} className={n <= l.value ? 'on' : ''} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 + n * 0.08, type: 'spring' }} />)}</span>
              <span className="lang__lvl">{l.level}</span>
            </div>
          ))}
        </Reveal>
        <Reveal className="interests" delay={0.14}>
          <h3>Interests</h3>
          <div className="interests__row">
            {interests.map((x) => { const I = INTEREST_ICON[x]; return (
              <motion.span key={x} className="interest" whileTap={{ scale: 0.95 }}><I size={20} /> {x}</motion.span>
            ) })}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
