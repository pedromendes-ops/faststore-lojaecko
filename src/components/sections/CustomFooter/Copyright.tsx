import styles from './CustomFooter.module.scss'

type Props = {
  paragraphCopyright?: string
}

export function Copyright({
  paragraphCopyright = '© 2026 LEVI STRAUSS & CO',
}: Props) {
  return (
    <div className={styles.footerCopyright}>
      <p className='uppercase'>{paragraphCopyright}</p>
    </div>
  )
}