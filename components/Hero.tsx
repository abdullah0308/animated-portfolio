'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

function getAge(): number {
  const now = new Date()
  let age = now.getFullYear() - 2003
  if (now < new Date(now.getFullYear(), 7, 3)) age--
  return age
}

export default function Hero() {
  const heroRef      = useRef<HTMLElement>(null)
  const cardRef      = useRef<HTMLDivElement>(null)
  const cardInnerRef = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const scrollRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current!
    const hero = heroRef.current!
    const bg   = hero.querySelector<HTMLElement>('.hero-bg')!

    // GSAP owns the transform — same visual as CSS translate(-50%,-50%)
    gsap.set(card, { xPercent: -50, yPercent: -50 })
    gsap.set(bg, { scale: 1.12 })

    const startEntry = () => {
      gsap.to(bg, { scale: 1, duration: 1.7, ease: 'power2.out' })
      gsap.to(card, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.1,
        ease: 'power4.inOut',
        delay: 0.75,
      })
      const lines = titleRef.current!.querySelectorAll<HTMLSpanElement>('.line span')
      gsap.from(lines, {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 1.35,
      })
      gsap.from(scrollRef.current, {
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 1.9,
      })
    }

    if ((window as any).__preloaderDone) {
      startEntry()
    } else {
      window.addEventListener('preloader:done', startEntry, { once: true })
    }

    // ── Scroll expansion ─────────────────────────────────────────────────
    const ctx = gsap.context(() => {
      const EXPAND = 650  // scroll distance until card fills screen
      const FADE   = 380  // scroll distance to fade text after full screen

      // Scroll label fades as soon as expansion starts
      gsap.to(scrollRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=220',
          scrub: true,
        },
      })

      // Timeline: card expands → then inner text fades
      // Single pin covers both phases so the hero stays locked the whole time
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: `+=${EXPAND + FADE}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Phase 1: card grows from card-size → full screen
      tl.to(card, {
        width: '100vw',
        height: '100vh',
        ease: 'none',
        duration: EXPAND,
      }, 0)

      // Phase 2: card is full screen — erase content with a clip-path wipe (no movement)
      tl.fromTo(
        cardInnerRef.current,
        { clipPath: 'inset(0% 0 0% 0)' },
        { clipPath: 'inset(100% 0 0% 0)', ease: 'power1.in', duration: FADE },
        EXPAND,
      )
    }, hero)

    return () => {
      ctx.revert()
      window.removeEventListener('preloader:done', startEntry)
    }
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      {/* Full-bleed background photo */}
      <div className="hero-bg">
        <Image
          src="/images/Hero Banner.png"
          alt="Hero background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Black card — clips in on load, expands to full screen on scroll */}
      <div className="hero-card" ref={cardRef}>
        <div className="hero-card-inner" ref={cardInnerRef}>
          <p className="hero-card-label">Junior Developer</p>

          <h1 className="hero-card-title" ref={titleRef}
              data-crv data-crv-text={"Always\nCalibrating"}>
            <span className="line"><span>Always</span></span>
            <span className="line"><span>Calibrating</span></span>
          </h1>

          <div className="hero-card-bottom">
            <p className="hero-card-portfolio">Portfolio</p>
            <div className="hero-card-year">&apos;{getAge()}</div>
          </div>
        </div>
      </div>

      <div className="hero-scroll" ref={scrollRef}>Scroll Down</div>
    </section>
  )
}
