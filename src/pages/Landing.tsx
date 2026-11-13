import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import ServicesSection from '../components/landing/ServicesSection'
import WhyChooseSection from '../components/landing/WhyChooseSection'
import CtaBanner from '../components/landing/CtaBanner'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'
import SectionDivider from '../components/landing/SectionDivider'

export default function Landing() {
  return (
    <div className="landing">
      <Header />
      <Hero />
      <SectionDivider className="mt-10 sm:mt-14" />
      <ServicesSection />
      <WhyChooseSection />
      <CtaBanner />
      <SectionDivider className="mt-16 sm:mt-24" />
      <ContactSection />
      <Footer />
    </div>
  )
}
