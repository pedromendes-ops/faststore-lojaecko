import Link from 'next/link'
import { Countdown } from '../../ui/Countdown'
import { toCssIdentifier } from '../../../utils/toCssIdentifier'
import type {TitleSectionProps,} from './types'
import styles from './TitleSection.module.scss'

import MOCK_PROPS from './mock'
const USE_LOCAL_MOCK = true

export const TitleSection = (props: TitleSectionProps) => {
    
    const data = USE_LOCAL_MOCK ? MOCK_PROPS : props
    
    const config = data.config ?? {}
    const content = data.content ?? {}

    const isActive = config.active ?? true
    const text = content.text

    const sectionLabel = toCssIdentifier(config?.label)

    if (!isActive || !text) {
        return null
    }

    const Tag = config.tag ?? 'h2'
    const align = config.align ?? 'left'
    const countdown = content.countdown
    const link = content.link
    const hasCountdown = Boolean(countdown?.active && countdown.endDate)
    const hasLink = Boolean(link?.href && link.text)

    return (
        <section            
            aria-label={config?.label || 'Title Section'}
            className={styles.titleText} data-fs-section="title-section" data-fs-section-label={sectionLabel || undefined}        
            style={config?.marginTop ? { marginTop: config.marginTop } : undefined}
        >
            <div className="wrap">
                <div className={config?.grid}>
                    <div className={`${styles.content} ${styles[align]}`}>
                        <Tag className={styles.title}>
                            {content.text}
                        </Tag>

                        {(hasCountdown || hasLink) && (
                            <div className={styles.actions}>
                                {hasCountdown && (
                                    <Countdown
                                        endDate={content.countdown?.endDate as string}
                                        label={content.countdown?.label}
                                    />
                                )}

                                {hasLink && (
                                    <Link
                                        href={content.link?.href as string}
                                        target={content.link?.target ?? '_self'}
                                        rel={content.link?.target === '_blank' ? 'noopener noreferrer' : undefined}
                                        className={styles.link}
                                    >
                                        {content.link?.text}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TitleSection