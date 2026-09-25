
import { Image } from 'src/components/ui/Image'
import styles from './Labels.module.scss'
import type { LabelsPropsItem } from '../types'

export function Payments({    
    image = '',        
    label = ''

}: LabelsPropsItem) {

    if (!image) {
        return null
    }

    const showTitle = false
    const title = 'Formas de pagamento'

    return (
        <div className={`${styles.label} ${styles.payments}`}>
            {showTitle &&
                <p>{title}</p>
            }
            <Image
                src={image}
                alt={label ?? 'Formas de pagamento'}
                width='24'
                height='100'
            />
        </div>
    )
}