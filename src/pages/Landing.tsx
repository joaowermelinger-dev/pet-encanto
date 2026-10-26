import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import ServicesSection from '../components/landing/ServicesSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import WhyChooseSection from '../components/landing/WhyChooseSection'
import CtaBanner from '../components/landing/CtaBanner'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="landing">
      <Header />
      <Hero />
      <ServicesSection />
      <TestimonialsSection />
      <WhyChooseSection />
      <CtaBanner />
      <ContactSection />
      <Footer />
    </div>
  )
}
