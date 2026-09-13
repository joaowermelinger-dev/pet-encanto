import { useQuery } from '@tanstack/react-query'
import { getPublicGallery } from '../api/public'

export function usePublicGallery() {
  return useQuery({ queryKey: ['public', 'gallery'], queryFn: getPublicGallery })
}
