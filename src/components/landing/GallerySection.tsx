import { Camera } from 'lucide-react'
import { usePublicGallery } from '../../hooks/usePublicGallery'
import PawDecor from './PawDecor'
import Reveal from './Reveal'

export default function GallerySection() {
  const { data: photos, isLoading } = usePublicGallery()

  return (
    <section
      id="galeria"
      className="relative overflow-hidden bg-gradient-to-b from-surface-muted via-surface-muted to-background py-16 sm:py-24"
    >
      <PawDecor />
      <div className="relative mx-auto max-w-5xl px-4">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Um cuidado que dá para ver</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Fotos dos nossos clientes de quatro patas.</p>
        </Reveal>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`aspect-square animate-pulse rounded-2xl bg-surface ${i === 0 ? 'col-span-2 row-span-2' : ''}`} />
            ))}
          </div>
        ) : !photos || photos.length === 0 ? (
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-12 text-center">
            <Camera size={26} className="text-muted" />
            <p className="text-sm text-muted">Em breve, fotos de verdade direto do nosso dia a dia.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {photos.map((photo, index) => (
              <Reveal key={photo.id} delay={index * 70} className={index === 0 ? 'col-span-2 row-span-2' : ''}>
                <div className="relative flex aspect-square size-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
                  <img src={photo.image_url} alt={photo.caption ?? 'Foto da Pet Encanto'} className="size-full object-cover" />
                  {photo.caption && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-muted shadow-soft">
                      {photo.caption}
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
