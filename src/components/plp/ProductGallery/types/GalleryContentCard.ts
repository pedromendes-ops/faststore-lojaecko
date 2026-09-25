
export type GalleryContentCardTextPosition =
  | 'below'
  | 'overlay-bottom'
  | 'overlay-center'

export type GalleryContentCardTextAlign =
  | 'left'
  | 'center'
  | 'right'

export type GalleryContentCardImage = {
  image?: string
  imageMobile?: string
  imageAlt?: string
  link?: string
  linkLabel?: string
  target?: '_self' | '_blank'
}

export type GalleryContentCard = {
  active?: boolean

  /**
   * Posição do banner dentro da grade.
   * Exemplo:
   * position: 4
   * → banner entra na quarta posição.
   */
  position: number

  images?: GalleryContentCardImage[]

  title?: string
  text?: string

  /**
   * Quantas colunas da grid
   * o banner deverá ocupar.
   */
  columnsDesktop?: 1 | 2 | 3 | 4
  columnsTablet?: 1 | 2 | 3
  columnsMobile?: 1 | 2

  textPosition?: GalleryContentCardTextPosition
  textAlign?: GalleryContentCardTextAlign
}