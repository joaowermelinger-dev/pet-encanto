import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import ServicesSection from '../components/landing/ServicesSection'
import ShowcaseSection from '../components/landing/ShowcaseSection'
import GallerySection from '../components/landing/GallerySection'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div>
      <Header />
      <Hero />
      <ServicesSection />
      <ShowcaseSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  )
}
