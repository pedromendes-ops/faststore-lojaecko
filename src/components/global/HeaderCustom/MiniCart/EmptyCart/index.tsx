import styles from './EmptyCart.module.scss'

type Props = {
  title?: string
  buttonLabel?: string
  onDismiss?: () => void
}

export function EmptyCart({
  title = 'Seu carrinho está vazio',
  buttonLabel = 'Continuar comprando',
  onDismiss,
}: Props) {
  return (
    <div className={styles.emptyState}>
      <p className={styles.title}>
        {title}
      </p>

      {buttonLabel && (
        <button
          type="button"
          className={styles.button}
          onClick={onDismiss}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyCart