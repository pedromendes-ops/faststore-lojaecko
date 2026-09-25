import { useState } from 'react'

import { usePDP } from 'src/sdk/overrides/PageProvider'

import ImageGallery from '../ImageGallery'
import ProductDetailsInfo from '../ProductDetailsInfo'
import ProductHeader from '../ProductHeader'


import styles from './ProductDetails.module.scss'

export default function ProductDetails() {
  const context = usePDP()

  const product = context?.data?.product

  const isValidating = Boolean(
    context?.data?.isValidating
  )

  const [quantity, setQuantity] =
    useState(1)

  if (!product) {
    return null
  }

  return (
    <section
      className={`section ${styles.productDetails}`}
      data-fs-product-details-custom
    >
      <div className="wrap">
        <div className="container">
          <article
            data-fs-product-details
          >
            <div
              data-fs-product-context
              className={styles.content}
            >
              <div
                data-fs-product-details-gallery
                className={styles.gallery}
              >
                <ImageGallery
                  images={
                    product.image
                  }
                />
              </div>

              <div
                data-fs-product-details-info
                className={styles.info}
              >

                <ProductHeader
                    name={product.isVariantOf?.name ?? product.name}
                    sku={product.sku}
                    brand={product?.brand?.name ?? ''}
                />

                <ProductDetailsInfo
                  product={product}
                  quantity={quantity}
                  setQuantity={
                    setQuantity
                  }
                  isValidating={
                    isValidating
                  }
                  buyButtonTitle="Comprar"
                  buyButtonIcon={{
                    icon: 'ShoppingCart',
                    alt: 'Adicionar ao carrinho',
                  }}
                  notAvailableButtonTitle="Produto indisponível"
                  loadingLabel="Carregando..."
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}