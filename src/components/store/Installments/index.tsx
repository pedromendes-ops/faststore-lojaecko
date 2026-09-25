import {
  formatPrice,
} from '../../../utils/formatPrice'

import type {
  InstallmentsProps,
} from './types'

import styles from './Installments.module.scss'

export default function Installments({
  installment,
  variant
}: InstallmentsProps) {
  return (
    <p
      className={
        styles.installments
      }
      data-fs-product-details-installments
      data-fs-installments-variant={variant}
    >
      ou{' '}
      {installment.installmentNumber}x de{' '}
      {formatPrice(
        installment.installmentValue
      )}{' '}
      sem juros
    </p>
  )
}