import styles from './Copyright.module.scss'

type Props = {
    copyright?: string
}

export function Copyright({
    copyright = 'Todos os direitos reservados',

}: Props) {
    if (!copyright) {
        return null
    }

    return (
        <div className={styles.copyright}>
            <p>{copyright}</p>
        </div>
    )
}