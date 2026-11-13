// Separação entre seções da landing: linha ondulada fina, no traço dos rabiscos da abertura
export default function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`mx-auto max-w-[88rem] px-5 lg:px-10 ${className}`}>
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="h-4 w-full text-sage/60 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path vectorEffect="non-scaling-stroke" d={'M2 12 ' + 'q7.5 -10 15 0 t15 0 '.repeat(40)} />
      </svg>
    </div>
  )
}
