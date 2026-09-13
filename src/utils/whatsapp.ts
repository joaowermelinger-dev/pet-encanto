/** Monta um link wa.me a partir de um telefone em qualquer formato (parênteses, traço, espaço). */
export function whatsappLink(rawPhone: string, message?: string): string {
  const digits = rawPhone.replace(/\D/g, '')
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${withCountry}${query}`
}
