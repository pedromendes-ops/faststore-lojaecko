import { useDevice } from '../../../hooks/useDevice'
import type { TabsStyleConfig } from '../types'

export const useTabsStyle = (
  desktop?: TabsStyleConfig,
  mobile?: TabsStyleConfig
) => {
  const { isDesktop } = useDevice()

  const config = isDesktop ? desktop : mobile

  const style = {
    '--tab-title-font-size':
      config?.titleFontSize !== undefined
        ? `${config.titleFontSize}px`
        : undefined,
    '--tab-title-margin-top':
      config?.titleMarginTop !== undefined
        ? `${config.titleMarginTop}px`
        : undefined,
    '--tab-content-margin-top':
      config?.contentMarginTop !== undefined
        ? `${config.contentMarginTop}px`
        : undefined,
  } as React.CSSProperties

  return { style }
}
