interface PlaceholderProps {
  title: string
}

/** Tela provisória para seções ainda não implementadas (fases futuras do plano). */
export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted">Em construção — chega numa próxima fase.</p>
    </div>
  )
}
