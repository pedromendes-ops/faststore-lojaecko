import type { CartSidebarProps as UICartSidebarProps } from '@faststore/ui'

export type TopBarItem = {
  text: string
}

export type TopBarProps = {
  items?: TopBarItem[]
  background?: string
  color?: string
}

export type SearchProps = {
  searchButtonDesktop?: boolean
  searchButtonMobile?: boolean
  placeholder?: string
}

export type PromoLink = {
  linkText?: string
  urlLinkText?: string
  targetLinkText?: '_self' | '_blank'
}

export type PromoItem = {
  active?: boolean

  showBanner?: boolean
  fileBanner?: string
  fileBannerPhone?: string
  altBanner?: string
  linkBanner?: string
  targetLinkBanner?: '_self' | '_blank'

  text?: string

  links?: PromoLink[]

  showPolicy?: boolean
  policyText?: string
  policyLink?: string
}

export type PromoDayProps = {
  active?: boolean  
  cards?: PromoItem[]
}

export type WelcomeStateProps = {
  title?: string
  text?: string
}

export type WelcomeProps = {
  showWishlist?: boolean
  logged?: WelcomeStateProps
  anonymous?: WelcomeStateProps
}

export type TaxesConfiguration = {
  usePriceWithTaxes?: boolean
  taxesLabel?: string
}

export type QuantitySelectorConfig = {
  useUnitMultiplier?: boolean
}

export type RulerMinicartType =
  | 'shipping'
  | 'gift'

export type RulerMinicartConfig = {
  enabled?: boolean

  type?: RulerMinicartType

  /**
   * Meta monetária.
   *
   * Ex.:
   * 299.9   -> R$ 299,90
   * 29990 + goalInCents=true -> R$ 299,90
   */
  goal?: number

  /**
   * Indica se `goal` está em centavos.
   */
  goalInCents?: boolean

  /**
   * Use {value} para inserir
   * o valor restante na mensagem.
   *
   * Ex.:
   * "Faltam {value} para ganhar frete grátis"
   */
  progressMessage?: string

  successMessage?: string

  /**
   * Opcional.
   * Quando não informado,
   * será exibido o valor zero formatado.
   */
  startLabel?: string
}

export type MiniCartAlertConfig = {
  icon?: {
    icon?: string
    alt?: string
  }

  text?: UICartSidebarProps['alertText']
}

export type MiniCartEmptyConfig = {
  title?: string
  buttonLabel?: string
}

export type MiniCartCheckoutButtonConfig = {
  label?: string
  loadingLabel?: string

  icon?: {
    icon?: string
    alt?: string
  }
}

export type MiniCartProps = {
  title?: UICartSidebarProps['title']

  alert?: MiniCartAlertConfig

  emptyCart?: MiniCartEmptyConfig

  checkoutButton?: MiniCartCheckoutButtonConfig

  quantitySelector?: QuantitySelectorConfig

  taxesConfiguration?: TaxesConfiguration

  rulerMinicart?: RulerMinicartConfig
}

/**
 * Header
 */

export type HeaderCustomProps = {
  legend?: string
  imageSrc?: string
  topBar?: TopBarProps
  search?: SearchProps
  promoDay?: PromoDayProps
  welcome?: WelcomeProps
  miniCart?: MiniCartProps
}