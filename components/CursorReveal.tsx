'use client'

import { useEffect } from 'react'

// Walk up the DOM to find the first non-transparent background color.
// Used so the blocker div matches the actual background behind the text.
function getEffectiveBg(el: HTMLElement): string {
  let node: HTMLElement | null = el
  while (node) {
    const bg = getComputedStyle(node).backgroundColor
    if (bg !== 'rgba(0, 0, 0, 0)') return bg
    node = node.parentElement
  }
  return 'rgb(13, 13, 13)' // var(--bg) fallback
}

export default function CursorReveal() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-crv]')
    )

    const cleanups: (() => void)[] = []

    targets.forEach((el) => {
      const text = el.dataset.crvText ?? ''
      if (!text) return

      const prevPosition = el.style.position
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative'
      }

      // Layer 1: paints the section background over the filled text near the
      // cursor, erasing it. Must sit above in-flow text but below the outline.
      const blocker = document.createElement('div')
      blocker.className = 'crv-blocker'
      blocker.setAttribute('aria-hidden', 'true')
      blocker.style.background = getEffectiveBg(el)

      // Layer 2: the outline-only text, rendered on top of the blocker.
      const outline = document.createElement('div')
      outline.className = 'crv-outline'
      outline.setAttribute('aria-hidden', 'true')
      outline.textContent = text

      // Mirror the parent's flex/grid layout so the outline text sits at the
      // exact same position as the original (handles justify-content:center etc.)
      const cs = getComputedStyle(el)
      if (cs.display.includes('flex') || cs.display.includes('grid')) {
        outline.style.display        = cs.display
        outline.style.flexDirection  = cs.flexDirection
        outline.style.justifyContent = cs.justifyContent
        outline.style.alignItems     = cs.alignItems
      }

      // Setting custom props on the element means both children inherit them,
      // so only one mousemove handler is needed.
      el.style.setProperty('--crv-x', '-9999px')
      el.style.setProperty('--crv-y', '-9999px')

      el.appendChild(blocker)
      el.appendChild(outline)

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--crv-x', `${e.clientX - rect.left}px`)
        el.style.setProperty('--crv-y', `${e.clientY - rect.top}px`)
      }

      const onLeave = () => {
        el.style.setProperty('--crv-x', '-9999px')
        el.style.setProperty('--crv-y', '-9999px')
      }

      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)

      cleanups.push(() => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
        blocker.remove()
        outline.remove()
        el.style.removeProperty('--crv-x')
        el.style.removeProperty('--crv-y')
        el.style.position = prevPosition
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return null
}
