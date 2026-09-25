import {useCallback, useState} from 'react'
import type {MouseEvent} from 'react'
import type {ImageElementData} from '@faststore/ui'

import {resizeVtexImage} from '../../../../utils/productImage'
import styles from '../ImageGallery.module.scss'

interface ZoomImageProps {
  image: ImageElementData
  priority?: boolean
  enabled?: boolean
}

export function ZoomImage({
  image,
  priority = false,
  enabled = true

}: ZoomImageProps) {

    const [isZoomed, setIsZoomed] = useState(false)
    const [position, setPosition] = useState({x: 50, y: 50,})

    const handleClick = useCallback(() => {
      
        if (!enabled) {
            return
        }

        setIsZoomed((current) => !current)
        setPosition({x: 50, y: 50,})

    }, [enabled])

    const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {

        if (!enabled || !isZoomed) {
          return
        }

        const rect = event.currentTarget.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 100
        const y = ((event.clientY - rect.top) / rect.height) * 100

        setPosition({
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
        })

    }, [enabled, isZoomed])

    const normalImage = resizeVtexImage(image.url, 728)
    const zoomImage = resizeVtexImage(image.url, 1000, 1000)

    return (
        <div
            className={`
                ${styles.zoomImage} ${enabled ? styles.zoomImageEnabled : ''}
                ${isZoomed ? styles.zoomImageActive : ''}
            `}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            data-zoomed={isZoomed}
        >
        <img
            src={isZoomed ? zoomImage : normalImage}
            alt={image.alternateName ?? ''}
            width={800}
            height={800}
            loading={priority ? 'eager' : 'lazy'}
            draggable={false}
            style={
            isZoomed ? {transformOrigin: `${position.x}% ${position.y}%`,} : undefined
            }
        />
        </div>
    )
}