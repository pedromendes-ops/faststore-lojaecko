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
  activeButton?: boolean
  cards?: PromoItem[]
}