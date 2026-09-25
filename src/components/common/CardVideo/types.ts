export type CardVideoProps = {
  areaSection?: 'container' | 'full'
  maxWidthSection?: string
  marginTopSection?: string
  customClassSection?: string
  sectionLabel?: string

  videoType?: 'youtube' | 'vimeo' | 'mp4'
  videoUrl?: string
  videoUrlPhone?: string
  videoMp4?: string
  videoTitle?: string
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16'
  fullScreenMobile?: boolean

  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
}