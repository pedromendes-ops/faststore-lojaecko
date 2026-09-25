import Link from 'next/link'
import { Image } from 'src/components/ui/Image'
import useScreenResize from 'src/sdk/ui/useScreenResize'

import styles from './CardPost.module.scss'

type CardItem = {
  image?: string
  imageMobile?: string
  title?: string
  linkText?: string
  href?: string
  target?: '_self' | '_blank'
}

type Props = {
  title?: string
  items?: CardItem[]
}

const defaultItems: CardItem[] = [
  {
    image: '/arquivos/card-01.jpg',
    title: '#NomeColeção',
    linkText: 'Shop Now',
    href: '/',
    target: '_self',
  },
]

export function CardPost({
  title = "DESCUBRA O MELHOR DA LEVI'S®",
  items = [],
}: Props) {
  const { isDesktop } = useScreenResize()
  const cards = items.length ? items : defaultItems

  return (
    <section className={styles.cardPost}>
      <div className="wrap">        
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.list}>
          {cards.map((item, index) => {
            const imageSrc =
              !isDesktop && item.imageMobile
                ? item.imageMobile
                : item.image

            return (
              <article
                key={`${item.title}-${index}`}
                className={styles.card}
              >
                {imageSrc && (
                  <Link
                    href={item.href || '#'}
                    target={item.target || '_self'}
                    className={styles.imageLink}
                  >
                    <Image
                      src={imageSrc}
                      alt={item.title || `Card ${index + 1}`}
                      width={420}
                      height={520}
                      className={styles.image}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </Link>
                )}

                {item.title && (
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                )}

                {item.linkText && (
                  <Link
                    href={item.href || '#'}
                    target={item.target || '_self'}
                    className={styles.cardLink}
                  >
                    {item.linkText}
                  </Link>
                )}
              </article>
            )
          })}
        </div>        
      </div>
    </section>
  )
}

export default CardPost