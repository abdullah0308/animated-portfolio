'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const quoteLines = ['More than tools,', 'shaped through real work.']
const dividers   = ['Aim with precision.', 'Release with intention.']

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef   = useRef<HTMLDivElement>(null)
  const quoteRef   = useRef<HTMLDivElement>(null)
  const img1Ref    = useRef<HTMLDivElement>(null)
  const div1Ref    = useRef<HTMLParagraphElement>(null)
  const img2Ref    = useRef<HTMLDivElement>(null)
  const div2Ref    = useRef<HTMLParagraphElement>(null)
  const img3Ref    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const PHASE_PX = 600   // scroll px per phase
      const TOTAL_PX = 6 * PHASE_PX  // 3600px total

      const quote  = quoteRef.current!
      const qLines = gsap.utils.toArray<HTMLElement>('.stmt-qline', quote)
      const img1   = img1Ref.current!
      const div1   = div1Ref.current!
      const img2   = img2Ref.current!
      const div2   = div2Ref.current!
      const img3   = img3Ref.current!

      // Center all elements — GSAP owns the transform
      gsap.set([quote, img1, div1, img2, div2, img3], {
        xPercent: -50,
        yPercent: -50,
      })

      // ── Initial hidden states ─────────────────────────────────────────
      // Quote lines: clipped from right (writing will reveal left→right)
      gsap.set(qLines, { clipPath: 'inset(0 100% 0 0)' })
      // Dividers: same
      gsap.set([div1, div2], { clipPath: 'inset(0 100% 0 0)' })
      // Images: below viewport, invisible
      gsap.set([img1, img2, img3], { y: '110vh', autoAlpha: 0 })

      // ── Single scrubbed timeline, stage pinned ────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${TOTAL_PX}`,
          pin: stageRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // PHASE 1 (t 0→1) — quote writes in line by line, then fades out
      tl.to(qLines, { clipPath: 'inset(0 0% 0 0)', stagger: 0.13, duration: 0.38 }, 0)
      tl.to(quote, { autoAlpha: 0, duration: 0.22 }, 0.78)

      // PHASE 2 (t 1→2) — image 1 rises from below, then fades out
      tl.to(img1, { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.45 }, 1)
      tl.to(img1, { autoAlpha: 0, duration: 0.22 }, 1.78)

      // PHASE 3 (t 2→3) — divider 1 writes in, then fades out
      tl.to(div1, { clipPath: 'inset(0 0% 0 0)', duration: 0.4 }, 2)
      tl.to(div1, { autoAlpha: 0, duration: 0.22 }, 2.78)

      // PHASE 4 (t 3→4) — image 2 rises, then fades out
      tl.to(img2, { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.45 }, 3)
      tl.to(img2, { autoAlpha: 0, duration: 0.22 }, 3.78)

      // PHASE 5 (t 4→5) — divider 2 writes in, then fades out
      tl.to(div2, { clipPath: 'inset(0 0% 0 0)', duration: 0.4 }, 4)
      tl.to(div2, { autoAlpha: 0, duration: 0.22 }, 4.78)

      // PHASE 6 (t 5→6) — image 3 rises, fades at very end
      tl.to(img3, { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.45 }, 5)
      tl.to(img3, { autoAlpha: 0, duration: 0.2 }, 5.8)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="statement" ref={sectionRef}>
      <div className="stmt-stage" ref={stageRef}>

        <div className="stmt-quote" ref={quoteRef}
             data-crv data-crv-text={quoteLines.join('\n')}>
          {quoteLines.map((line, i) => (
            <span key={i} className="stmt-qline">
              <span>{line}</span>
            </span>
          ))}
        </div>

        <div className="stmt-img" ref={img1Ref}>
          <Image src="/images/Atmosphere 1.jpg" alt="Atmosphere 1" fill
            style={{ objectFit: 'cover' }} />
        </div>

        <p className="stmt-divider" ref={div1Ref}
           data-crv data-crv-text={dividers[0]}>{dividers[0]}</p>

        <div className="stmt-img" ref={img2Ref}>
          <Image src="/images/Atmosphere 2.jpg" alt="Atmosphere 2" fill
            style={{ objectFit: 'cover' }} />
        </div>

        <p className="stmt-divider" ref={div2Ref}
           data-crv data-crv-text={dividers[1]}>{dividers[1]}</p>

        <div className="stmt-img" ref={img3Ref}>
          <Image src="/images/Atmosphere 3.jpg" alt="Atmosphere 3" fill
            style={{ objectFit: 'cover' }} />
        </div>

      </div>
    </section>
  )
}
