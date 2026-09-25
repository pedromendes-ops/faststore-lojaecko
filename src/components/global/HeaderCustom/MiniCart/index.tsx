import dynamic from 'next/dynamic'

import type {ButtonProps, CartSidebarProps as UICartSidebarProps} from '@faststore/ui'

import type { CurrencyCode, ViewCartEvent } from '@faststore/sdk'
import { Icon, useFadeEffect, useUI } from '@faststore/ui'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react'

import { useCart } from 'src/sdk/cart'
import { useCheckoutButton } from 'src/sdk/cart/useCheckoutButton'
import { useSession } from 'src/sdk/session'

import type { MiniCartProps } from '../types'
import { CartIcon } from '../header.icons'
import coreStyles from 'src/components/cart/CartSidebar/section.module.scss'
import styles from './MiniCart.module.scss'

const UIButton = dynamic<ButtonProps>(
  () =>
    import('@faststore/ui').then(
      (mod) => mod.Button
    ),
  { ssr: false }
)

const UICartSidebarFooter = dynamic<{
  children: ReactNode
}>(
  () =>
    import('@faststore/ui').then(
      (mod) => mod.CartSidebarFooter
    ),
  { ssr: false }
)

const UICartSidebarList = dynamic<{
  children: ReactNode
}>(
  () =>
    import('@faststore/ui').then(
      (mod) => mod.CartSidebarList
    ),
  { ssr: false }
)

const UICartSidebar = dynamic<UICartSidebarProps>(
  () =>
    import('@faststore/ui').then(
      (mod) => mod.CartSidebar
    ),
  { ssr: false }
)

const EmptyCart = dynamic(
  () => import('./EmptyCart'),
  { ssr: false }
)

const Gift = dynamic(
  () => import('src/components/ui/Gift'),
  { ssr: false }
)

const CartItem = dynamic(
  () => import('./CartItem'),
  { ssr: false }
)

const OrderSummary = dynamic(
  () => import('./OrderSummary'),
  { ssr: false }
)

const RulerMinicart = dynamic(
  () => import('./RulerMinicart'),
  { ssr: false }
)

function useViewCartEvent() {
  const {
    currency: { code },
  } = useSession()

  const {
    items: itemsFromCart,
    gifts: giftsFromCart,
    total,
  } = useCart()

  const gifts = JSON.stringify(giftsFromCart)
  const items = JSON.stringify(itemsFromCart)

  const sendViewCartEvent = useCallback(() => {
    import('@faststore/sdk').then(
      ({ sendAnalyticsEvent }) => {
        return sendAnalyticsEvent<ViewCartEvent>({
          name: 'view_cart',
          params: {
            currency: code as CurrencyCode,
            value: total,

            items: itemsFromCart
              .concat(giftsFromCart)
              .map((item) => ({
                item_id:
                  item.itemOffered.isVariantOf
                    .productGroupID,

                item_name:
                  item.itemOffered.isVariantOf.name,

                item_brand:
                  item.itemOffered.brand.name,

                item_variant:
                  item.itemOffered.sku,

                quantity: item.quantity,

                price: item.price,

                discount:
                  item.listPrice - item.price,

                currency:
                  code as CurrencyCode,

                item_variant_name:
                  item.itemOffered.name,

                product_reference_id:
                  item.itemOffered.gtin,
              })),
          },
        })
      }
    )
  }, [
    code,
    gifts,
    items,
    total,
    itemsFromCart,
    giftsFromCart,
  ])

  return useMemo(
    () => ({
      sendViewCartEvent,
    }),
    [sendViewCartEvent]
  )
}

function MiniCartSidebar({
  title = 'Carrinho',

  alert = {
    icon: {
      icon: 'ShoppingCart',
      alt: 'Carrinho',
    },
    text: '',
  },

  emptyCart = {
    title: 'Seu carrinho está vazio',
    buttonLabel: 'Continuar comprando',
  },

  checkoutButton = {
    label: 'Finalizar compra',
    loadingLabel: 'Carregando...',
    icon: {
      icon: 'ArrowRight',
      alt: '',
    },
  },

  quantitySelector = {
    useUnitMultiplier: false,
  },

  taxesConfiguration = {
    usePriceWithTaxes: false,
  },

  rulerMinicart,
}: MiniCartProps) {
  const btnProps = useCheckoutButton()

  const {
    items,
    gifts,
    totalItems,
    isValidating,
    subTotal,
    total,
    subTotalWithTaxes,
    totalWithTaxes,
  } = useCart({
    useUnitMultiplier:
      quantitySelector?.useUnitMultiplier ??
      false,
  })

  const {
    cart: displayCart,
    closeCart,
  } = useUI()

  const { fadeOut } = useFadeEffect()

  const { sendViewCartEvent } =
    useViewCartEvent()

  const isEmpty = items.length === 0

  useEffect(() => {
    if (!displayCart) {
      return
    }

    sendViewCartEvent()
  }, [
    displayCart,
    sendViewCartEvent,
  ])

  if (!displayCart) {
    return null
  }

  return (
    <UICartSidebar
      overlayProps={{
        className: [
          'section',
          coreStyles.section,
          'section-cart-sidebar',
          styles.sidebar,
        ]
          .filter(Boolean)
          .join(' '),
      }}
      title={title}
      totalItems={totalItems}
      alertIcon={
        alert?.icon?.icon ? (
          <Icon
            name={alert.icon.icon}
            aria-label={
              alert.icon.alt ?? ''
            }
          />
        ) : undefined
      }
      alertText={alert?.text}
      onClose={fadeOut}
    >
      {isEmpty ? (
        <EmptyCart
          title={emptyCart?.title}
          buttonLabel={emptyCart?.buttonLabel}
          onDismiss={closeCart}
        />
      ) : (
        <>
          <ul className={styles.cartItems}>
            {items.map((item) => (
              <li
                key={item.id}                
              >
                <CartItem
                  item={item}
                  taxesConfiguration={
                    taxesConfiguration
                  }
                  useUnitMultiplier={
                    quantitySelector
                      ?.useUnitMultiplier ??
                    false
                  }
                />
              </li>
            ))}

            {gifts.map((item) => (
              <li key={item.id}>
                <Gift item={item} />
              </li>
            ))}
          </ul>

          <UICartSidebarFooter>
            <RulerMinicart
              total={
                taxesConfiguration?.usePriceWithTaxes
                  ? totalWithTaxes
                  : total
              }
              {...rulerMinicart}
            />

            <OrderSummary
              subTotal={
                taxesConfiguration
                  ?.usePriceWithTaxes
                  ? subTotalWithTaxes
                  : subTotal
              }
              total={
                taxesConfiguration
                  ?.usePriceWithTaxes
                  ? totalWithTaxes
                  : total
              }
              includeTaxes={
                taxesConfiguration
                  ?.usePriceWithTaxes
              }
              includeTaxesLabel={
                taxesConfiguration
                  ?.taxesLabel
              }              
              checkoutButton={
                <UIButton
                  variant="primary"
                  icon={
                    !isValidating &&
                    checkoutButton?.icon
                      ?.icon ? (
                      <Icon
                        name={
                          checkoutButton
                            .icon.icon
                        }
                        aria-label={
                          checkoutButton
                            .icon.alt ??
                          ''
                        }
                        width={18}
                        height={18}
                      />
                    ) : undefined
                  }
                  iconPosition="right"
                  {...btnProps}
                >
                  {isValidating
                    ? checkoutButton
                        ?.loadingLabel
                    : checkoutButton
                        ?.label}
                </UIButton>
              }
            />
          </UICartSidebarFooter>
        </>
      )}
    </UICartSidebar>
  )
}

export function MiniCart(
  props: MiniCartProps
) {
  const {
    openCart,
  } = useUI()

  const {
    totalItems,
  } = useCart()

  return (
    <div className={styles.miniCart}>
      <button
        type="button"        
        className={`flex center relative pointer ${styles.miniCartButton}`}
        onClick={openCart}
        aria-label={`Abrir carrinho${
          totalItems > 0
            ? ` com ${totalItems} ${
                totalItems === 1
                  ? 'item'
                  : 'itens'
              }`
            : ''
        }`}
      >
        <CartIcon />

        {/* totalItems > 0 && ( */}
          <span
            className={`flex center absolute top0 right0 circle ${styles.miniCartQuantity}`}            
            aria-hidden="true"
          >
            {totalItems}
          </span>
        {/* )}  */}
      </button>

      <MiniCartSidebar {...props} />
    </div>
  )
}