'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable on touch devices entirely
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    const dot  = dotRef.current!
    const ring = ringRef.current!

    // Spring-based trailing via GSAP quickTo
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    let mx = 0, my = 0
    let magnetActive = false

    const onMove = (e: MouseEvent) => {
      if (magnetActive) return
      mx = e.clientX; my = e.clientY
      gsap.set(dot, { x: mx, y: my })
      xTo(mx); yTo(my)
    }
    document.addEventListener('mousemove', onMove)

    // ── Hover states (a, button) ──
    const grow   = () => gsap.to(ring, { scale: 2.6, duration: 0.3, ease: 'power2.out' })
    const shrink = () => gsap.to(ring, { scale: 1,   duration: 0.3, ease: 'power2.out' })

    // ── Magnetic elements [data-magnetic] ──
    const magnetEnter = (e: Event) => {
      const el  = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2

      magnetActive = true
      gsap.to(ring, { scale: 1.8, duration: 0.3, ease: 'power2.out' })

      const onMagnetMove = (me: MouseEvent) => {
        const dx = me.clientX - cx
        const dy = me.clientY - cy
        mx = me.clientX; my = me.clientY

        // Dot snaps to mouse
        gsap.set(dot, { x: mx, y: my })
        // Ring pulls toward element centre
        gsap.to(ring, { x: cx + dx * 0.35, y: cy + dy * 0.35, duration: 0.15, ease: 'power1.out' })
        // Element nudges toward cursor
        gsap.to(el, { x: dx * 0.28, y: dy * 0.28, duration: 0.3, ease: 'power2.out' })
      }

      el.addEventListener('mousemove', onMagnetMove as EventListener)
      ;(el as any)._magnetMove = onMagnetMove
    }

    const magnetLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement
      magnetActive = false
      gsap.to(ring, { x: mx, y: my, scale: 1, duration: 0.35, ease: 'power3.out' })
      gsap.to(el,   { x: 0,  y: 0,            duration: 0.5,  ease: 'elastic.out(1,0.4)' })
      el.removeEventListener('mousemove', (el as any)._magnetMove)
    }

    const attach = () => {
      document.querySelectorAll<HTMLElement>('a, button').forEach(el => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el => {
        el.removeEventListener('mouseenter', magnetEnter)
        el.removeEventListener('mouseleave', magnetLeave)
        el.addEventListener('mouseenter', magnetEnter)
        el.addEventListener('mouseleave', magnetLeave)
      })
    }
    attach()

    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
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
