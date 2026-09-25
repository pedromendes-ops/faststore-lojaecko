export type CompleteCardLink = {
  linkText?: string
  urlLinkText?: string
  styleLinkText?: 'button' | 'link'
  targetLinkText?: '_self' | '_blank'
  fontSizeLink?: string
  fontSizeLinkPhone?: string
  colorLinkText?: string
  backgroundLinkText?: string
  borderLinkText?: boolean
  borderWidth?: '1px' | '2px' | '3px'
  borderColorLinkText?: string
  strongLink?: boolean
  radiusButton?: string
}

export type CompleteCardItem = {
  showBanner?: boolean
  fileBanner?: string
  fileBannerPhone?: string
  altBanner?: string
  linkBanner?: string
  targetLinkBanner?: string
  hoverZoom?: boolean
  heightBanner?: string
  widthBanner?: string
  heightBannerPhone?: string
  widthBannerPhone?: string
  orderText?: 'left' | 'right' | 'top' | 'bottom'
  orderTextPhone?: 'left' | 'right' | 'top' | 'bottom'
  paddingRightText?: string
  paddingLeftText?: string
  paddingTopText?: string
  paddingBottomText?: string
  maxWidthText?: string
  backgroundBoxText?: string
  rowMarginText?: string
  coloText?: string
  showText?: boolean
  styleText?: 'absolute' | 'relative'
  positionText?:
    | 'left-bottom'
    | 'right-bottom'
    | 'center-bottom'
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'center-left'
    | 'center-right'
    | 'center-center'

  alignText?: 'left' | 'right' | 'center' | 'justify'
  alignTextPhone?: boolean
  texts?: CompleteCardText[]
  links?: CompleteCardLink[]
  directionLinks?: 'row' | 'column' | 'columns'
  positionLink?: 'bottom' | 'right'
}

export type CompleteCardProps = {
  active?: boolean
  hasTitle?: boolean
  textTitle?: string
  sizeTitle?: 'large' | 'medium' | 'small'
  sectionLabel?: string
  layoutDesktop?: 'slider' | 'grid'
  columnsDesktop?: string
  layoutTablet?: 'slider' | 'grid'
  columnsTablet?: string
  layoutPhone?: 'slider' | 'grid'
  columnsPhone?: string
  paddingPx?: string
  paddingPxPhone?: string
  marginTopSection?: string
  marginTopSectionPhone?: string
  customClassSection?: string
  areaSection?: 'container' | 'full'
  borderContainer?: string
  borderWidth?: string
  paddingBorder?: string
  maxWidthSection?: string
  cards?: CompleteCardItem[]
}

export type CompleteCardText = {
  magingBottomText?: string
  coloText?: string
  fontSizeText?: string
  fontSizeTextPhone?: string
  rowGapText?: string
  strongText?: 'default' | '300' | '400' | '500' | '600' | '700'
  contentText?: string
}