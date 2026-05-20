'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current!
    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })

    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      gsap.set(bar, { scaleX: progress })
    }

    window.addEventListener('scroll', update, { passive: true })
    update()

    return () => window.removeEventListener('scroll', update)
  }, [])

  return <div className="progress-bar" ref={barRef} />
}
