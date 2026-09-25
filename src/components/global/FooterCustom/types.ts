export type LabelsPropsItem = {
    label: string
    image: string
    url: string    
}

export type LabelsProps = {
  title?: string
  showTitle?: boolean
  items?: LabelsPropsItem[]
}

export type MenuLink = {
  text?: string
  url?: string
  target?: '_self' | '_blank'
}

export type MenuGroup = {
  titleGroup?: string
  footerLinks?: MenuLink[]
}

export type MenuProps = {
    phoneSanfona?: boolean,
    items?: MenuGroup[]
}

export type FooterCustomProps = {
    menu: MenuProps
    logo?: string
    socialMedia?: LabelsProps
    copyright?: string
    payments?: LabelsPropsItem
    security?: LabelsProps
    powerBy?: LabelsProps
}