import Header from '../components/landing/Header'
import ServicesSection from '../components/landing/ServicesSection'
import ShowcaseSection from '../components/landing/ShowcaseSection'
import GallerySection from '../components/landing/GallerySection'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div>
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">Banho, tosa e muito carinho 🐶🐱</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Cuidamos do seu pet como se fosse nosso. Confira nossos serviços e agende uma visita.
        </p>
      </section>
      <ServicesSection />
      <ShowcaseSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  )
}
