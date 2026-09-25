import { useState } from 'react'
import { Viewer } from '../../ui/viewer'
import styles from './AboutText.module.scss'

import type {AboutTextProps } from './types'

import MOCK_PROPS from './mock'
const USE_LOCAL_MOCK = false

export const AboutText = (props: AboutTextProps) => {

    const data = USE_LOCAL_MOCK ? MOCK_PROPS : props
    const config = data?.config ?? {}
    const [isOpen, setIsOpen] = useState(false)

    if (!config.active) {
        return null
    }

    const hasShortText = Boolean(data.shortText)
    const hasLongText = Boolean(data.longText)

    const content = (        
        <div className={styles.footerCtAbout}>
            {data.title && (
                <h1 className={styles.title}>{data.title}</h1>
            )}

            {hasShortText ? (
                <>
                    {/*
                    <p className={styles.shortText}>
                        {data.shortText}
                    </p>
                    */}

                    {hasLongText && (
                    <>
                        
                            <div className={`${styles.resume} ${styles.longText} ${
                                isOpen
                                    ? styles.aboutTextOpen
                                    : ''
                                }`}>
                                <Viewer value={data.longText ?? ''}/>
                            </div>
                        
                        <button
                            type="button"
                            className={styles.toggleButton}
                            onClick={() =>
                                setIsOpen(
                                (current) =>
                                    !current
                                )
                            }
                            aria-expanded={isOpen}
                        >
                            <span>{isOpen ? 'Veja menos' : 'Veja mais'}</span>
                            <span
                                className={`${styles.aboutIcon} ${
                                isOpen
                                    ? styles.aboutIconOpen
                                    : ''
                                }`}
                                aria-hidden="true"
                            >
                                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                                    <path d="M16 1.42004L8 9.42004L0 1.42004L1.42 0.0000438069L8 6.58004L14.58 0.0000432317L16 1.42004Z" fill="currentColor" />
                                </svg>
                            </span>
                        </button>
                    </>
                    )}
                </>
            ) : (
                hasLongText && (
                    <div className={styles.longText}>
                        <Viewer value={data.longText ?? ''}/>
                    </div>
                )
            )}
        </div>
        
    )
    
    
    return (
        <section
            aria-label="Sobre a empresa"
            className={styles.footerAbout}
        >
            <div className="wrap">
                <div className={config?.grid}>
                    {content}
                </div>
            </div>
        </section>
    )
}

export default AboutText