'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    num: '01',
    title: 'E-Commerce Platform',
    stack: 'WordPress · WooCommerce',
    type: 'E-Commerce',
    img: '/images/E-Commerce Website.png',
  },
  {
    num: '02',
    title: 'Corporate Website',
    stack: 'Next.js · Payload CMS',
    type: 'Corporate',
    img: '/images/Corporate Website.png',
  },
  {
    num: '03',
    title: 'Archery Club Web App',
    stack: 'Next.js · TypeScript · PostgreSQL',
    type: 'Web App',
    img: '/images/Archery Web App.png',
  },
  {
    num: '04',
    title: 'Multilingual Websites',
    stack: 'WordPress · WPML',
    type: 'Multilingual',
    img: '/images/Multilingual Websites.png',
  },
]

const SCROLL_PER = 800

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const N     = projects.length
      const STEPS = N - 1

      const infoLayers = gsap.utils.toArray<HTMLElement>('.work-layer')
      const imgLayers  = gsap.utils.toArray<HTMLElement>('.work-img-layer')
      const ghosts     = gsap.utils.toArray<HTMLElement>('.work-ghost')

      // Set initial states — only first layer visible
      infoLayers.forEach((layer, i) => {
        if (i > 0) {
          gsap.set(layer.querySelectorAll('.work-slot'), { y: '110%' })
          gsap.set(layer, { autoAlpha: 0 })
        }
      })
      imgLayers.forEach((layer, i) => {
        gsap.set(layer, i === 0
          ? { clipPath: 'inset(0 0% 0 0)', autoAlpha: 1 }
          : { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 }
        )
      })
      ghosts.forEach((g, i) => { if (i > 0) gsap.set(g, { autoAlpha: 0 }) })

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

      // Anchor timeline to exactly STEPS units long
      tl.to({}, { duration: 0.01 }, STEPS)

      for (let i = 0; i < STEPS; i++) {
        const at       = i
        const cur      = infoLayers[i]
        const next     = infoLayers[i + 1]
        const curImg   = imgLayers[i]
        const nextImg  = imgLayers[i + 1]
        const curSlots  = Array.from(cur.querySelectorAll<HTMLElement>('.work-slot'))
        const nextSlots = Array.from(next.querySelectorAll<HTMLElement>('.work-slot'))

        // Slide current text up and fade ghost out
        tl.to(curSlots,    { y: '-110%', stagger: 0.05, duration: 0.28, ease: 'power2.in' }, at + 0.04)
        tl.to(ghosts[i],   { autoAlpha: 0, duration: 0.22 }, at + 0.04)

        // Swap layers
        tl.set(cur,  { autoAlpha: 0 }, at + 0.35)
        tl.set(next, { autoAlpha: 1 }, at + 0.35)

        // Slide next text in from below and fade ghost in
        tl.fromTo(nextSlots,
          { y: '110%' },
          { y: 0, stagger: 0.05, duration: 0.28, ease: 'power2.out' },
          at + 0.38,
        )
        tl.to(ghosts[i + 1], { autoAlpha: 1, duration: 0.22 }, at + 0.4)

        // Image: fade out current, wipe in next from right
        tl.to(curImg, { autoAlpha: 0, duration: 0.28, ease: 'power1.out' }, at + 0.04)
        tl.fromTo(nextImg,
          { clipPath: 'inset(0 100% 0 0)', autoAlpha: 1 },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'power2.inOut' },
          at + 0.3,
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={sectionRef}>
      <div className="work-stage" ref={stageRef}>

        {/* Left — info column */}
        <div className="work-info-col">
          {projects.map((p, i) => (
            <div key={p.num} className="work-layer">
              <span className="work-ghost" aria-hidden="true">{p.num}</span>
              <div className="work-layer-content">
                <div className="work-slot-wrap">
                  <span className="work-eyebrow work-slot">{p.type}</span>
                </div>
                <div className="work-slot-wrap">
                  <h2 className="work-title work-slot">{p.title}</h2>
                </div>
                <div className="work-slot-wrap">
                  <p className="work-stack work-slot">{p.stack}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — image column */}
        <div className="work-img-col">
          {projects.map((p, i) => (
            <div key={p.num} className="work-img-layer">
              <div className="work-img-inner">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
