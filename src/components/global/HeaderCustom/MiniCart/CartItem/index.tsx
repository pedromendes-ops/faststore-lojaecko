import type {
  AddToCartEvent,
  CurrencyCode,
  RemoveFromCartEvent,
} from '@faststore/sdk'

import {
  CartItemImage as UICartItemImage,
  CartItemSummary as UICartItemSummary,
  IconButton,
  ProductPrice,
} from '@faststore/ui'

import {
  useCallback,
  useMemo,
} from 'react'

import { Image } from 'src/components/ui/Image'

import type { AnalyticsItem } from 'src/sdk/analytics/types'
import type { CartItem as ICartItem } from 'src/sdk/cart'

import { cartStore } from 'src/sdk/cart'
import { useRemoveButton } from 'src/sdk/cart/useRemoveButton'
import { useSession } from 'src/sdk/session'

import { usePriceFormatter } from '../../../../../hooks/usePriceFormatter'

import styles from './CartItem.module.scss'

const MAX_QUANTITY_OPTIONS = 10

type TaxesConfiguration = {
  usePriceWithTaxes?: boolean
  taxesLabel?: string
}

type Props = {
  item: ICartItem
  useUnitMultiplier?: boolean
  taxesConfiguration?: TaxesConfiguration
}

function useCartItemEvent() {
  const {
    currency: { code },
  } = useSession()

  const sendCartItemEvent = useCallback(
    (
      item: Props['item'],
      quantity: number
    ) => {
      const quantityDelta =
        quantity - item.quantity

      if (quantityDelta === 0) {
        return
      }

      import('@faststore/sdk').then(
        ({ sendAnalyticsEvent }) => {
          return sendAnalyticsEvent<
            | AddToCartEvent<AnalyticsItem>
            | RemoveFromCartEvent<AnalyticsItem>
          >({
            name:
              quantityDelta > 0
                ? 'add_to_cart'
                : 'remove_from_cart',

            params: {
              currency:
                code as CurrencyCode,

              value:
                item.price *
                Math.abs(quantityDelta),

              items: [
                {
                  item_id:
                    item.itemOffered
                      .isVariantOf
                      .productGroupID,

                  item_name:
                    item.itemOffered
                      .isVariantOf.name,

                  item_brand:
                    item.itemOffered
                      .brand.name,

                  item_variant:
                    item.itemOffered.sku,

                  quantity:
                    Math.abs(
                      quantityDelta
                    ),

                  price: item.price,

                  discount:
                    item.listPrice -
                    item.price,

                  currency:
                    code as CurrencyCode,

                  item_variant_name:
                    item.itemOffered.name,

                  product_reference_id:
                    item.itemOffered.gtin,
                },
              ],
            },
          })
        }
      )
    },
    [code]
  )

  return useMemo(
    () => ({
      sendCartItemEvent,
    }),
    [sendCartItemEvent]
  )
}

export function CartItem({
  item,
  useUnitMultiplier = false,
  taxesConfiguration,
}: Props) {
  const btnProps =
    useRemoveButton(item)

  const {
    sendCartItemEvent,
  } = useCartItemEvent()

  const formatPrice =
    usePriceFormatter()

  const onQuantityChange =
    useCallback(
      (quantity: number) => {
        if (
          quantity ===
          item.quantity
        ) {
          return
        }

        sendCartItemEvent(
          item,
          quantity
        )

        cartStore.updateItemQuantity(
          item.id,
          quantity
        )
      },
      [
        item,
        sendCartItemEvent,
      ]
    )

  const skuActiveVariants =
  (item?.itemOffered?.isVariantOf
    ?.skuVariants
    ?.activeVariations ?? {}) as Record<string, string>

const activeVariations = Object.entries(
  skuActiveVariants
).map(([label, option]) => ({
  label,
  option,
}))

  const price =
    taxesConfiguration
      ?.usePriceWithTaxes
      ? item.priceWithTaxes
      : item.price

  const listPrice =
    taxesConfiguration
      ?.usePriceWithTaxes
      ? item.listPriceWithTaxes
      : item.listPrice

  const unitMultiplier =
    item.itemOffered
      .unitMultiplier ?? 1

  const maxQuantity =
    Math.max(
      MAX_QUANTITY_OPTIONS,
      item.quantity
    )

  const quantityOptions =
    useMemo(
      () =>
        Array.from(
          {
            length:
              maxQuantity,
          },
          (_, index) =>
            index + 1
        ),
      [maxQuantity]
    )

  const displayPrice =
    useUnitMultiplier
      ? price * unitMultiplier
      : price

  const displayListPrice =
    useUnitMultiplier
      ? listPrice *
        unitMultiplier
      : listPrice

  return (
    <article className={styles.cartItem}      
      data-sku={item.itemOffered.sku}
      data-seller={item.seller.identifier}
    >
      <div className={styles.content}>
        <div className={styles.image}>
          <Image
            src={
              item.itemOffered
                .image?.[0]?.url ??
              ''
            }
            alt={
              item.itemOffered
                .image?.[0]
                ?.alternateName ??
              item.itemOffered.name
            }
            width={56}
            height={56}
          />
        </div>

        <div className={styles.summary}>
          <UICartItemSummary
            title={
              item.itemOffered
                .isVariantOf.name
            }
            activeVariations={
              activeVariations
            }
          />

          <div className={styles.actions}>
            <select
              className={styles.quantity}              
              aria-label="Quantidade"
              value={item.quantity}
              onChange={(event) =>
                onQuantityChange(
                  Number(
                    event.target.value
                  )
                )
              }
            >
              {quantityOptions.map(
                (quantity) => (
                  <option
                    key={quantity}
                    value={quantity}
                  >
                    {useUnitMultiplier
                      ? quantity *
                        unitMultiplier
                      : quantity}
                  </option>
                )
              )}
            </select>
            <ProductPrice
              listPrice={displayListPrice}
              value={displayPrice}
              formatter={formatPrice}
            />
          </div>
        </div>
      </div>

      <IconButton
        className={
          styles.removeButton
        }        
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4h12M6.5 4V2.5h3V4M12.5 4l-.6 9a1 1 0 0 1-1 1H5.1a1 1 0 0 1-1-1L3.5 4M6.5 7v4M9.5 7v4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        aria-label="Remover produto"
        {...btnProps}
      />
    </article>
  )
}

export default CartItem