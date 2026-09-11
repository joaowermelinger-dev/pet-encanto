import { CHANGELOG, type ChangeKind } from '../../data/changelog'

const KIND_LABEL: Record<ChangeKind, string> = {
  novo: 'Novo',
  melhoria: 'Melhoria',
  correção: 'Correção',
}

const KIND_CLASS: Record<ChangeKind, string> = {
  novo: 'bg-accent/15 text-accent',
  melhoria: 'bg-surface-muted text-foreground',
  correção: 'bg-red-100 text-red-700',
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function Updates() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Atualizações</h1>
      <p className="mt-1 text-sm text-muted">O que mudou no app. As mais recentes primeiro.</p>

      {CHANGELOG.length === 0 ? (
        <p className="mt-6 border-t border-border pt-6 text-sm text-muted">Nada por aqui ainda.</p>
      ) : (
        <div className="mt-6 flex flex-col divide-y divide-border border-t border-border">
          {CHANGELOG.map((entry) => (
            <section key={entry.id} className="flex flex-col gap-4 py-6">
              <div>
                <h2 className="text-base font-semibold">Patch {entry.version}</h2>
                <p className="text-xs uppercase tracking-wider text-muted">{formatDate(entry.date)}</p>
              </div>
              <div className="flex flex-col gap-4 pl-3">
                {entry.sections.map((section) => (
                  <div key={section.title} className="flex flex-col gap-2 border-l-2 border-accent/60 pl-3">
                    <h3 className="text-sm font-semibold">{section.title}</h3>
                    <ul className="flex flex-col gap-2">
                      {section.changes.map((c, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <span
                            className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${KIND_CLASS[c.kind]}`}
                          >
                            {KIND_LABEL[c.kind]}
                          </span>
                          <span>{c.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
