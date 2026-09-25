import { useEffect, useMemo, useRef, useState } from 'react'

import type { TabItem } from '../types'

export const useTabs = (items: TabItem[], defaultActiveId?: string) => {
  const enabledItems = useMemo(
    () => items.filter((item) => !item.disabled),
    [items]
  )

  const initialActiveId =
    defaultActiveId &&
    enabledItems.some((item) => item.id === defaultActiveId)
      ? defaultActiveId
      : enabledItems[0]?.id ?? ''

  const [activeId, setActiveId] = useState(initialActiveId)

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    const activeStillExists = enabledItems.some(
      (item) => item.id === activeId
    )

    if (!activeStillExists) {
      setActiveId(enabledItems[0]?.id ?? '')
    }
  }, [activeId, enabledItems])

  const activeItem = items.find((item) => item.id === activeId)

  const handleChange = (id: string, onChange?: (activeId: string) => void) => {
    setActiveId(id)
    onChange?.(id)
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
    onChange?: (activeId: string) => void
  ) => {
    if (!enabledItems.length) return

    const currentItem = items[currentIndex]

    const enabledIndex = enabledItems.findIndex(
      (item) => item.id === currentItem.id
    )

    let nextEnabledIndex = enabledIndex

    switch (event.key) {
      case 'ArrowRight':
        nextEnabledIndex = (enabledIndex + 1) % enabledItems.length
        break

      case 'ArrowLeft':
        nextEnabledIndex =
          (enabledIndex - 1 + enabledItems.length) % enabledItems.length
        break

      case 'Home':
        nextEnabledIndex = 0
        break

      case 'End':
        nextEnabledIndex = enabledItems.length - 1
        break

      default:
        return
    }

    event.preventDefault()

    const nextItem = enabledItems[nextEnabledIndex]
    const nextOriginalIndex = items.findIndex(
      (item) => item.id === nextItem.id
    )

    handleChange(nextItem.id, onChange)
    buttonRefs.current[nextOriginalIndex]?.focus()
  }

  return {
    activeId,
    activeItem,
    buttonRefs,
    handleChange,
    handleKeyDown,
  }
}
