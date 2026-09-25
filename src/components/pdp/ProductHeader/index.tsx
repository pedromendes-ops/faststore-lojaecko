import type {
  ProductHeaderProps,
} from './types'

import styles from './ProductHeader.module.scss'

export default function ProductHeader({
  name,
  sku,
  showSku = true,
  skuLabel = 'Ref.',
  brand,
  brandShow = true,
  brandLabel = ''
  
}: ProductHeaderProps) {
  return (
    <header
      className={
        styles.productHeader
      }
      data-fs-product-header
    >
      
      {brandShow && brand && (
        <div
          className={styles.brand}
          data-fs-product-header-brand
        >
          {brandLabel} {brand}
        </div>
      )}
      <h1
        className={styles.title}
        data-fs-product-header-title
      >
        {name}
      </h1>

      {showSku && sku && (
        <span
          className={styles.sku}
          data-fs-product-header-sku
        >
          {skuLabel} {sku}
        </span>
      )}
    </header>
  )
}