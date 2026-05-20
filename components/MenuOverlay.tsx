'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Shared event bus (simple window event)
export function openMenu()  { window.dispatchEvent(new Event('menu:open'))  }
export function closeMenu() { window.dispatchEvent(new Event('menu:close')) }

export default function MenuOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const linksRef   = useRef<NodeListOf<Element>>()

  useEffect(() => {
    const overlay = overlayRef.current!
    linksRef.current = overlay.querySelectorAll('.menu-nav a span')

    const handleOpen = () => {
      gsap.to(overlay, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.75,
        ease: 'power4.inOut',
      })
      gsap.to(linksRef.current!, {
        y: '0%',
        duration: 0.85,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 0.35,
      })
    }

    const handleClose = () => {
      gsap.to(linksRef.current!, {
        y: '110%',
        duration: 0.45,
        stagger: 0.05,
        ease: 'power4.in',
      })
      gsap.to(overlay, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.65,
        ease: 'power4.inOut',
        delay: 0.2,
      })
    }

    window.addEventListener('menu:open',  handleOpen)
    window.addEventListener('menu:close', handleClose)
    return () => {
      window.removeEventListener('menu:open',  handleOpen)
      window.removeEventListener('menu:close', handleClose)
    }
  }, [])

  return (
    <div className="menu-overlay" ref={overlayRef}>
      <div className="menu-top">
        <a href="/" className="menu-logo">Abdullah Mohamed</a>
        <button className="menu-close" onClick={closeMenu}>Close</button>
      </div>

      <nav className="menu-nav">
        <a href="#work"    onClick={closeMenu}><span>Work</span></a>
        <a href="#about"   onClick={closeMenu}><span>About</span></a>
        <a href="mailto:hello@abdullah-m.dev"><span>Reach out</span></a>
      </nav>

      <div className="menu-bottom">
        <div className="menu-socials">
          <a href="https://www.linkedin.com/in/abdullah-mohamed-05426931a/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://github.com/" target="_blank" rel="noopener">GitHub</a>
        </div>
        <p className="menu-copy">©2026 Abdullah Mohamed</p>
      </div>
    </div>
  )
}
