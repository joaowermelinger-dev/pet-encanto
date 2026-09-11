export default function GallerySection() {
  return (
    <section id="galeria" className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="text-2xl font-semibold">Nossos clientes de quatro patas</h2>
      <p className="mt-2 text-muted">Fotos dos pets que passam por aqui — em breve, direto do admin.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted text-sm text-muted"
          >
            Foto em breve
          </div>
        ))}
      </div>
    </section>
  )
}
