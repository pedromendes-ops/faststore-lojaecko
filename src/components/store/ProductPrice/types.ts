import type { Installment } from '../Installments/types'

export type ProductPriceVariant = | 'product-card' | 'pdp' | 'quick-view' | 'cart'

export interface ProductPriceProps {
  price: number
  listPrice?: number
  installment?: Installment | null
  taxesLabel?: string
  variant?: ProductPriceVariant
}