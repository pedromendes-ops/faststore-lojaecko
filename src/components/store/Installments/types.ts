import type {
  ServerProductQueryQuery,
} from '@generated/graphql'

export type InstallmentVariant = | 'product-card' | 'pdp' | 'quick-view' | 'cart'

export type Installment = ServerProductQueryQuery['product']['availableInstallments'][number]

export interface InstallmentsProps {
  installment: Installment
   variant?: InstallmentVariant
}