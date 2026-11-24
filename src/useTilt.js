import { useEffect } from 'react'

// Tiles lean toward the cursor and a soft light follows it.
// One listener for the whole page, so tiles added later (filters, tabs) work too.
const TILES = '.exp, .lab, .pcard, .edu, .award, .lang, .interests, .ccard, .card, .skill, .interest, .hero__facts li, .checklist__item, .ladder__step'
const BIG = new Set(['exp', 'lab', 'edu', 'card'])

export default function useTilt() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    let cur = null, raf = 0
    const reset = (el) => {
      el.classList.remove('is-tilt')
      el.style.transform = ''
      clearTimeout(el._tiltT)
      el._tiltT = setTimeout(() => el.classList.remove('tilt-anim'), 350)
    }
    const move = (e) => {
      const el = e.target.closest?.(TILES)
      if (el !== cur) { if (cur) reset(cur); cur = el; if (el) { clearTimeout(el._tiltT); el.classList.add('tilt-anim', 'is-tilt') } }
      if (!el) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5
        const big = BIG.has(el.classList[0]) || r.width > 600
        const max = big ? 2.2 : 7, lift = big ? -3 : -5
        el.style.transform = `perspective(900px) rotateX(${(-ny * max).toFixed(2)}deg) rotateY(${(nx * max).toFixed(2)}deg) translateY(${lift}px)`
        el.style.setProperty('--gx', `${e.clientX - r.left}px`)
        el.style.setProperty('--gy', `${e.clientY - r.top}px`)
      })
    }
    const leave = () => { if (cur) reset(cur); cur = null }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); window.removeEventListener('blur', leave); cancelAnimationFrame(raf) }
  }, [])
}
