'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-left > *', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      gsap.from('.about-right', {
        scale: 1.04,
        opacity: 0,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      gsap.from('.about-carve', {
        y: 30,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>
      <div className="about-left">
        <p className="about-eyebrow">Who&apos;s behind the keyboard.</p>
        <h2 className="about-headline">
          Code with<br />Intention
        </h2>
        <a
          href="https://www.linkedin.com/in/abdullah-mohamed-05426931a/"
          className="about-cta"
          target="_blank"
          rel="noopener"
        >
          Connect on LinkedIn →
        </a>
      </div>

      <div className="about-right">
        <div className="about-img">
          <Image src="/images/archery-aim.jpeg" alt="About photo placeholder" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="about-carve">
          Into<br />Precision
        </div>
      </div>
    </section>
  )
}
