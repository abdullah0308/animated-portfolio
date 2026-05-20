'use client'

/**
 * SmoothScroll — wraps Lenis + GSAP ScrollTrigger integration.
 * Add <SmoothScroll /> inside your layout's <body> to activate.
 *
 * Usage in app/layout.tsx:
 *   import SmoothScroll from '@/components/SmoothScroll'
 *   ...
 *   <body>
 *     <SmoothScroll />
 *     {children}
 *   </body>
 */

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll() {
  useEffect(() => {
    // Always start at the top on page load/reload
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick as unknown as gsap.Callback)
      lenis.destroy()
    }
  }, [])

  return null
}
