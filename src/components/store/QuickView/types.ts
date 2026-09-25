export interface QuickViewProps {
  isOpen: boolean
  onClose: () => void

  product: {
    id: string
    name: string
    slug: string
  }
}