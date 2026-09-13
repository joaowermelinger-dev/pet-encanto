import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as shopInfoApi from '../api/shopInfo'
import type { ShopInfoInput } from '../api/shopInfo'

const SHOP_INFO = ['shop-info'] as const
const PUBLIC_SHOP_INFO = ['public', 'shop-info'] as const

export function useShopInfo() {
  return useQuery({ queryKey: SHOP_INFO, queryFn: shopInfoApi.getShopInfo })
}

export function useUpdateShopInfo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ShopInfoInput) => shopInfoApi.updateShopInfo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_INFO })
      queryClient.invalidateQueries({ queryKey: PUBLIC_SHOP_INFO })
    },
  })
}
