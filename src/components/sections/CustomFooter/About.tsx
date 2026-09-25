import { useState } from 'react'
import styles from './CustomFooter.module.scss'
import { ArrowBottom } from "../../icons/common";

type Props = {
  title?: string
  text?: string
}

export function About({
    title = "SOBRE A LEVI'S®",
    text = '',
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

    return (
        <section className={styles.footerAbout}>
            <div className={styles.footerCtAbout}>
                <button
                    type="button"
                    className="flex items-center pointer"
                    onClick={() => setIsOpen((current) => !current)}
                    aria-expanded={isOpen}
                >
                    <span>{title}</span>                    
                    <span
                    className={`
                        flex center no-flex ml-auto
                            ${styles.aboutIcon}
                            ${isOpen ? styles.aboutIconOpen : ''}
                        `}
                    >
                        <ArrowBottom />                        
                    </span>
                </button>

                {isOpen && (
                    <div
                        className={styles.aboutContent}
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                )}
            </div>
        </section>
    )
}