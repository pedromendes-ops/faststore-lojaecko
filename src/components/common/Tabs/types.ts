import type { ReactNode } from 'react'

export type TabItem = {
  id: string
  label: string
  content: ReactNode
  disabled?: boolean
}

export type TabsStyleConfig = {
  titleFontSize?: number
  titleMarginTop?: number
  contentMarginTop?: number
}

export type TabsProps = {
  items: TabItem[]
  defaultActiveId?: string
  ariaLabel?: string
  className?: string
  onChange?: (activeId: string) => void
  desktop?: TabsStyleConfig
  mobile?: TabsStyleConfig
}
