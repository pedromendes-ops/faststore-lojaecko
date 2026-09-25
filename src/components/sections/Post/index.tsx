import Link from 'next/link'
import { Viewer } from '../../ui/viewer'
import { Image } from 'src/components/ui/Image'
import useScreenResize from '../../../hooks/useScreenResize'
import { toCssIdentifier } from '../../../utils/toCssIdentifier'
import type { PostProps } from './types'

import styles from './Post.module.scss'
import MOCK_PROPS from './mock'

const USE_LOCAL_MOCK = true

export const Post = (props: PostProps) => {
  const { isDesktop, isTablet } = useScreenResize()

  const data = USE_LOCAL_MOCK
    ? MOCK_PROPS
    : props

  const config = data.config ?? {}
  const layout = data.layout ?? {}
  const content = data.content ?? {}

  const sectionLabel = toCssIdentifier(config?.label)

  const isActive = config.active ?? true

  if (!isActive) {
    return null
  }

  const currentLayout = isDesktop
    ? layout.desktop ?? 'left'
    : isTablet
      ? layout.tablet ?? 'bottom'
      : layout.phone ?? 'bottom'

  const gap = layout.gap ?? 16

  const hasImage = Boolean(content.imageSrc)
  const hasText = Boolean(content.text)
  const hasLink = Boolean(
    content.linkText &&
    content.linkHref
  )

  return (
    <section
      aria-label={config?.label || 'Post'}
      className={styles.Post} data-fs-section="post" data-fs-section-label={sectionLabel || undefined}        
      style={config?.marginTop ? { marginTop: config.marginTop } : undefined}
    >
      <div className="wrap">
        <div className={config.grid ?? 'container'}>
          <article
            className={`flex center ${styles[currentLayout]}`}
            style={{ gap }}
          >
            {hasImage && (
              <div className={styles.Image}>
                <Image
                  src={content.imageSrc!}
                  alt={content.imageAlt ?? ''}
                  width={640}
                  height={640}
                  fetchPriority="auto"
                />
              </div>
            )}

            {(hasText || hasLink) && (
              <div className={styles.Text}>
                {hasText && (
                  <Viewer
                    value={content.text ?? ''}
                  />
                )}

                {hasLink && (
                  <Link
                    href={content.linkHref!}
                    target={
                      content.linkTarget ??
                      '_self'
                    }
                    rel={
                      content.linkTarget ===
                      '_blank'
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className={
                      styles[
                        content.linkStyle ??
                          'button'
                      ]
                    }
                  >
                    {content.linkText}
                  </Link>
                )}
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}

export default Post