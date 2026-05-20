'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-brandmark', {
        opacity: 0,
        y: 60,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
      })
      gsap.from('.footer-bio', {
        opacity: 0,
        y: 30,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: { trigger: footerRef.current, start: 'top 80%' },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer className="footer" ref={footerRef}>
      {/* MetaBox brandmark */}
      <div className="footer-brandmark">
        <svg viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.8829 39L26.1443 35.2315L30.9557 30.3838L22.1542 21.5077L30.9535 12.6381L25.8907 7.53479L17.0914 16.4066L8.28996 7.53479L3.73861 12.1247L0 8.35839L8.28996 0L17.0914 8.86959L25.8907 0L38.4307 12.6381L29.6293 21.5099L38.4286 30.3838L29.8829 39Z" fill="currentColor"/>
          <path d="M16.7021 26.8992L8.7085 34.9567L12.4463 38.7243L20.4399 30.6668L16.7021 26.8992Z" fill="currentColor"/>
          <path d="M8.02048 18.1481L0.0268555 26.2056L3.76467 29.9733L11.7583 21.9158L8.02048 18.1481Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Bio */}
      <p className="footer-bio">
        Based in Mauritius. Junior Developer at MetaBox Technology.<br />
        Building websites that work. Clean code, real performance, built to last.<br />
        I approach every project the way I approach archery:<br />
        understand the variables, release with intention, adjust from what lands.
      </p>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-copy">©2026 Abdullah Mohamed</span>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/abdullah-mohamed-05426931a/" target="_blank" rel="noopener">
            LinkedIn
          </a>
          <a href="https://metabox.mu" target="_blank" rel="noopener">
            MetaBox
          </a>
        </div>
      </div>
    </footer>
  )
}
