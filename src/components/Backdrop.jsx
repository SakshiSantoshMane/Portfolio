import { motion, useScroll, useTransform } from 'framer-motion'

// Faint tester vocabulary that drifts behind the page.
const TOKENS = [
  { t: 'expect(page).toPass()', s: 'l', y: 14, d: 0 },
  { t: '✓ 200 OK', s: 'r', y: 9, d: 1.2 },
  { t: 'assert.equal()', s: 'r', y: 31, d: 2.1 },
  { t: 'BUG-102 · HIGH', s: 'l', y: 41, d: 0.6 },
  { t: '✗ 404', s: 'r', y: 52, d: 1.8 },
  { t: 'severity: medium', s: 'l', y: 63, d: 2.6 },
  { t: 'retest → PASS', s: 'r', y: 72, d: 0.3 },
  { t: 'P1 · open', s: 'l', y: 85, d: 1.5 },
  { t: 'expected === actual', s: 'r', y: 92, d: 2.3 },
]

export default function Backdrop() {
  const { scrollYProgress } = useScroll()
  const blobA = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const blobB = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const tokensY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  return (
    <div className="backdrop" aria-hidden="true">
      <motion.div className="backdrop__blob backdrop__blob--a" style={{ y: blobA }} />
      <motion.div className="backdrop__blob backdrop__blob--b" style={{ y: blobB }} />
      <div className="backdrop__blob backdrop__blob--c" />
      <motion.div className="backdrop__tokens" style={{ y: tokensY }}>
        {TOKENS.map((k) => (
          <span key={k.t} className={k.s === 'l' ? 'is-l' : 'is-r'} style={{ top: `${k.y}%`, animationDelay: `${k.d}s` }}>{k.t}</span>
        ))}
      </motion.div>
      <div className="backdrop__scan" />
    </div>
  )
}
