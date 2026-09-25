import {
  usePDP,
} from 'src/sdk/overrides/PageProvider'

import type {
  DescriptionProductProps,
} from './types'

import styles from './DescriptionProduct.module.scss'

export default function DescriptionProduct({
  title = 'Descrição',
  displayDescription = true,
}: DescriptionProductProps) {
  const context = usePDP()

  const product =
    context?.data?.product

  if (
    !product ||
    !displayDescription ||
    !product.description
  ) {
    return null
  }

  return (
    <section
      className={`section ${styles.description}`}
      data-fs-description-product
    >
      <div className="wrap">
        <div className="container">
          <div
            className={
              styles.content
            }
          >
            {title && (
              <h2
                className={
                  styles.title
                }
                data-fs-description-product-title
              >
                {title}
              </h2>
            )}

            <div
              className={
                styles.descriptionContent
              }
              data-fs-description-product-content
              dangerouslySetInnerHTML={{
                __html:
                  product.description,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}