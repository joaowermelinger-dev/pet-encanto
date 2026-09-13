import { PawPrint, Sparkles } from 'lucide-react'

/**
 * Banner grande no topo da landing. Por enquanto usa um fundo decorativo
 * (gradiente + patinhas) em vez de foto — trocar por uma foto real dos
 * clientes/pets assim que tiver uma (ver Fase 6, galeria).
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sage/25 via-gold/10 to-background">
      {/* Patinhas decorativas espalhadas — só efeito visual, escondidas de leitor de tela. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <PawPrint className="absolute left-[8%] top-[18%] rotate-[-15deg] text-sage/40" size={40} />
        <PawPrint className="absolute right-[10%] top-[28%] rotate-[20deg] text-gold/50" size={32} />
        <PawPrint className="absolute left-[18%] bottom-[15%] rotate-[10deg] text-gold/40" size={28} />
        <PawPrint className="absolute right-[20%] bottom-[22%] rotate-[-25deg] text-sage/40" size={36} />
        <Sparkles className="absolute left-[30%] top-[12%] text-gold/60" size={20} />
        <Sparkles className="absolute right-[32%] bottom-[18%] text-sage/50" size={18} />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-20 text-center sm:py-28">
        <p className="flex items-center justify-center gap-3 font-display text-3xl font-bold text-accent sm:text-5xl">
          <PawPrint className="shrink-0 text-gold" size={28} />
          Bem-vindos!
          <PawPrint className="shrink-0 text-sage" size={28} />
        </p>
        <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Banho, tosa e muito carinho 🐶🐱</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Cuidamos do seu pet como se fosse nosso. Confira nossos serviços e agende uma visita.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#servicos"
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
          >
            Ver serviços
          </a>
          <a
            href="#contato"
            className="rounded-full border border-accent px-6 py-3 font-medium text-accent hover:bg-accent/10"
          >
            Fale conosco
          </a>
        </div>
      </div>
    </section>
  )
}
