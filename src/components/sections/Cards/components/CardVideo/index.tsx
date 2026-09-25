import {
  useRef,
  useState,
} from 'react'

import styles from '../../Cards.module.scss'

interface CardVideoProps {
  src: string
}

export function CardVideo({src}: CardVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlay = async () => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (video.paused) {
      try {
        await video.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }

      return
    }

    video.pause()
    setIsPlaying(false)
  }

  return (
    <div className={styles.videoWrapper} data-fs-cards-video>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      <button
        type="button"        
        className={`flex center ${styles.videoControl}`}
        onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            togglePlay()
        }}
        aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
      >
        {isPlaying ? (
          <PauseIcon />
        ) : (
          <PlayIcon />
        )}
      </button>
    </div>
  )
}

function PauseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="4"
        width="3"
        height="12"
        fill="currentColor"
      />

      <rect
        x="12"
        y="4"
        width="3"
        height="12"
        fill="currentColor"
      />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4L16 10L6 16V4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default CardVideo