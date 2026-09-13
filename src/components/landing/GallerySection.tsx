import { Camera } from 'lucide-react'
import PawDecor from './PawDecor'

const PLACEHOLDER_TILES = [
  { label: 'Banho relaxante', big: true },
  { label: 'Tosa na tesoura' },
  { label: 'Hidratação de pelos' },
  { label: 'Cuidado com carinho' },
  { label: 'Cliente feliz' },
]

export default function GallerySection() {
  return (
    <section id="galeria" className="relative overflow-hidden bg-surface-muted py-16 sm:py-24">
      <PawDecor />
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Um cuidado que dá para ver</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Fotos dos nossos clientes de quatro patas — em breve, direto do admin.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PLACEHOLDER_TILES.map((tile) => (
            <div
              key={tile.label}
              className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface shadow-soft ${
                tile.big ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <Camera size={tile.big ? 36 : 24} className="text-muted/50" />
              <span className="absolute bottom-2 left-2 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-muted shadow-soft">
                {tile.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
