export interface GalleryContentImage {
  image?: string
  imageMobile?: string
  imageAlt?: string
  link?: string
  linkLabel?: string
  target?: "_self" | "_blank"
}

export interface GalleryContentCard {
  active?: boolean
  position: number
  images?: GalleryContentImage[]
  title?: string
  text?: string
  columnsDesktop?: 1 | 2 | 3
  columnsTablet?: 1 | 2 | 3
  columnsMobile?: 1 | 2
  textPosition?: "below" | "overlay-bottom" | "overlay-center"
  textAlign?: "left" | "center" | "right"
}