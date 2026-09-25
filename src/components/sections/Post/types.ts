export type PostLayout =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'

export type PostProps = {
  config?: {    
    label?: string
    grid?: 'container' | 'full'
    marginTop?: number        
    active?: boolean
  }
  layout?: {
    desktop?: PostLayout
    tablet?: PostLayout
    phone?: PostLayout
    gap?: number
  }
  content?: {
    imageSrc?: string
    imageAlt?: string
    text?: string
    linkText?: string
    linkHref?: string
    linkTarget?: '_self' | '_blank'
    linkStyle?: 'link' | 'button'
  }
}