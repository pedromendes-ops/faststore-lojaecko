import { Image } from 'src/components/ui/Image'

import type {PitBarItem, PitBarProps} from './types'

import styles from './PitBar.module.scss'

import MOCK_PROPS from './mock'
const USE_LOCAL_MOCK = true

export const PitBar = (props: PitBarProps) => {
    
    const data = USE_LOCAL_MOCK ? MOCK_PROPS : props    
    const config = data?.config ?? {}    
    const items = data.items ?? []

    if (!items.length) {
        return null
    }

    const content = (item: PitBarItem) => {

        const image = (
            <Image
                src={item.image}
                alt={item.alt ?? ''}
                width={60}
                height={60}
            />
        )
        const text = (
            <div className={styles.text}>                
                <p dangerouslySetInnerHTML={{__html: item.line1 ?? ''}} />
            </div>
        )

        return (
            <div className={styles.card}>
                <div className={styles.image}>
                    {image}
                </div>
                {text}
            </div>
        )
    }

  return (
    <section
      aria-label={config?.label ?? 'Incentivos'}
      className={styles.pitbar}
      style={{ background: config.background ?? '#fff', marginTop: config.marginTop ?? 0 }}
    >
        <div className="wrap">
            <div className={config?.grid}>
                <div className={styles.incentives}>
                    {items.map((item, index) => (
                        <div
                            key={`pitbar-${index}`}                            
                        >
                            {content(item)}
                        </div>
                        )
                    )}
                </div>
            </div>
        </div>
    </section>
  )
}

export default PitBar