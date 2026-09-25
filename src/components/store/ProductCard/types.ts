import type { ProductSummary_ProductFragment } from '@generated/graphql'
import type { Installment } from '../Installments/types'

export type ProductCardVariant = | 'default' | 'compact'

export type ProductCluster = {
  id: string
  name: string
}

export type ProductCardProduct = ProductSummary_ProductFragment & {
  productClusters?: ProductCluster[]
  availableInstallments?: Installment[]
}

export type ProductCardProps = {
  product: ProductCardProduct
  index?: number
  variant?: ProductCardVariant
}