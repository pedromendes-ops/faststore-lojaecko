import styles from './Tabs.module.scss'
import type { TabsProps } from './types'
import { useTabs } from './hooks/useTabs'
import { useTabsStyle } from './hooks/useTabsStyle'

export const Tabs = ({
  items,
  defaultActiveId,
  ariaLabel = 'Abas de conteúdo',
  className = '',
  onChange,
  desktop,
  mobile,
}: TabsProps) => {
  const { activeId, activeItem, buttonRefs, handleChange, handleKeyDown } =
    useTabs(items, defaultActiveId)
  const { style } = useTabsStyle(desktop, mobile)

  if (!items.length || !activeItem) return null

  return (
    <div className={`${styles.tabs} ${className}`} style={style}>
      <div className={styles.tabList} role="tablist" aria-label={ariaLabel}>
        {items.map((item, index) => {
          const isActive = item.id === activeId

          return (
            <button
              key={item.id}
              ref={(element) => {
                buttonRefs.current[index] = element
              }}
              id={`tab-${item.id}`}
              type="button"
              role="tab"
              className={`${styles.tabButton} ${
                isActive ? styles.active : ''
              }`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={item.disabled}
              onClick={() => handleChange(item.id, onChange)}
              onKeyDown={(event) => handleKeyDown(event, index, onChange)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {items.map((item) => {
        const isActive = item.id === activeId

        return (
          <div
            key={item.id}
            id={`tabpanel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            tabIndex={0}
            hidden={!isActive}
            className={styles.tabPanel}
          >
            {isActive && item.content}
          </div>
        )
      })}
    </div>
  )
}

export default Tabs
