/**
 * Data local (AAAA-MM-DD) no fuso do navegador. Não use
 * `toISOString().slice(0, 10)`: isso dá a data em UTC, e depois das 21h no
 * horário de Brasília já vira o dia seguinte.
 */
export function localISODate(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
