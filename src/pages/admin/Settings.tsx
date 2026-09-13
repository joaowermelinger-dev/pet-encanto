import ShopInfoForm from '../../components/settings/ShopInfoForm'
import ServiceCatalog from '../../components/settings/ServiceCatalog'

export default function Settings() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="mt-1 text-sm text-muted">Dados do petshop e catálogo usado nos atendimentos.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Dados do petshop</h2>
        <p className="mt-1 text-sm text-muted">
          Endereço, contato e horário exibidos na landing page.
        </p>
        <div className="mt-5">
          <ShopInfoForm />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <ServiceCatalog />
      </div>
    </div>
  )
}
