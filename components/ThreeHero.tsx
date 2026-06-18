'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── GLSL shaders ─────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
  // Classic 3-D simplex noise
  vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289v3(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.,i1.z,i2.z,1.))
      +i.y+vec4(0.,i1.y,i2.y,1.))
      +i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  uniform float uTime;
  uniform vec2  uMouse;   // normalised [-1,1]
  varying vec3  vNormal;
  varying float vDisplace;

  void main(){
    vec3 pos=position;

    // Layered noise
    float n1=snoise(vec3(pos.x*.45+uTime*.09, pos.y*.45, pos.z*.45+uTime*.07));
    float n2=snoise(vec3(pos.x*1.1-uTime*.13, pos.y*1.1, pos.z*1.1))*0.38;
    float noise=n1+n2;

    // Mouse pulls distortion toward cursor direction
    vec3 mDir=normalize(vec3(uMouse,0.6));
    float mDot=max(dot(normalize(pos),mDir),0.);
    float boost=pow(mDot,3.)*0.6;

    float disp=(noise*0.32+boost)*0.85;
    pos+=normal*disp;

    vNormal=normalize(normalMatrix*normal);
    vDisplace=noise;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
  }
`

const FRAG = /* glsl */ `
  varying vec3  vNormal;
  varying float vDisplace;

  void main(){
    vec3 viewDir=vec3(0.,0.,1.);
    float fresnel=pow(1.-max(dot(vNormal,viewDir),0.),2.6);

    vec3 light=normalize(vec3(.55,1.,.75));
    float diff=max(dot(vNormal,light),0.);

    vec3 dark=vec3(.055,.055,.062);
    vec3 glow=vec3(.95,.93,.89);   // matches --fg

    vec3 col=mix(dark,glow,fresnel*.7+diff*.1);
    col+=glow*vDisplace*.035;

    gl_FragColor=vec4(col,1.);
  }
`

// ── Component ─────────────────────────────────────────────────────────────────

function computeAge() {
  const born = new Date(2003, 7, 3)
  return Math.floor((Date.now() - born.getTime()) / (365.25 * 24 * 3600 * 1000))
}

export default function ThreeHero() {
  const mountRef  = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const textRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile  = window.innerWidth < 768

    let alive = true
    let rafId = 0

    import('three').then((THREE) => {
      if (!alive || !mountRef.current) return
      const el = mountRef.current

      // ── renderer ──
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5))
      renderer.setSize(el.clientWidth, el.clientHeight)
      renderer.setClearColor(0x0d0d0d, 1)
      el.appendChild(renderer.domElement)

      // ── scene / camera ──
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100)
      camera.position.z = 2.75

      // ── sphere ──
      const segs = mobile ? 64 : 128
      const geo  = new THREE.SphereGeometry(1, segs, segs)
      const mat  = new THREE.ShaderMaterial({
        vertexShader:   VERT,
        fragmentShader: FRAG,
        uniforms: {
          uTime:  { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        },
      })
      const mesh = new THREE.Mesh(geo, mat)
      scene.add(mesh)

      // ── mouse ──
      const mouse  = { x: 0, y: 0 }
      const smooth = { x: 0, y: 0 }
      const onMouseMove = (e: MouseEvent) => {
        mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
      }
      if (!reduced && !mobile) window.addEventListener('mousemove', onMouseMove)

      // ── resize ──
      const onResize = () => {
        if (!alive) return
        const w = el.clientWidth, h = el.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      // ── render loop ──
      const clock = new THREE.Clock()
      const tick = () => {
        rafId = requestAnimationFrame(tick)
        if (!reduced) {
          const t = clock.getElapsedTime()
          smooth.x += (mouse.x - smooth.x) * 0.05
          smooth.y += (mouse.y - smooth.y) * 0.05
          mat.uniforms.uTime.value  = t
          mat.uniforms.uMouse.value.set(smooth.x, smooth.y)
          mesh.rotation.y = t * 0.035
          mesh.rotation.x = t * 0.018
        }
        renderer.render(scene, camera)
      }
      tick()

      // ── scroll fade-out ──
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=50%',
          scrub: true,
          onUpdate: (self) => {
            if (el) el.style.opacity = String(1 - self.progress * 0.7)
          },
        })
      }

      // ── text entrance (after preloader) ──
      const txt   = textRef.current
      const lines = txt ? Array.from(txt.querySelectorAll<HTMLElement>('.th-line span')) : []
      const eye   = txt?.querySelector<HTMLElement>('.th-eyebrow')

      if (txt) {
        gsap.set(lines, { y: '110%' })
        gsap.set([txt, eye], { opacity: 0 })

        const enter = () => {
          if (!alive) return
          gsap.to(txt, { opacity: 1, duration: 0.01 })
          if (eye) gsap.to(eye, { opacity: 1, duration: 0.8, delay: 0.3 })
          gsap.to(lines, {
            y: '0%', duration: 1.15, ease: 'power4.out',
            stagger: 0.1, delay: 0.15,
          })
        }

        if ((window as any).__preloaderDone) {
          enter()
        } else {
          window.addEventListener('preloader:done', enter, { once: true })
        }
      }

      // ── cleanup ──
      ;(el as any)._threeCleanup = () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
        ScrollTrigger.getAll().forEach(t => { if ((t as any)._trigger === sectionRef.current) t.kill() })
        renderer.dispose()
        geo.dispose()
        mat.dispose()
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      }
    })

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      const el = mountRef.current
      if (el && (el as any)._threeCleanup) (el as any)._threeCleanup()
    }
  }, [])

  const age = computeAge()

  return (
    <section className="hero-three" ref={sectionRef}>
      {/* Three.js canvas mount */}
      <div className="th-canvas" ref={mountRef} aria-hidden="true" />

      {/* Text overlay */}
      <div className="th-overlay" ref={textRef}>
        <div className="th-top">
          <span className="th-label">Portfolio · 2026</span>
        </div>

        <div className="th-bottom">
          <div className="th-left">
            <span className="th-eyebrow">Junior Developer — {age} yrs old</span>
            <h1 className="th-title" data-crv>
              <span className="th-line"><span>Always</span></span>
              <span className="th-line"><span>Calibrating.</span></span>
            </h1>
          </div>

          <p className="th-scroll" aria-label="Scroll down">Scroll</p>
        </div>
      </div>
    </section>
  )
}
