import { useQuery } from '@tanstack/react-query'
import { getPublicShopInfo } from '../api/public'

export function usePublicShopInfo() {
  return useQuery({ queryKey: ['public', 'shop-info'], queryFn: getPublicShopInfo })
}
