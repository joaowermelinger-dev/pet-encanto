import { Camera } from 'lucide-react'
import { usePublicGallery } from '../../hooks/usePublicGallery'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function GallerySection() {
  const { data: photos, isLoading } = usePublicGallery()

  return (
    <section id="galeria" className="relative bg-surface-muted py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Galeria" title="Um cuidado que dá para ver" subtitle="Fotos dos nossos clientes de quatro patas." />

        {isLoading ? (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`aspect-square animate-pulse rounded-3xl bg-surface ${i === 0 ? 'col-span-2 row-span-2' : ''}`} />
            ))}
          </div>
        ) : !photos || photos.length === 0 ? (
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-border bg-surface/60 py-14 text-center">
            <Camera size={28} className="text-muted" />
            <p className="text-sm text-muted">Em breve, fotos de verdade direto do nosso dia a dia.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {photos.map((photo, index) => (
              <Reveal key={photo.id} delay={index * 70} className={index === 0 ? 'col-span-2 row-span-2' : ''}>
                <figure className="group relative aspect-square size-full overflow-hidden rounded-3xl bg-surface shadow-soft">
                  <img
                    src={photo.image_url}
                    alt={photo.caption ?? 'Foto da Pet Encanto'}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {photo.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-8 text-xs font-semibold text-white sm:text-sm">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
