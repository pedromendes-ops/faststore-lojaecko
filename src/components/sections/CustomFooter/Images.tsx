import styles from './CustomFooter.module.scss'

type InstagramImage = {
  image?: string
  link?: string
  alt?: string
}

type Props = {
  title?: string
  images?: InstagramImage[]
}

export function Images({
  title = '@levisbrasil',
  images = [],
}: Props) {
  return (
    <section className={styles.footerImages}>
      <h2 className={styles.imagesTitle}>{title}</h2>

      <div  className={`grid ${styles.imagesGrid}`}>
        {images.map((item, index) => {
          if (!item.image) return null

          return (
            <a
              key={`${item.image}-${index}`}
              href={item.link || '#'}
              target={item.link ? '_blank' : undefined}
              rel={item.link ? 'noopener noreferrer' : undefined}
              className={styles.imageLink}
            >
              <img
                src={item.image}
                alt={item.alt || title}
                className={styles.image}
              />
            </a>
          )
        })}
      </div>
    </section>
  )
}