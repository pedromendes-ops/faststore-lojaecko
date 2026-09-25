export const SORT_OPTIONS = {
  price_desc: 'Maior preço',
  price_asc: 'Menor preço',
  orders_desc: 'Mais vendidos',
  name_asc: 'Nome, A-Z',
  name_desc: 'Nome, Z-A',
  release_desc: 'Lançamentos',
  discount_desc: 'Maior desconto',
  score_desc: 'Relevância',
} as const

export type SortOptionKey =
  keyof typeof SORT_OPTIONS

export type SortLayout =
  | 'select'
  | 'custom-select'
  | 'radio'

export interface SortProps {
  label?: string

  layout?: SortLayout
  value?: SortOptionKey
  onChange?: (value: SortOptionKey) => void

  options?: Partial<
    Record<
      SortOptionKey,
      string
    >
  >
}