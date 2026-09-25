import { useEffect, useState } from 'react'
import styles from './CardVideo.module.scss'
import type { CardVideoProps } from './types'
import useScreenResize from '../../common/MyScreenResize'

const getYoutubeEmbedUrl = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]*)/
  )

  return match?.[1]
    ? `https://www.youtube.com/embed/${match[1]}`
    : url
}

const getVimeoEmbedUrl = (url: string) => {
  const match = url.match(/vimeo\.com\/(\d+)/)

  return match?.[1]
    ? `https://player.vimeo.com/video/${match[1]}`
    : url
}

export const CardVideo = ({
  areaSection = 'full',
  maxWidthSection,
  marginTopSection = '0',
  customClassSection = '',
  sectionLabel = '',
  videoType = 'youtube',
  videoUrl = '',
  videoUrlPhone = '',
  videoMp4 = '',
  videoTitle = 'Vídeo',
  aspectRatio = '16/9',
  fullScreenMobile = false,
  autoplay = false,
  muted = false,
  loop = false,
  controls = true,
}: CardVideoProps) => {
  const { isDesktop, isMobile } = useScreenResize()

  const isMp4 = videoType === 'mp4'

  // Mobile usa videoUrlPhone quando cadastrado.
  // Caso contrário, utiliza videoUrl como fallback.
  const currentVideoUrl =
    !isDesktop && videoUrlPhone?.trim()
      ? videoUrlPhone
      : videoUrl

  // The configured `aspectRatio` (box shape) doesn't always match the real
  // video's ratio, so Vimeo/YouTube either letterbox it or (with a forced
  // crop) hide their own UI (title, play button, progress bar). Reading the
  // real ratio from Vimeo's oEmbed API and using THAT for the box's height
  // avoids both: no crop needed, so nothing gets hidden, and it still keeps
  // the width full — only the height adapts to the real video's shape.
  const [realRatio, setRealRatio] = useState<{ w: number; h: number } | null>(
    null
  )

  useEffect(() => {
    if (!fullScreenMobile || videoType !== 'vimeo' || !currentVideoUrl) {
      setRealRatio(null)
      return
    }

    let cancelled = false

    fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(currentVideoUrl)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.width && data?.height) {
          setRealRatio({ w: data.width, h: data.height })
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [fullScreenMobile, videoType, currentVideoUrl])

  if (!currentVideoUrl && !videoMp4) {
    return null
  }

  const embedUrl =
    videoType === 'youtube'
      ? getYoutubeEmbedUrl(currentVideoUrl)
      : videoType === 'vimeo'
        ? getVimeoEmbedUrl(currentVideoUrl)
        : currentVideoUrl

  const effectiveAspectRatio =
    fullScreenMobile && isMobile && videoType === 'vimeo' && realRatio
      ? `${realRatio.w}/${realRatio.h}`
      : aspectRatio

  const content = (
    <div
      className={`${styles.wrapper} ${customClassSection}`}
    >
      <div
        className={`${styles.videoBox} ${
          fullScreenMobile ? styles.videoBoxFullScreenMobile : ''
        }`}
        style={{
          aspectRatio: effectiveAspectRatio,
        }}
      >
        {isMp4 ? (
          <video
            className={styles.video}
            src={videoMp4 || currentVideoUrl}
            title={videoTitle}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            controls={controls}
            playsInline
          />
        ) : (
          <iframe
            className={styles.video}
            src={embedUrl}
            title={videoTitle}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    </div>
  )

  if (areaSection === 'container') {
    return (
      <section
        aria-label={sectionLabel || undefined}
        className={styles.section}
        style={{ marginTop: `${marginTopSection}px` }}
      >
        <div className="wrap">
          <div
            className="container"
            style={{
              maxWidth: maxWidthSection
                ? `${maxWidthSection}px`
                : undefined,
            }}
          >
            {content}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-label={sectionLabel || undefined}
      className={styles.section}
      style={{ marginTop: `${marginTopSection}px` }}
    >
      <div className="wrap">
        {content}
      </div>
    </section>
  )
}

export default CardVideo