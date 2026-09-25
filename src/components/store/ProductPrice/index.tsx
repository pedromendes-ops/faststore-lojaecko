import Installments from '../Installments'
import { formatPrice } from '../../../utils/formatPrice'
import { getPixPrice, getProductDiscount } from '../../../utils/productPrice'

import {
  DISCOUNT_NOMINAL,
  PIX_DISCOUNT,
  DISCOUNT_PERCENTAGE
} from '../../../constants/store'

import type { ProductPriceProps } from './types'
import styles from './ProductPrice.module.scss'

export default function ProductPrice({
  price,
  listPrice,
  installment,
  taxesLabel,
  variant

}: ProductPriceProps) {  

  const {hasDiscount, discountValue, discountPercentage} = getProductDiscount(price, listPrice)
  const pixPrice = getPixPrice(price, PIX_DISCOUNT)

  return (
    <div
      className={styles.productPrice}
      data-fs-store-product-price
      data-fs-store-product-price-variant={variant}
    >   

      {/* discount off */}
      {DISCOUNT_PERCENTAGE && hasDiscount && (
        <span className={styles.discountPercentage} data-fs-product-price-discount-percentage>
          {discountPercentage}% OFF
        </span>
      )}
      
      {/* list price */}
      {hasDiscount && typeof listPrice === 'number' && (
        <span className={styles.listPrice} data-fs-store-product-list-price>
          {formatPrice(listPrice)}
        </span>
      )}

      {/* price */}
      <strong className={styles.price} data-fs-store-product-selling-price>
        {formatPrice(price)}
      </strong>

      {/* discount pix */}
      {pixPrice !== undefined && (
        <div className={styles.pixDiscount} data-fs-store-product-pix-price>
          <strong>{formatPrice(pixPrice)}</strong>
          <span>
            {' '} no PIX com{' '} {PIX_DISCOUNT}% OFF
          </span>
        </div>
      )}

      {/* discount nominal */}
      {DISCOUNT_NOMINAL && hasDiscount && (
        <div className={styles.discountValue} data-fs-store-product-discount-value>
          Economia de{' '} {formatPrice(discountValue)}
        </div>
      )}

      {/* installment */}
      {installment && (
        <Installments variant={variant} installment={installment} />
      )}

      {/* taxes */}
      {taxesLabel && (
        <span className={styles.taxes} data-fs-product-details-taxes-label>
          {taxesLabel}
        </span>
      )}
      
    </div>
  )
}