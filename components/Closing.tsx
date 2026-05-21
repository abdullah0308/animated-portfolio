'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const mainLines = [
  'Precision',
  'is not a',
  'destination.',
  "It's a practice.",
]

export default function Closing() {
  const sectionRef = useRef<HTMLElement>(null)
  const bodyRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Quote lines slide up
      gsap.from('.cl-line', {
        y: '105%',
        duration: 1.2,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cl-quote', start: 'top 78%' },
      })

      // Rule expands from left
      gsap.from('.cl-rule', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.45,
        scrollTrigger: { trigger: '.cl-quote', start: 'top 75%' },
      })

      // Secondary quote rises
      gsap.from('.cl-secondary', {
        y: 44,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.6,
        scrollTrigger: { trigger: '.cl-quote', start: 'top 72%' },
      })

      // All bottom-half animations fire together as the 100vh block enters
      const bodyTrigger = { trigger: bodyRef.current, start: 'top 80%' }

      gsap.from('.cl-cta-eyebrow', {
        opacity: 0, y: 24, duration: 1.0, ease: 'power3.out',
        scrollTrigger: bodyTrigger,
      })
      gsap.from('.cl-cta-text', {
        y: '105%', duration: 1.5, ease: 'power3.out', delay: 0.12,
        scrollTrigger: bodyTrigger,
      })
      gsap.from('.cl-brandmark', {
        opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', delay: 0.35,
        scrollTrigger: bodyTrigger,
      })
      gsap.from('.cl-bio', {
        opacity: 0, y: 24, duration: 1.1, ease: 'power3.out', delay: 0.5,
        scrollTrigger: bodyTrigger,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="cl-section" ref={sectionRef}>

      {/* ── Quote ── */}
      <div className="cl-quote">
        <div className="cl-main">
          {mainLines.map((line, i) => (
            <div key={i} className="cl-line-wrap">
              <span className="cl-line">{line}</span>
            </div>
          ))}
        </div>

        <span className="cl-rule" aria-hidden="true" />

        <div className="cl-secondary-wrap">
          <p className="cl-secondary">
            You can repeat the same shot a thousand times and still find room to
            improve it. Not because you&apos;re failing. Because that&apos;s how
            mastery actually works.
          </p>
        </div>
      </div>

      {/* ── CTA + Footer: 100vh block ── */}
      <div className="cl-body" ref={bodyRef}>

        <div className="cl-cta">
          <p className="cl-cta-eyebrow">Want a website?</p>
          <a
            className="cl-cta-link"
            href="https://www.metabox.mu/kickstart-your-next-project/"
            target="_blank"
            rel="noopener"
            aria-label="Kickstart your next project"
          >
            <div className="cl-cta-wrap">
              <h2 className="cl-cta-text">Get in touch.</h2>
            </div>
            <span className="cl-cta-underline" aria-hidden="true" />
          </a>
        </div>

        <div className="cl-footer-mid">
          <div className="cl-brandmark">
            <svg viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M29.8829 39L26.1443 35.2315L30.9557 30.3838L22.1542 21.5077L30.9535 12.6381L25.8907 7.53479L17.0914 16.4066L8.28996 7.53479L3.73861 12.1247L0 8.35839L8.28996 0L17.0914 8.86959L25.8907 0L38.4307 12.6381L29.6293 21.5099L38.4286 30.3838L29.8829 39Z" fill="currentColor"/>
              <path d="M16.7021 26.8992L8.7085 34.9567L12.4463 38.7243L20.4399 30.6668L16.7021 26.8992Z" fill="currentColor"/>
              <path d="M8.02048 18.1481L0.0268555 26.2056L3.76467 29.9733L11.7583 21.9158L8.02048 18.1481Z" fill="currentColor"/>
            </svg>
          </div>
          <p className="cl-bio">
            Based in Mauritius. Junior Developer at MetaBox Technology.<br />
            Building websites that work. Clean code, real performance, built to last.<br />
            I approach every project the way I approach archery:<br />
            understand the variables, release with intention, adjust from what lands.
          </p>
        </div>

        <footer className="cl-footer-bar">
          <div className="cl-bottom">
            <span className="cl-copy">©2026 Abdullah Mohamed</span>
            <div className="cl-socials">
              <a href="https://www.linkedin.com/in/abdullah-mohamed-05426931a/" target="_blank" rel="noopener">
                LinkedIn
              </a>
              <a href="https://metabox.mu" target="_blank" rel="noopener">
                MetaBox
              </a>
            </div>
          </div>
        </footer>

      </div>{/* end cl-body */}

    </section>
  )
}
