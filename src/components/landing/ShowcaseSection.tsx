import PawDecor from './PawDecor'

export default function ShowcaseSection() {
  return (
    <section id="mostruario" className="relative overflow-hidden bg-surface-muted py-16">
      <PawDecor />
      <div className="relative mx-auto max-w-5xl px-4">
        <h2 className="text-2xl font-semibold">Mostruário</h2>
        <p className="mt-2 text-muted">Os produtos cadastrados como públicos vão aparecer aqui.</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-surface text-sm text-muted"
            >
              Produto em breve
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
