import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// Graph paper that covers the whole page and scrolls with the content.
export default function PageGrid() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    let raf = 0, cx = -999, cy = -999
    const paint = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        ref.current?.style.setProperty('--px', `${cx}px`)
        ref.current?.style.setProperty('--py', `${cy + window.scrollY}px`)
      })
    }
    const move = (e) => { cx = e.clientX; cy = e.clientY; paint() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', paint, { passive: true })
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('scroll', paint); cancelAnimationFrame(raf) }
  }, [reduce])
  return (
    <div ref={ref} className="pagegrid" aria-hidden="true">
      <div className="pagegrid__base" />
      <div className="pagegrid__lit" />
    </div>
  )
}
