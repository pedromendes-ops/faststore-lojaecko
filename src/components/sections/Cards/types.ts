export type CardsMediaType =
  | 'image'
  | 'video'

export type CardsLinks = {
  name?: string
  value?: string
}

export type CardsItem = {
  active?: boolean

  mediaType?: CardsMediaType

  image?: string
  imageMobile?: string

  video?: string
  videoMobile?: string

  alt?: string  
  text?: string
  alignLinks?: 'flex-start' | 'center' | 'flex-end'
  link?: CardsLinks[]

  href?: string
  target?: '_self' | '_blank'
}

export type CardsLayoutType =
  | 'slider'
  | 'grid'

export type CardsSliderAlign =
  | 'default'
  | 'center'
  | 'container-start'

export type CardsProps = {
  config?: {
    label?: string
    active?: boolean
    grid?: 'container' | 'full'
    marginTop?: number
    priority?: boolean

    layout?: {
      desktop?: CardsLayoutType
      columnsDesktop?: number
      heightDesktop?: number

      tablet?: CardsLayoutType
      columnsTablet?: number
      heightTablet?: number

      phone?: CardsLayoutType
      columnsPhone?: number
      heightPhone?: number

      gap?: number
      position?: 'inner' | 'out'
    }

    style?: {
      background?: string
      radius?: boolean
    }

    slider?: {
      align?: {
        desktop?: CardsSliderAlign
        tablet?: CardsSliderAlign
        phone?: CardsSliderAlign
      }

      peek?: {
        desktop?: number
        tablet?: number
        phone?: number
      }

      showDots?: boolean
      showArrows?: boolean
      infiniteMode?: boolean
      autoPlay?: boolean
      autoPlayInterval?: number
    }
  }

  items?: CardsItem[]
}