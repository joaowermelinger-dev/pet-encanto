import ServiceCatalog from '../../components/settings/ServiceCatalog'

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Configurações</h1>
      <p className="mt-1 text-sm text-muted">Dados do petshop e catálogo usado nos atendimentos.</p>

      <div className="mt-6 rounded-xl border border-border bg-surface p-5">
        <ServiceCatalog />
      </div>
    </div>
  )
}
