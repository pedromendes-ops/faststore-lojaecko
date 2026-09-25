import type {
  ClientProductQueryQuery,
} from '@generated/graphql'

import {
  useProductQuery,
} from 'src/sdk/product/useProductQuery'

export function useQuickViewProduct(
  productId: string
) {
  const {
    data,
    error,
  } = useProductQuery(productId)

  const product =
    (
      data as
        | ClientProductQueryQuery
        | undefined
    )?.product ?? null

  return {
    product,
    isLoading:
      !data && !error,

    isNotFound:
      Boolean(
        (data || error) &&
          !product
      ),
  }
}