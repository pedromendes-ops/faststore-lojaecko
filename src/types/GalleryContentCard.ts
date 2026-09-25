export interface GalleryContentCard {
  active?: boolean
  position: number

  image?: string
  imageMobile?: string
  imageAlt?: string

  title?: string
  text?: string

  link?: string
  linkLabel?: string
  target?: "_self" | "_blank"

  columnsDesktop?: 1 | 2 | 3
  columnsTablet?: 1 | 2 | 3
  columnsMobile?: 1 | 2

  textPosition?: "below" | "overlay-bottom" | "overlay-center"
  textAlign?: "left" | "center" | "right"
}