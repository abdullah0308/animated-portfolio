import Nav         from '@/components/Nav'
import Hero        from '@/components/Hero'
import Statement   from '@/components/Statement'
import Work        from '@/components/Work'
import Process     from '@/components/Process'
import About       from '@/components/About'
import Closing     from '@/components/Closing'
import Cursor      from '@/components/Cursor'
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
      <MenuOverlay />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Work />
        <Process />
        <About />
        <Closing />
      </main>
    </>
  )
}
