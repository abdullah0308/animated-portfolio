import Nav         from '@/components/Nav'
import Hero        from '@/components/Hero'
import Statement   from '@/components/Statement'
import Work        from '@/components/Work'
import About       from '@/components/About'
import Footer      from '@/components/Footer'
import Cursor      from '@/components/Cursor'
import MenuOverlay from '@/components/MenuOverlay'
import Preloader   from '@/components/Preloader'
import ProgressBar from '@/components/ProgressBar'

export default function Home() {
  return (
    <>
      <Preloader />
      <ProgressBar />
      <Cursor />
      <MenuOverlay />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Work />
        <About />
        <Footer />
      </main>
    </>
  )
}
