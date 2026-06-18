'use client'

import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sections = [
  { selector: '#hero',        label: 'Intro'   },
  { selector: '.statement',   label: 'Story'   },
  { selector: '#skills',       label: 'Skills'  },
  { selector: '#about',       label: 'About'   },
  { selector: '.quote-block', label: 'Quote'   },
]

export default function SectionNav() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const triggers = sections.map((s, i) =>
      ScrollTrigger.create({
        trigger: s.selector,
        start: 'top center',
        end: 'bottom center',
        onEnter:     () => setActive(i),
        onEnterBack: () => setActive(i),
      })
    )
    return () => triggers.forEach(t => t.kill())
  }, [])

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector)
    if (!el) return
    window.scrollTo({ top: (el as HTMLElement).offsetTop, behavior: 'smooth' })
  }

  return (
    <nav className="section-nav" aria-label="Page sections">
      {sections.map((s, i) => (
        <button
          key={s.selector}
          className={`snav-item${active === i ? ' active' : ''}`}
          onClick={() => scrollTo(s.selector)}
          aria-label={`Go to ${s.label}`}
        >
          <span className="snav-label">{s.label}</span>
          <span className="snav-dot" />
        </button>
      ))}
    </nav>
  )
}
