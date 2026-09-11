const PLACEHOLDER_SERVICES = [
  { name: 'Banho', price: 'a partir de R$ 50' },
  { name: 'Tosa higiênica', price: 'a partir de R$ 40' },
  { name: 'Tosa completa', price: 'a partir de R$ 70' },
  { name: 'Consulta veterinária', price: 'sob consulta' },
]

export default function ServicesSection() {
  return (
    <section id="servicos" className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="text-2xl font-semibold">Nossos serviços</h2>
      <p className="mt-2 text-muted">Em breve com preços e horários atualizados pelo próprio petshop.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLACEHOLDER_SERVICES.map((service) => (
          <div key={service.name} className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium">{service.name}</h3>
            <p className="mt-1 text-sm text-muted">{service.price}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
