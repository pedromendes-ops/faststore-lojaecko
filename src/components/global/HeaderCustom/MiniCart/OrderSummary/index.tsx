import {
  OrderSummary as UIOrderSummary,
  type OrderSummaryProps as UIOrderSummaryProps,
} from '@faststore/ui'

import type { ReactNode } from 'react'

import { usePriceFormatter } from '../../../../../hooks/usePriceFormatter'

type Props = UIOrderSummaryProps & {
  subTotal: number
  total: number
  checkoutButton?: ReactNode
}

export function OrderSummary({
  subTotal,
  total,
  checkoutButton,
  ...otherProps
}: Props) {
  const formatPrice = usePriceFormatter()

  const discount = Math.max(subTotal - total, 0)

  return (
    <>
      <UIOrderSummary
        subtotalLabel="Subtotal"
        discountLabel="Descontos"
        subtotalValue={formatPrice(subTotal)}
        discountValue={
          discount > 0
            ? `-${formatPrice(discount)}`
            : undefined
        }
        totalValue={formatPrice(total)}
        {...otherProps}
      />
      <p className='tc' style={{marginBottom: 16, fontSize: 12}}>Taxa e frete são calculados no checkout</p>
      {checkoutButton}
    </>
  )
}

export default OrderSummary