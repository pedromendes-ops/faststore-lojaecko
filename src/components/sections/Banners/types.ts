
export type BannersItem = {
  active?: boolean

  image?: string
  imageMobile?: string

  alt?: string

  href?: string
  target?: '_self' | '_blank'
}

export type BannersLayoutType =
  | 'slider'
  | 'grid'

export type BannersSliderAlign =
  | 'default'
  | 'center'
  | 'container-start'

export type BannersProps = {
  config?: {
    label?: string
    active?: boolean
    grid?: 'container' | 'full'
    marginTop?: number
    priority?: boolean

    layout?: {
      desktop?: BannersLayoutType
      columnsDesktop?: number
      heightDesktop?: number

      tablet?: BannersLayoutType
      columnsTablet?: number
      heightTablet?: number

      phone?: BannersLayoutType
      columnsPhone?: number
      heightPhone?: number

      gap?: number
    }

    style?: {
      zoom?: boolean
      radius?: boolean
      shadow?: boolean
    }

    slider?: {
        align?: {
            desktop?: BannersSliderAlign
            tablet?: BannersSliderAlign
            phone?: BannersSliderAlign
        }

        peek?: {
            desktop?: number
            tablet?: number
            phone?: number
        },

        showDots?: boolean
        showArrows?: boolean
        infiniteMode?: boolean
        autoPlay?: boolean
        autoPlayInterval?: number
    }
  }

  items?: BannersItem[]
}