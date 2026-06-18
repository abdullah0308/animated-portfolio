'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''
const MU   = { lng: 57.552,  lat: -20.348  }
const PL   = { lng: 57.4977, lat: -20.1609 }
const VER  = '3.24.0'

function loadMapbox(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any
    if (w.mapboxgl) { resolve(w.mapboxgl); return }

    if (!document.getElementById('mbx-css')) {
      const link  = document.createElement('link')
      link.id     = 'mbx-css'
      link.rel    = 'stylesheet'
      link.href   = `https://api.mapbox.com/mapbox-gl-js/v${VER}/mapbox-gl.css`
      document.head.appendChild(link)
    }

    const existing = document.getElementById('mbx-js') as HTMLScriptElement | null
    if (existing) {
      if (w.mapboxgl) { resolve(w.mapboxgl); return }
      existing.addEventListener('load',  () => resolve((window as any).mapboxgl))
      existing.addEventListener('error', () => reject(new Error('Mapbox CDN failed')))
      return
    }

    const script    = document.createElement('script')
    script.id       = 'mbx-js'
    script.src      = `https://api.mapbox.com/mapbox-gl-js/v${VER}/mapbox-gl.js`
    script.onload   = () => resolve((window as any).mapboxgl)
    script.onerror  = () => reject(new Error('Mapbox CDN failed'))
    document.head.appendChild(script)
  })
}

export default function GlobeIntro() {
  const shellRef = useRef<HTMLDivElement>(null)
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef   = useRef<any>(null)
  const [active, setActive] = useState(false)

  // Activate after preloader
  useEffect(() => {
    const start = () => {
      document.body.style.overflow = 'hidden'
      setActive(true)
    }
    if ((window as any).__preloaderDone) {
      start()
    } else {
      window.addEventListener('preloader:done', start, { once: true })
      return () => window.removeEventListener('preloader:done', start)
    }
  }, [])

  // Init map once shell is mounted
  useEffect(() => {
    if (!active) return

    let alive = true

    loadMapbox().then((mapboxgl) => {
      if (!alive || !mapElRef.current) return

      mapboxgl.accessToken = TOKEN

      const map = new mapboxgl.Map({
        container:          mapElRef.current,
        style:              'mapbox://styles/mapbox/dark-v11',
        center:             [MU.lng, MU.lat],
        zoom:               1.8,
        projection:         'globe',
        attributionControl: false,
        interactive:        false,
      })

      mapRef.current = map

      map.on('load', () => {
        if (!alive) return

        // Map is ready — reveal the shell so the user sees the globe
        if (shellRef.current) {
          gsap.to(shellRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' })
        }

        try {
          map.setFog({
            color:            '#0a0a0a',
            'high-color':     '#0d0d12',
            'horizon-blend':  0.03,
            'space-color':    '#0a0a0a',
            'star-intensity': 0,
          })
        } catch (_) {}

        try { map.setPaintProperty('water', 'fill-color', '#0d1b2a') } catch (_) {}

        map.getStyle().layers?.forEach((l: any) => {
          if (l.type === 'symbol') map.setLayoutProperty(l.id, 'visibility', 'none')
        })

        // Amber pulse marker over Port Louis
        const markerEl       = document.createElement('div')
        markerEl.className   = 'gi-pulse'
        new mapboxgl.Marker({ element: markerEl, anchor: 'center' })
          .setLngLat([PL.lng, PL.lat])
          .addTo(map)

        // Rotate 1.5 s then fly to Mauritius
        let bearing  = 0
        const rotateId = setInterval(() => { bearing -= 0.25; map.setBearing(bearing) }, 50)

        setTimeout(() => {
          if (!alive) return
          clearInterval(rotateId)
          map.flyTo({ center: [PL.lng, PL.lat], zoom: 9, pitch: 50, bearing, duration: 3200, curve: 1.3 })

          // Fade shell out after fly-to settles
          setTimeout(() => {
            if (!shellRef.current || !alive) return
            // Signal the hero bg to start fading in NOW so it cross-fades
            // with the globe fade-out instead of starting after it.
            ;(window as any).__globeFading = true
            window.dispatchEvent(new Event('globe:fading'))
            gsap.to(shellRef.current, {
              opacity: 0, duration: 0.9, ease: 'power2.inOut',
              onComplete: () => {
                document.body.style.overflow = ''
                map.remove()
                mapRef.current = null
                ;(window as any).__globeDone = true
                window.dispatchEvent(new Event('globe:done'))
                if (alive) setActive(false)
              },
            })
          }, 2800)
        }, 1500)
      })

      map.on('error', (e: any) => console.error('[GlobeIntro]', e))
    }).catch(e => console.error('[GlobeIntro]', e))

    return () => {
      alive = false
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [active])

  if (!active) return null

  return (
    <div className="gi-shell" ref={shellRef} aria-hidden="true">
      <div ref={mapElRef} className="gi-map" />
    </div>
  )
}
