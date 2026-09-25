import Link from 'next/link'
import { Image } from 'src/components/ui/Image'
import styles from './Labels.module.scss'
import type { LabelsProps } from '../types'

export function Powerby({
    title = '',
    showTitle = false,
    items = []

}: LabelsProps) {

    if (!items.length) {
        return null
    }

    return (
        <div className={`${styles.label} ${styles.powerby}`}>
            {showTitle &&
                <p>{title}</p>
            }
            <div className={`flex items-center ${styles.links}`}>
            {items.map((item, index) => (
                <Link
                    key={`by-${index}`}
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.labelLink}
                    aria-label={item.label}
                >
                    <Image
                        src={item.image}
                        alt={item.label}
                        width='24'
                        height='24'
                    />
                </Link>
            ))}
            </div>
        </div>
    )
}