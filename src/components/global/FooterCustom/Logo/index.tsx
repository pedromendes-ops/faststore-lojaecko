import Link from 'next/link'
import { Image } from 'src/components/ui/Image'
import styles from './Logo.module.scss'

type Props = {
    logo?: string
}

export function Logo({    
    logo = '',

}: Props) {
    if (!logo) {
        return null
    }

    return (
        <div className={styles.logo}>
            <Image
                src={logo}
                alt='Logo'
                width='198'
                height='32'
                loading="eager"
            />
        </div>
    )
}