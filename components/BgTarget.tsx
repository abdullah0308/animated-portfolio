'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function BgTarget() {
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Outer ring rotates very slowly — barely perceptible, just alive
    gsap.to(innerRef.current, {
      rotation: 360,
      duration: 120,
      repeat: -1,
      ease: 'none',
    })
  }, [])

  return (
    <div className="bg-target" aria-hidden="true">
      <div className="bg-target-inner" ref={innerRef}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Concentric circles */}
          <circle cx="50" cy="50" r="48"   stroke="currentColor" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="33"   stroke="currentColor" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="18"   stroke="currentColor" strokeWidth="0.3" />
          {/* Center dot */}
          <circle cx="50" cy="50" r="1.5"  fill="currentColor" />
          {/* Crosshair lines — gap at inner circle */}
          <line x1="50" y1="0"   x2="50" y2="31"  stroke="currentColor" strokeWidth="0.3" />
          <line x1="50" y1="69"  x2="50" y2="100" stroke="currentColor" strokeWidth="0.3" />
          <line x1="0"  y1="50"  x2="31" y2="50"  stroke="currentColor" strokeWidth="0.3" />
          <line x1="69" y1="50"  x2="100" y2="50" stroke="currentColor" strokeWidth="0.3" />
        </svg>
      </div>
    </div>
  )
}
