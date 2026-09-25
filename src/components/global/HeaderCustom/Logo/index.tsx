import Link from 'next/link'
import { Image } from 'src/components/ui/Image'
import styles from './Logo.module.scss'

type Props = {
    legend?: string
    imageSrc?: string
}

export function Logo({
    legend = 'Loja',
    imageSrc = '',

}: Props) {
    if (!imageSrc) {
        return null
    }

    return (
        <Link
            href="/"
            className={styles.logo}
            aria-label="Página inicial"
        >
            <Image
                src={imageSrc}
                alt={legend}
                width='198'
                height='32'
                loading="eager"
            />
        </Link>
    )
}