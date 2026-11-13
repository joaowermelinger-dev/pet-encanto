import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import TaxiDogBanner from '../components/landing/TaxiDogBanner'
import ServicesSection from '../components/landing/ServicesSection'
import WhyChooseSection from '../components/landing/WhyChooseSection'
import CtaBanner from '../components/landing/CtaBanner'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="landing">
      <Header />
      <Hero />
      <TaxiDogBanner />
      <ServicesSection />
      <WhyChooseSection />
      <CtaBanner />
      <ContactSection />
      <Footer />
    </div>
  )
}
