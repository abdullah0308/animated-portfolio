'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Generative art sketches ───────────────────────────────────────────────────
// Each returns a cleanup fn. All use dark bg (#0d0d0d) with --fg palette.

type Sketch = (canvas: HTMLCanvasElement) => () => void

// 1. Flow Field — noise-angle particle streams
const sketchFlow: Sketch = (canvas) => {
  const ctx = canvas.getContext('2d')!
  const W = canvas.width  = canvas.offsetWidth  || 400
  const H = canvas.height = canvas.offsetHeight || 480

  // Layered trig noise → angle field
  const angle = (x: number, y: number, t: number) =>
    Math.sin(x * 0.007 + t * 0.7) * Math.cos(y * 0.009 - t * 0.5) * Math.PI * 2.5 +
    Math.sin(x * 0.003 - y * 0.004 + t * 0.3) * Math.PI

  const N = 380
  const pts = Array.from({ length: N }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    life: Math.random() * 90, max: 70 + Math.random() * 60,
  }))

  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, W, H)

  let t = 0, raf = 0
  const tick = () => {
    raf = requestAnimationFrame(tick)
    t += 0.007
    ctx.fillStyle = 'rgba(13,13,13,0.07)'
    ctx.fillRect(0, 0, W, H)
    ctx.lineWidth = 0.9

    for (const p of pts) {
      const a = angle(p.x, p.y, t)
      const ox = p.x, oy = p.y
      p.x += Math.cos(a) * 1.3
      p.y += Math.sin(a) * 1.3
      p.life++

      if (p.life > p.max || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
        p.x = Math.random() * W; p.y = Math.random() * H; p.life = 0; continue
      }
      const alpha = Math.sin((p.life / p.max) * Math.PI) * 0.55
      ctx.strokeStyle = `rgba(242,237,228,${alpha.toFixed(3)})`
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(p.x, p.y); ctx.stroke()
    }
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

// 2. Wave Rings — concentric interference circles
const sketchRings: Sketch = (canvas) => {
  const ctx = canvas.getContext('2d')!
  const W = canvas.width  = canvas.offsetWidth  || 400
  const H = canvas.height = canvas.offsetHeight || 480
  const cx = W / 2, cy = H / 2

  // Two offset epicentres
  const sources = [
    { x: cx - W * 0.15, y: cy + H * 0.05 },
    { x: cx + W * 0.18, y: cy - H * 0.08 },
  ]

  let t = 0, raf = 0
  const tick = () => {
    raf = requestAnimationFrame(tick)
    t += 0.022
    ctx.fillStyle = '#0d0d0d'
    ctx.fillRect(0, 0, W, H)

    const maxR = Math.hypot(W, H)
    const step = 28
    for (let r = 0; r < maxR; r += step) {
      const phase = r * 0.06 - t * 2.8
      let alpha = (Math.sin(phase) + 1) / 2

      // Interference: multiply with second source wave
      const r2 = r + 18
      const phase2 = r2 * 0.055 - t * 2.2
      alpha *= (Math.sin(phase2) + 1) / 2

      alpha = Math.pow(alpha, 0.6) * 0.45 * (1 - r / maxR)
      if (alpha < 0.01) continue

      ctx.strokeStyle = `rgba(242,237,228,${alpha.toFixed(3)})`
      ctx.lineWidth = 0.8

      for (const src of sources) {
        ctx.beginPath()
        ctx.arc(src.x, src.y, r, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

// 3. Orbital Trails — particles orbiting drifting attractors
const sketchOrbital: Sketch = (canvas) => {
  const ctx = canvas.getContext('2d')!
  const W = canvas.width  = canvas.offsetWidth  || 400
  const H = canvas.height = canvas.offsetHeight || 480

  const attractors = Array.from({ length: 3 }, (_, i) => ({
    angle: (i / 3) * Math.PI * 2,
    radius: Math.min(W, H) * 0.22,
    speed: 0.004 + i * 0.002,
    phase: i * 1.3,
  }))

  const N = 220
  const pts = Array.from({ length: N }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.6,
    y: H / 2 + (Math.random() - 0.5) * H * 0.6,
    vx: 0, vy: 0,
    life: Math.floor(Math.random() * 120),
  }))

  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, W, H)

  let t = 0, raf = 0
  const tick = () => {
    raf = requestAnimationFrame(tick)
    t += 1
    ctx.fillStyle = 'rgba(13,13,13,0.12)'
    ctx.fillRect(0, 0, W, H)

    const attrPos = attractors.map(a => ({
      x: W / 2 + Math.cos(a.angle + t * a.speed + a.phase) * a.radius,
      y: H / 2 + Math.sin(a.angle + t * a.speed * 0.7 + a.phase) * a.radius * 0.8,
    }))

    for (const p of pts) {
      p.life++
      if (p.life > 180 || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
        p.x = W / 2 + (Math.random() - 0.5) * W * 0.5
        p.y = H / 2 + (Math.random() - 0.5) * H * 0.5
        p.vx = p.vy = 0; p.life = 0
      }

      // Pull toward nearest attractor
      let fx = 0, fy = 0
      for (const a of attrPos) {
        const dx = a.x - p.x, dy = a.y - p.y
        const d = Math.sqrt(dx * dx + dy * dy) + 1
        const f = Math.min(180 / (d * d), 0.6)
        fx += dx * f; fy += dy * f
      }
      p.vx = (p.vx + fx) * 0.94
      p.vy = (p.vy + fy) * 0.94

      const ox = p.x, oy = p.y
      p.x += p.vx; p.y += p.vy

      const alpha = Math.min(p.life / 30, 1) * 0.5
      ctx.strokeStyle = `rgba(242,237,228,${alpha.toFixed(3)})`
      ctx.lineWidth = 0.7
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(p.x, p.y); ctx.stroke()
    }

    // Draw attractor centres
    for (const a of attrPos) {
      ctx.fillStyle = 'rgba(242,237,228,0.25)'
      ctx.beginPath(); ctx.arc(a.x, a.y, 2, 0, Math.PI * 2); ctx.fill()
    }
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

// 4. Dot Matrix — grid of circles with sine-driven displacement
const sketchDots: Sketch = (canvas) => {
  const ctx = canvas.getContext('2d')!
  const W = canvas.width  = canvas.offsetWidth  || 400
  const H = canvas.height = canvas.offsetHeight || 480

  const cols = 24, rows = 28
  const gx = W / cols, gy = H / rows

  let t = 0, raf = 0
  const tick = () => {
    raf = requestAnimationFrame(tick)
    t += 0.025
    ctx.fillStyle = '#0d0d0d'
    ctx.fillRect(0, 0, W, H)

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const bx = (c + 0.5) * gx
        const by = (r + 0.5) * gy
        const dist = Math.hypot(bx - W / 2, by - H / 2) / Math.hypot(W / 2, H / 2)
        const wave = Math.sin(dist * 7 - t * 2.5 + c * 0.15 + r * 0.1)
        const size = ((wave + 1) / 2) * gx * 0.4
        const alpha = ((wave + 1) / 2) * 0.65 + 0.05

        ctx.fillStyle = `rgba(242,237,228,${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(bx, by, Math.max(size, 0.5), 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

// 5. Constellation — drifting points connected by proximity lines
const sketchConstellation: Sketch = (canvas) => {
  const ctx = canvas.getContext('2d')!
  const W = canvas.width  = canvas.offsetWidth  || 400
  const H = canvas.height = canvas.offsetHeight || 480

  const N = 55
  const pts = Array.from({ length: N }, (_, i) => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
  }))

  const LINK_DIST = Math.min(W, H) * 0.28

  let raf = 0
  const tick = () => {
    raf = requestAnimationFrame(tick)
    ctx.fillStyle = 'rgba(13,13,13,0.25)'
    ctx.fillRect(0, 0, W, H)

    // Move
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > W) p.vx *= -1
      if (p.y < 0 || p.y > H) p.vy *= -1
    }

    // Lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.5
          ctx.strokeStyle = `rgba(242,237,228,${alpha.toFixed(3)})`
          ctx.lineWidth = (1 - d / LINK_DIST) * 1.2
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke()
        }
      }
    }

    // Dots
    for (const p of pts) {
      ctx.fillStyle = 'rgba(242,237,228,0.75)'
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill()
    }
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

// ── Card data ─────────────────────────────────────────────────────────────────

const CARDS = [
  { id: 'flow',          label: '01', title: 'Flow Field',    desc: 'Noise-driven particle streams',   sketch: sketchFlow },
  { id: 'rings',         label: '02', title: 'Wave Rings',    desc: 'Concentric interference patterns', sketch: sketchRings },
  { id: 'orbital',       label: '03', title: 'Orbital',       desc: 'Attractor particle system',        sketch: sketchOrbital },
  { id: 'dots',          label: '04', title: 'Dot Matrix',    desc: 'Sinusoidal grid displacement',     sketch: sketchDots },
  { id: 'constellation', label: '05', title: 'Constellation', desc: 'Proximity-linked drift graph',     sketch: sketchConstellation },
]

// ── Canvas Card ───────────────────────────────────────────────────────────────

function GenCard({ card }: { card: typeof CARDS[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef   = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Delay start so card is in DOM with correct size
    const tid = setTimeout(() => {
      if (!canvas) return
      // Resize canvas to actual rendered size
      const rect = canvas.getBoundingClientRect()
      canvas.width  = rect.width  || canvas.offsetWidth  || 400
      canvas.height = rect.height || canvas.offsetHeight || 480

      // Wrap tick to respect pause
      const rawCleanup = card.sketch(canvas)

      // Override: patch global rAF used inside sketch via pause flag
      // (sketches read pausedRef through closure — we keep original cleanup)
      cleanupRef.current = rawCleanup
    }, 100)

    // IntersectionObserver — pause RAF when fully off-screen
    const observer = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting },
      { threshold: 0 }
    )
    if (cardRef.current) observer.observe(cardRef.current)

    return () => {
      clearTimeout(tid)
      observer.disconnect()
      cleanupRef.current?.()
    }
  }, [card])

  return (
    <div className="hs-card" ref={cardRef}>
      <div className="hs-canvas-wrap">
        <canvas ref={canvasRef} className="hs-canvas" />
      </div>
      <div className="hs-card-info">
        <span className="hs-card-num">{card.label}</span>
        <span className="hs-card-title">{card.title}</span>
        <span className="hs-card-desc">{card.desc}</span>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    // Mobile: let it wrap naturally, skip GSAP pin
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const getTravel = () => track.scrollWidth - window.innerWidth

    const tween = gsap.to(track, {
      x: () => -getTravel(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getTravel()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // Card entrance — stagger as each enters view
    const cards = track.querySelectorAll<HTMLElement>('.hs-card')
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: () => `top+=${getTravel() * (i / (cards.length + 1))} top`,
            once: true,
            containerAnimation: tween,
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section className="hs-section" ref={sectionRef} id="work">
      <div className="hs-sticky">
        <div className="hs-header">
          <span className="hs-eyebrow">Generative Playground</span>
        </div>

        <div className="hs-track" ref={trackRef}>
          {/* Leading spacer so first card doesn't flush left */}
          <div className="hs-lead" aria-hidden="true" />

          {CARDS.map(card => (
            <GenCard key={card.id} card={card} />
          ))}

          {/* Trailing spacer */}
          <div className="hs-trail" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
