'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current!
    const ring = ringRef.current!
    let mx = 0, my = 0, rx = 0, ry = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      gsap.set(dot, { x: mx, y: my })
    }
    document.addEventListener('mousemove', onMove)

    const ticker = gsap.ticker.add(() => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      gsap.set(ring, { x: rx, y: ry })
    })

    // Grow ring on interactive elements
    const grow = () => gsap.to(ring, { scale: 2.8, duration: 0.3, ease: 'power2.out' })
    const shrink = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' })

    const attach = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
    }
    attach()
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(ticker as unknown as gsap.Callback)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="cursor">
      <div className="cursor-dot"  ref={dotRef}  />
      <div className="cursor-ring" ref={ringRef} />
    </div>
  )
}
