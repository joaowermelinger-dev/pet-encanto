import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** Modal simples: fecha com Esc, clique no fundo, ou no X. */
export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-border bg-surface shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between p-6 pb-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1 text-muted hover:bg-surface-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
        {/* min-h-0 é o que deixa esse filho flex encolher e rolar em vez de
            empurrar o modal pra fora da tela quando o conteúdo é grande. */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4">{children}</div>
      </div>
    </div>
  )
}
