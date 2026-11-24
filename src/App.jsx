import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Nav from './components/Nav'
import Backdrop from './components/Backdrop'
import PageGrid from './components/PageGrid'
import useTilt from './useTilt'
import Hero from './components/Hero'
import { About, Experience, Testing, Skills, Projects, Education, Beyond } from './components/Sections'
import { Contact, Footer } from './components/Contact'

function initialTheme() {
  try { const t = localStorage.getItem('sm-theme'); if (t) return t } catch { /* ignore */ }
  return 'dark'
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme)
  useTilt()
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('sm-theme', theme) } catch { /* ignore */ }
  }, [theme])
  return (
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <PageGrid />
      <a className="skip" href="#about">Skip to content</a>
      <Nav theme={theme} setTheme={setTheme} />
      <main>
        <Hero theme={theme} />
        <About />
        <Experience />
        <Testing />
        <Skills />
        <Projects />
        <Education />
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
