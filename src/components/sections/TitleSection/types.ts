export type TitleSectionLink = {
  text?: string
  href?: string
  target?: '_blank' | '_self'
}

export type TitleSectionTimeout = {
  active?: boolean
  endDate?: string
  label?: string
}

export type TitleSectionProps = {
  config: {
    label?: string
    active?: boolean
    grid?: 'container' | 'full'
    marginTop?: number
    tag?: 'h1' | 'h2' | 'h3' | 'h4'
    align?: 'left' | 'center' | 'right' | 'between'
  }
  content: {
    text?: string  
    countdown?: TitleSectionTimeout
    link?: TitleSectionLink
  }
}