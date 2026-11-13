// Separação entre seções da landing: linha ondulada fina com uma patinha no meio
const Wave = () => (
  <svg viewBox="0 0 600 24" preserveAspectRatio="none" className="h-4 min-w-0 flex-1 text-sage/60 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path vectorEffect="non-scaling-stroke" d={'M2 12 ' + 'q7.5 -10 15 0 t15 0 '.repeat(20)} />
  </svg>
)

export default function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`mx-auto flex max-w-[88rem] items-center gap-5 px-5 lg:px-10 ${className}`}>
      <Wave />
      <svg viewBox="0 0 24 24" className="size-7 shrink-0 -rotate-12 text-sage" fill="currentColor">
        <path d="M12 13 C8.5 13 6 16 6 18.5 C6 20.5 7.6 21.5 9.3 21 C10.4 20.7 11.2 20.3 12 20.3 C12.8 20.3 13.6 20.7 14.7 21 C16.4 21.5 18 20.5 18 18.5 C18 16 15.5 13 12 13 Z" />
        <ellipse cx="4.5" cy="10.5" rx="2.2" ry="2.8" />
        <ellipse cx="9" cy="5.5" rx="2.2" ry="3" />
        <ellipse cx="15" cy="5.5" rx="2.2" ry="3" />
        <ellipse cx="19.5" cy="10.5" rx="2.2" ry="2.8" />
      </svg>
      <Wave />
    </div>
  )
}
