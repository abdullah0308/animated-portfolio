'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgsRef    = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Images stagger up
      gsap.from('.manifesto-img', {
        yPercent: 20,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imgsRef.current,
          start: 'top 80%',
        },
      })

      // Text lines fade in
      gsap.from('.manifesto-text p', {
        opacity: 0,
        y: 36,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 82%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="manifesto" ref={sectionRef}>
      <div className="manifesto-images" ref={imgsRef}>
        <div className="manifesto-img">
          <Image src="/images/archery-aim.jpeg" alt="Atmosphere shot 1" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="manifesto-img">
          <Image src="/images/archery-aim.jpeg" alt="Atmosphere shot 2" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="manifesto-img">
          <Image src="/images/archery-aim.jpeg" alt="Atmosphere shot 3" fill style={{ objectFit: 'cover' }} />
        </div>
      </div>

      {/* Philosophy text */}
      <div className="manifesto-text" ref={textRef}>
        <p>Every problem is a shot.</p>
        <p className="dim">Deliberate.</p>
        <p className="dim">Measured.</p>
        <p>Always followed<br />by adjustment.</p>
        <p className="small dim">
          I build things to understand<br />
          how they work.<br />
          Not just to use them.
        </p>
      </div>
    </section>
  )
}
