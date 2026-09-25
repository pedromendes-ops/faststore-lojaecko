import {BuyButton, Icon, QuantitySelector, Skeleton as UISkeleton, useUI } from '@faststore/ui'
import type { ProductDetailsFragment_ProductFragment, ServerProductQueryQuery } from '@generated/graphql'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'
import ProductPrice from '../../store/ProductPrice'
import SkuVariations from '../../store/SkuVariations'
import ShippingSimulation from '../../store/ShippingSimulation'
import ProductCluster from '../../store/ProductCluster'
import NotAvailableButton from 'src/components/product/NotAvailableButton'
import AddToCartLoadingSkeleton from 'src/components/ui/ProductDetails/AddToCartLoadingSkeleton'
import { getProductDiscount, } from '../../../utils/productPrice'
import { DISCOUNT_PERCENTAGE } from '../../../constants/store'
import { getMaxInterestFreeInstallment } from '../../store/Installments/utils'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import styles from './ProductDetailsInfo.module.scss'

type ProductDetailsProduct =
  ProductDetailsFragment_ProductFragment &
  Pick<
    ServerProductQueryQuery['product'],
    | 'availableInstallments'
    | 'productClusters'
  >

export interface ProductDetailsInfoProps {
  product: ProductDetailsProduct
  buyButtonTitle: string
  buyButtonIcon: {
    alt: string
    icon: string
  }
  isValidating: boolean
  quantity: number
  setQuantity: Dispatch<SetStateAction<number>>
  notAvailableButtonTitle: string
  useUnitMultiplier?: boolean
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean
    taxesLabel?: string
  }
  invalidQuantityToastLabels?: {
    title?: string
    message?: string
  }
  loadingLabel?: string
}

export default function ProductDetailsInfo({
  product,
  buyButtonTitle,
  isValidating,
  quantity,
  setQuantity,
  buyButtonIcon: {
    icon: buyButtonIconName,
    alt: buyButtonIconAlt,
  },
  notAvailableButtonTitle,
  useUnitMultiplier = false,
  taxesConfiguration,
  invalidQuantityToastLabels,
  loadingLabel,
}: ProductDetailsInfoProps) {
  const {
    pushToast,
  } = useUI()

  const {
    id,
    sku,
    gtin,
    unitMultiplier,
    name: variantName,
    brand,
    isVariantOf,
    isVariantOf: {
      skuVariants,
    },
    image: productImages,
    additionalProperty,

    offers: {
      offers: [
        {
          availability,
          price,
          priceWithTaxes,
          listPrice,
          seller,
          listPriceWithTaxes,
        },
      ],
    },
  } = product

  

  /**
   * Preço que será exibido na PDP.
   *
   * Quando a configuração de impostos
   * estiver ativa, usamos os valores
   * com impostos retornados pelo produto.
   */
  const currentPrice =
  taxesConfiguration
    ?.usePriceWithTaxes
    ? priceWithTaxes
    : price

const currentListPrice =
  taxesConfiguration
    ?.usePriceWithTaxes
    ? listPriceWithTaxes
    : listPrice

const {
  hasDiscount,
  discountPercentage,
} = getProductDiscount(
  currentPrice,
  currentListPrice
)

  /**
   * Parcelamento principal exibido
   * abaixo do preço.
   */
  const maxInstallment =
    useMemo(
      () =>
        getMaxInterestFreeInstallment(
          product.availableInstallments ??
            []
        ),
      [
        product.availableInstallments,
      ]
    )

  /**
   * Configuração do botão de compra.
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
        image: productImages,
        brand,
        isVariantOf,
        additionalProperty,
        unitMultiplier,
      },
    })

  /**
   * Disponibilidade do SKU.
   */
  const outOfStock =
    useMemo(
      () =>
        availability ===
        'https://schema.org/OutOfStock',
      [availability]
    )

  return (
    <div
      className={
        styles.productDetailsInfo
      }
    >
      <div className={styles.pdpCluster}>
        <ProductCluster
          clusters={product.productClusters}
        />
      </div>
      {!outOfStock &&
        (
          isValidating ? (
            <UISkeleton
              size={{
                width: '100%',
                height: '50px',
              }}
            />
          ) : (
            <section
              data-fs-product-details-values
            >
              <div
                data-fs-product-details-values-wrapper
              >
                {DISCOUNT_PERCENTAGE &&
                  hasDiscount && (
                    <span
                      className={
                        styles.discountPercentage
                      }
                      data-fs-product-discount-percentage
                    >
                      {discountPercentage}% OFF
                    </span>
                  )}
                <ProductPrice
                  variant="pdp"
                  price={currentPrice}
                  listPrice={currentListPrice}
                  installment={maxInstallment}
                  taxesLabel={taxesConfiguration?.usePriceWithTaxes ? taxesConfiguration.taxesLabel : undefined}
                />
              </div>
            </section>
          )
        )}

      {skuVariants && (
        <SkuVariations
          skuVariants={
            skuVariants
          }
        />
      )}

      {isValidating ? (
        <AddToCartLoadingSkeleton
          loadingLabel={
            loadingLabel
          }
        />
      ) : outOfStock ? (
        <NotAvailableButton>
          {
            notAvailableButtonTitle
          }
        </NotAvailableButton>
      ) : (
        <div
          data-fs-product-actions
        >
          <QuantitySelector
            min={1}
            max={10}
            unitMultiplier={
              useUnitMultiplier
                ? unitMultiplier ??
                  1
                : 1
            }
            useUnitMultiplier={
              useUnitMultiplier
            }
            onChange={
              setQuantity
            }
            onValidateBlur={(
              min: number,
              maxValue: number,
              qty: number
            ) => {
              pushToast({
                title:
                  invalidQuantityToastLabels
                    ?.title,

                message:
                  invalidQuantityToastLabels
                    ?.message
                    ?.replace(
                      '%{min}',
                      min.toString()
                    )
                    ?.replace(
                      '%{max}',
                      maxValue.toString()
                    )
                    ?.replace(
                      '%{quantity}',
                      qty.toString()
                    ) ?? '',

                status:
                  'INFO',

                icon: (
                  <Icon
                    name="CircleWavyWarning"
                    width={30}
                    height={30}
                  />
                ),
              })
            }}
          />

          <BuyButton
            icon={
              <Icon
                name={
                  buyButtonIconName
                }
                aria-label={
                  buyButtonIconAlt
                }
              />
            }
            {...buyProps}
            data-fs-buy-button
          >
            {buyButtonTitle}
          </BuyButton>
        </div>
      )}

      {!outOfStock &&
        !isValidating && (
          <ShippingSimulation
            productShippingInfo={{
              id: sku,
              quantity,
              seller:
                seller.identifier,
            }}
          />
        )}
    </div>
  )
}