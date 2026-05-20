'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'

export default function Preloader() {
  const bgRef      = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const photoRef   = useRef<HTMLDivElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Phase 1 — count 0 → 100
    const obj = { n: 0 }
    tl.to(obj, {
      n: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate() {
        if (counterRef.current)
          counterRef.current.textContent = String(Math.round(obj.n))
      },
    })

    // Phase 2 — dark overlay fades out, photo (card-sized) is underneath
    tl.to(bgRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.out',
    })

    // Phase 3 — photo inner was scaled up (zoomed in); scale back to normal
    tl.from(innerRef.current, {
      scale: 1.18,
      duration: 0.85,
      ease: 'power3.out',
    }, '<') // simultaneous with fade

    // Phase 4 — rectangle expands to full screen
    tl.to(photoRef.current, {
      clipPath: 'inset(0% 0%)',
      duration: 0.9,
      ease: 'power4.inOut',
    }, '-=0.25')

    // Phase 5 — photo fades out, hero bg takes over seamlessly
    tl.to(photoRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out',
    })

    // Phase 6 — remove from DOM, fire event for Hero
    tl.set([bgRef.current, photoRef.current], { display: 'none' })
    tl.add(() => {
      ;(window as any).__preloaderDone = true
      window.dispatchEvent(new Event('preloader:done'))
    })

    return () => { tl.kill() }
  }, [])

  return (
    <>
      {/* Dark overlay + counter */}
      <div className="preloader-bg" ref={bgRef}>
        <span className="preloader-counter" ref={counterRef}>0</span>
      </div>

      {/* Photo — starts clipped to card size, expands to full screen */}
      <div className="preloader-photo" ref={photoRef}>
        <div className="preloader-photo-inner" ref={innerRef}>
          <Image
            src="/images/Hero Banner.png"
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>
    </>
  )
}
