import AnnouncementBar from '../components/landing/AnnouncementBar'
import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import ServicesSection from '../components/landing/ServicesSection'
import GallerySection from '../components/landing/GallerySection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import WhyChooseSection from '../components/landing/WhyChooseSection'
import CtaBanner from '../components/landing/CtaBanner'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div>
      <AnnouncementBar />
      <Header />
      <Hero />
      <ServicesSection />
      <GallerySection />
      <TestimonialsSection />
      <WhyChooseSection />
      <CtaBanner />
      <ContactSection />
      <Footer />
    </div>
  )
}
