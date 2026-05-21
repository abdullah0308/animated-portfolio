'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Target',
    body: "Understand the problem. Define what good looks like. Identify what I don't know before I touch a single line.",
  },
  {
    num: '02',
    title: 'Aim',
    body: 'Structure the approach. Research what I need. Plan before I build. A clear definition is worth more than three fast solutions.',
  },
  {
    num: '03',
    title: 'Draw',
    body: 'Build with focus. Every decision serves a purpose. No feature without a reason.',
  },
  {
    num: '04',
    title: 'Release',
    body: 'Ship, test, observe. The real feedback loop starts here. Not in the planning doc.',
  },
  {
    num: '05',
    title: 'Adjust',
    body: 'Read where it landed. Improve from what actually happened, not what was assumed. Every deviation is data.',
  },
]

const SCROLL_PER = 900

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const N     = steps.length
      const STEPS = N - 1

      const layers = gsap.utils.toArray<HTMLElement>('.process-layer')
      const ghosts = gsap.utils.toArray<HTMLElement>('.process-ghost')
      const fills  = gsap.utils.toArray<HTMLElement>('.process-ind-fill')

      // ── Initial states ────────────────────────────────────────────────
      layers.forEach((layer, i) => {
        if (i > 0) {
          gsap.set(layer.querySelectorAll('.process-slot'), { y: '110%' })
          gsap.set(layer, { autoAlpha: 0 })
        }
      })
      ghosts.forEach((g, i)  => { if (i > 0) gsap.set(g, { autoAlpha: 0 }) })
      fills.forEach((f, i)   => {
        gsap.set(f, { scaleX: i === 0 ? 1 : 0, transformOrigin: 'left center' })
      })

      // ── Entrance: first step slides in as stage scrolls into view ─────
      const firstSlots = Array.from(
        layers[0].querySelectorAll<HTMLElement>('.process-slot')
      )
      gsap.from(firstSlots, {
        y: '110%',
        duration: 1.1,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: { trigger: stageRef.current, start: 'top 65%' },
      })
      gsap.from('.process-label', {
        opacity: 0,
        y: 24,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: stageRef.current, start: 'top 75%' },
      })
      gsap.from(ghosts[0], {
        autoAlpha: 0,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: stageRef.current, start: 'top 75%' },
      })

      // ── Scrubbed timeline for transitions ─────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          pin: true,
          start: 'top top',
          end: `+=${STEPS * SCROLL_PER}`,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to({}, { duration: 0.01 }, STEPS)

      for (let i = 0; i < STEPS; i++) {
        const at        = i
        const cur       = layers[i]
        const next      = layers[i + 1]
        const curSlots  = Array.from(cur.querySelectorAll<HTMLElement>('.process-slot'))
        const nextSlots = Array.from(next.querySelectorAll<HTMLElement>('.process-slot'))

        // Slide out current text + fade ghost + shrink indicator
        tl.to(curSlots,   { y: '-110%', stagger: 0.06, duration: 0.3, ease: 'power2.in' },              at + 0.04)
        tl.to(ghosts[i],  { autoAlpha: 0, duration: 0.25 },                                             at + 0.04)
        tl.to(fills[i],   { scaleX: 0, transformOrigin: 'right center', duration: 0.25, ease: 'power2.in' }, at + 0.04)

        // Swap layers
        tl.set(cur,  { autoAlpha: 0 }, at + 0.37)
        tl.set(next, { autoAlpha: 1 }, at + 0.37)

        // Slide in next text + fade ghost + grow indicator
        tl.fromTo(nextSlots,
          { y: '110%' },
          { y: 0, stagger: 0.06, duration: 0.3, ease: 'power2.out' },
          at + 0.4,
        )
        tl.to(ghosts[i + 1], { autoAlpha: 1, duration: 0.3 },                                          at + 0.4)
        tl.fromTo(fills[i + 1],
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.3, ease: 'power2.out' },
          at + 0.4,
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="process" ref={sectionRef}>
      <div className="process-stage" ref={stageRef}>

        {/* Fixed section label */}
        <span className="process-label">The Process</span>

        {/* Giant ghost numbers — all stacked, cross-fade on transition */}
        {steps.map((step) => (
          <span key={step.num} className="process-ghost" aria-hidden="true">
            {step.num}
          </span>
        ))}

        {/* Content layers — all stacked at same position, slot-machine in/out */}
        {steps.map((step) => (
          <div key={step.num} className="process-layer">
            <div className="process-slot-wrap">
              <h2 className="process-title process-slot">{step.title}</h2>
            </div>
            <div className="process-slot-wrap">
              <p className="process-body process-slot">{step.body}</p>
            </div>
          </div>
        ))}

        {/* Step indicator — 5 thin bars at bottom-right */}
        <div className="process-indicator">
          {steps.map((_, i) => (
            <span key={i} className="process-ind-pip">
              <span className="process-ind-fill" />
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}
