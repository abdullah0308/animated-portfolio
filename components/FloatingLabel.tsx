'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AmbientOrb() {
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const orb = orbRef.current!
    gsap.set(orb, { xPercent: -50, yPercent: -50 })

    // Slow vertical drift across the full page scroll
    gsap.fromTo(orb,
      { y: '-18vh' },
      {
        y: '18vh',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      }
    )

    // Horizontal — seeks the negative space opposite content
    const moveTo = (x: string) =>
      gsap.to(orb, { x, duration: 2.4, ease: 'power2.inOut', overwrite: 'auto' })

    const triggers = [
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top center',
        onEnter:     () => moveTo('28vw'),
        onEnterBack: () => moveTo('28vw'),
      }),
      ScrollTrigger.create({
        trigger: '.process',
        start: 'top center',
        onEnter:     () => moveTo('28vw'),
        onEnterBack: () => moveTo('28vw'),
      }),
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top center',
        onEnter:     () => moveTo('28vw'),
        onEnterBack: () => moveTo('28vw'),
      }),
      ScrollTrigger.create({
        trigger: '.cl-quote',
        start: 'top center',
        onEnter:     () => moveTo('28vw'),
        onEnterBack: () => moveTo('28vw'),
      }),
      ScrollTrigger.create({
        trigger: '.cl-secondary-wrap',
        start: 'top center',
        onEnter:     () => moveTo('-28vw'),
        onEnterBack: () => moveTo('-28vw'),
      }),
      ScrollTrigger.create({
        trigger: '.cl-footer-bar',
        start: 'top center',
        onEnter:     () => moveTo('8vw'),
        onEnterBack: () => moveTo('8vw'),
      }),
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top center',
        onLeaveBack: () => moveTo('0vw'),
      }),
    ]

    return () => triggers.forEach(t => t.kill())
  }, [])

  return <div className="ambient-orb" ref={orbRef} aria-hidden="true" />
}
