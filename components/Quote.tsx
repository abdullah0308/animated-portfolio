'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// First quote split into lines for large-format reveal
const mainLines = [
  'Precision',
  'is not a',
  'destination.',
  "It’s a practice.",
]

export default function Quote() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lines slide up from below, one after the other
      gsap.from('.qb-line', {
        y: '105%',
        duration: 1.2,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })

      // Rule expands from left after lines land
      gsap.from('.qb-rule', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.45,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      // Secondary quote rises in after the rule
      gsap.from('.qb-secondary', {
        y: 44,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="quote-block" ref={sectionRef}>

      {/* Large-format first quote */}
      <div className="qb-main">
        {mainLines.map((line, i) => (
          <div key={i} className="qb-line-wrap">
            <span className="qb-line">{line}</span>
          </div>
        ))}
      </div>

      {/* Full-width rule */}
      <span className="qb-rule" aria-hidden="true" />

      {/* Second quote — right-aligned, serif italic, contrasting size */}
      <div className="qb-secondary-wrap">
        <p className="qb-secondary">
          You can repeat the same shot a thousand times and still find room to
          improve it. Not because you&apos;re failing. Because that&apos;s how
          mastery actually works.
        </p>
      </div>

    </section>
  )
}
