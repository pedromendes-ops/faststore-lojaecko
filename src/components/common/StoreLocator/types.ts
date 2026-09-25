export type StoreItem = {
  id?: string
  active?: boolean

  name?: string
  address?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  postalCode?: string

  phone?: string

  mapEmbedUrl?: string
}

export type StoreLocatorProps = {
  title?: string
  subtitle?: string
  searchLabel?: string
  searchPlaceholder?: string

  mapButtonText?: string
  emptyText?: string
  areaSection?: 'container' | 'full'
  columnsDesktop?: string
  columnsTablet?: string
  columnsPhone?: string
  

  stores?: StoreItem[]
}