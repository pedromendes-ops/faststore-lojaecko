import NextLink from 'next/link'
import { useState } from 'react'

import {
  BuyButton,
  Icon,
  QuantitySelector,
  useUI,
} from '@faststore/ui'

import {
  SwiperCarousel,
} from '../../../../ui/SwiperCarousel'

import ProductPrice from '../../../ProductPrice'
import SkuVariations from '../../../SkuVariations'

import {
  getMaxInterestFreeInstallment,
} from '../../../Installments/utils'

import {
  getProductDiscount,
} from '../../../../../utils/productPrice'

import {
  DISCOUNT_PERCENTAGE,
} from '../../../../../constants/store'

import {
  useBuyButton,
} from 'src/sdk/cart/useBuyButton'

import type {
  ClientProductQueryQuery,
} from '@generated/graphql'

import { resizeVtexImage } from '../../../../../utils/productImage'
import styles from './QuickViewContent.module.scss'



type Product =
  NonNullable<
    ClientProductQueryQuery['product']
  >

interface QuickViewContentProps {
  product: Product
  layout: string
  onSkuSelect: (
    sku: string
  ) => void
}

export default function QuickViewContent({
  product,
  layout,
  onSkuSelect,
}: QuickViewContentProps) {
  const [
    quantity,
    setQuantity,
  ] = useState(1)

  const {
    pushToast,
  } = useUI()

  /**
   * Imagens
   */
  const images =
    product.image ?? []

  /**
   * Oferta
   */
  const offer =
    product.offers
      ?.offers?.[0]

  if (!offer) {
    return null
  }

  const {
    availability,
    price,
    priceWithTaxes,
    listPrice,
    listPriceWithTaxes,
    seller,
  } = offer

  const {
    id,
    sku,
    gtin,
    unitMultiplier,
    name: variantName,
    brand,
    isVariantOf,
    image: productImages,
    additionalProperty,
  } = product

  const productName =
    isVariantOf?.name ??
    product.name

  const skuVariants =
    isVariantOf
      ?.skuVariants

  /**
   * Desconto.
   *
   * Utilizado somente para
   * renderizar o selo % OFF.
   *
   * PIX e desconto nominal
   * ficam no ProductPrice.
   */
  const {
    hasDiscount,
    discountPercentage,
  } = getProductDiscount(
    price,
    listPrice
  )

  /**
   * Melhor parcelamento
   * sem juros.
   */
  const maxInstallment =
    getMaxInterestFreeInstallment(
      product.availableInstallments ??
        []
    )

  /**
   * Disponibilidade
   */
  const outOfStock =
    availability ===
    'https://schema.org/OutOfStock'

  /**
   * Botão de compra
   */
  const buyProps =
    useBuyButton({
      id,
      price,
      priceWithTaxes,
      listPrice,
      listPriceWithTaxes,
      seller,
      quantity,

      itemOffered: {
        sku,
        name: variantName,
        gtin,
        image:
          productImages,
        brand,
        isVariantOf,
        additionalProperty,
        unitMultiplier,
      },
    })

  return (
    <div
      className={`${styles.content} ${styles[layout]}`}
      data-fs-quick-view-content
    >
      <div
        className={
          styles.images
        }
        data-fs-quick-view-images
      >
        {layout ===
        'modal' ? (
          <SwiperCarousel
            slidesPerView={1}
            spaceBetween={0}
            showArrows
            showDots={false}
            loop
            autoPlay={false}
          >
            {images.map(
              (
                image,
                index
              ) => {
                if (
                  !image?.url
                ) {
                  return null
                }

                return (
                  <div
                    key={`image-${index}`}
                    className={
                      styles.slide
                    }
                  >
                    <img
                      src={resizeVtexImage(image.url,504)}
                      alt={
                        image.alternateName ??
                        `${productName} - ${
                          index +
                          1
                        }`
                      }
                      width={
                        600
                      }
                      height={
                        600
                      }
                      className={
                        styles.image
                      }
                      loading={
                        index ===
                        0
                          ? 'eager'
                          : 'lazy'
                      }
                    />
                  </div>
                )
              }
            )}
          </SwiperCarousel>
        ) : (
          <div
            className={
              styles.scrolimages
            }
          >
            {images.map(
              (
                image,
                index
              ) => {
                if (
                  !image?.url
                ) {
                  return null
                }

                return (
                  <picture
                    key={`${image.url}-${index}`}
                    className={
                      styles.picture
                    }
                  >
                    <img
                      src={resizeVtexImage(image.url,504)}
                      alt={
                        image.alternateName ??
                        `${productName} - ${
                          index +
                          1
                        }`
                      }
                      width={
                        600
                      }
                      height={
                        600
                      }
                      className={
                        styles.image
                      }
                      loading={
                        index ===
                        0
                          ? 'eager'
                          : 'lazy'
                      }
                    />
                  </picture>
                )
              }
            )}
          </div>
        )}
      </div>

      <div
        className={
          styles.info
        }
      >
        <div>
          <h2
            className={
              styles.name
            }
          >
            {productName}
          </h2>

          {!outOfStock && (
            <>
              {DISCOUNT_PERCENTAGE &&
                hasDiscount && (
                  <span
                    className={
                      styles.discountPercentage
                    }
                    data-fs-quick-view-discount-percentage
                  >
                    {
                      discountPercentage
                    }
                    % OFF
                  </span>
                )}

              <ProductPrice
                variant="quick-view"
                price={price}
                listPrice={listPrice}
                installment={maxInstallment}
              />
            </>
          )}

          {skuVariants && (
            <SkuVariations
              skuVariants={
                skuVariants
              }
              onSelect={
                onSkuSelect
              }
            />
          )}
        </div>

        <div
          className={
            styles.footer
          }
        >
          {!outOfStock && (
            <div
              className={
                styles.actions
              }
              data-fs-product-actions
            >
              <div
                style={{
                  display:
                    'none',
                }}
              >
                <QuantitySelector
                  min={1}
                  max={10}
                  unitMultiplier={
                    1
                  }
                  useUnitMultiplier={
                    false
                  }
                  onChange={
                    setQuantity
                  }
                  onValidateBlur={(
                    min:
                      number,
                    max:
                      number,
                    qty:
                      number
                  ) => {
                    pushToast({
                      title:
                        'Quantidade inválida',

                      message:
                        `Escolha uma quantidade entre ${min} e ${max}. Quantidade informada: ${qty}.`,

                      status:
                        'INFO',

                      icon: (
                        <Icon
                          name="CircleWavyWarning"
                          width={
                            30
                          }
                          height={
                            30
                          }
                        />
                      ),
                    })
                  }}
                />
              </div>

              <BuyButton
                icon={
                  <Icon
                    name="ShoppingCart"
                    aria-label="Comprar"
                  />
                }
                {...buyProps}
                data-fs-buy-button
              >
                Comprar
              </BuyButton>
            </div>
          )}

          {outOfStock && (
            <div
              className={
                styles.outOfStock
              }
            >
              Produto indisponível
            </div>
          )}

          <NextLink
            href={`/${product.slug}/p`}
            className={
              styles.detailsLink
            }
          >
            Ver detalhes do
            produto
          </NextLink>
        </div>
      </div>
    </div>
  )
}