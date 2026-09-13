import { useQuery } from '@tanstack/react-query'
import { getPublicServices } from '../api/public'

export function usePublicServices() {
  return useQuery({ queryKey: ['public', 'services'], queryFn: getPublicServices })
}
