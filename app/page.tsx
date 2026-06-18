import Nav         from '@/components/Nav'
import Hero        from '@/components/Hero'
import Statement   from '@/components/Statement'
import Work        from '@/components/Work'
import About       from '@/components/About'
import Closing     from '@/components/Closing'
import Cursor        from '@/components/Cursor'
import CursorReveal  from '@/components/CursorReveal'
import MenuOverlay from '@/components/MenuOverlay'
import Preloader   from '@/components/Preloader'
import ProgressBar from '@/components/ProgressBar'
import FloatingLabel from '@/components/FloatingLabel'

export default function Home() {
  return (
    <>
      <Preloader />
      <ProgressBar />
      <FloatingLabel />
      <Cursor />
      <CursorReveal />
      <MenuOverlay />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Work />
        <About />
        <Closing />
      </main>
    </>
  )
}
