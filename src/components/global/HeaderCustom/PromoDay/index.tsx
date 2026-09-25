import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { SlideOver } from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import { Viewer } from '../../../ui/viewer'
import useScreenResize from '../../../../hooks/useScreenResize'
import { useFadeEffect } from "@faststore/ui";

import { AlertIcon } from '../header.icons'
import styles from './PromoDay.module.scss'

import type {
  PromoLink,
  PromoItem,
  PromoDayProps,
} from '../types'


const PromoImage = ({
  card,
  isMobile,
}: {
  card: PromoItem
  isMobile: boolean
}) => {
  if (!card.showBanner || !card.fileBanner) {
    return null
  }

  const hasLink = Boolean(card.linkBanner?.trim())

  const imageSrc =
    isMobile && card.fileBannerPhone
      ? card.fileBannerPhone
      : card.fileBanner

  const image = (
    <Image
      src={imageSrc}
      alt={card.altBanner || ''}
      width={600}
      height={400}
      className={styles.image}
      loading="lazy"
    />
  )

  if (!hasLink) {
    return (
      <div className={styles.imageWrapper}>
        {image}
      </div>
    )
  }

  return (
    <Link
      href={card.linkBanner!}
      className={styles.imageWrapper}
      aria-label={card.altBanner || 'Acessar oferta'}
      target={card.targetLinkBanner || '_self'}
      rel={
        card.targetLinkBanner === '_blank'
          ? 'noopener noreferrer'
          : undefined
      }
    >
      {image}
    </Link>
  )
}

const PromoText = ({ card }: { card: PromoItem }) => {
  if (!card.text?.trim()) {
    return null
  }

  return (
    <div className={styles.texts}>
      <div className={styles.text}>
        <Viewer value={card.text} />
      </div>
    </div>
  )
}

const PromoLinks = ({
  links = [],
}: {
  links?: PromoLink[]
}) => {
  const validLinks = links
    .filter(
      (link) =>
        Boolean(link.urlLinkText?.trim()) &&
        Boolean(link.linkText?.trim())
    )
    .slice(0, 3)

  if (!validLinks.length) {
    return null
  }

  const countLink = validLinks.length

  return (
    <div
      className={styles.links}
      style={{        
        gridTemplateColumns: `repeat(${countLink}, 1fr)`,
      }}
    >
      {validLinks.map((link, index) => (
        <Link
          key={`${link.urlLinkText}-${index}`}
          href={link.urlLinkText!}
          target={link.targetLinkText || '_self'}
          rel={
            link.targetLinkText === '_blank'
              ? 'noopener noreferrer'
              : undefined
          }
          className={styles.link}
        >
          {link.linkText}
        </Link>
      ))}
    </div>
  )
}

const PromoPolicy = ({ card }: { card: PromoItem }) => {
  if (!card.showPolicy) {
    return null
  }

  if (!card.policyText?.trim() && !card.policyLink?.trim()) {
    return null
  }

  return (
    <div className={styles.policy}>
      {card.policyLink?.trim() ? (
        <>
          <p className={styles.policyText}>
            {card.policyText}
          </p>
          <Link
            href={card.policyLink}
            className={styles.policyLink}
          >
            Saiba mais
          </Link>
        </>
      ) : (
        <p className={styles.policyText}>
          {card.policyText}
        </p>
      )}
    </div>
  )
}

const PromoCard = ({
  card,
  isMobile,
}: {
  card: PromoItem
  isMobile: boolean
}) => {
  return (
    <article className={styles.card}>
      <PromoImage
        card={card}
        isMobile={isMobile}
      />

      <PromoText card={card} />

      <PromoLinks links={card.links} />

      <PromoPolicy card={card} />
    </article>
  )
}

export function PromoDay({
    active = false,    
    cards = [],

}: PromoDayProps) {

  const [isMainOpen, setIsMainOpen] = useState(false)  

  const {
    fade: mainFade,
    fadeIn: mainFadeIn,
    fadeOut: mainFadeOut,
  } = useFadeEffect()

  const { isMobile } = useScreenResize()

  const validCards = useMemo(() => {
    return cards.filter((card) => {
      if (card.active === false) {
        return false
      }

      const hasBanner =
        Boolean(card.showBanner) &&
        Boolean(card.fileBanner?.trim())

      const hasText = Boolean(card.text?.trim())

      const hasLinks = Boolean(
        card.links?.some(
          (link) =>
            link.linkText?.trim() &&
            link.urlLinkText?.trim()
        )
      )

      const hasPolicy =
        Boolean(card.showPolicy) &&
        Boolean(
          card.policyText?.trim() ||
          card.policyLink?.trim()
        )

      return (
        hasBanner ||
        hasText ||
        hasLinks ||
        hasPolicy
      )
    })
  }, [cards])

  const openMain = useCallback(() => {
    setIsMainOpen(true)
    mainFadeIn()
  }, [mainFadeIn])

  const closeMain = useCallback(() => {
    mainFadeOut()
  }, [mainFadeOut])

  const onMainTransitionEnd = useCallback(() => {
    if (mainFade === 'out') {
      setIsMainOpen(false)
    }
  }, [mainFade])

  if (!active || !validCards.length) {
    return null
  }

  

  return (
    <>
      
    <button
        type="button"        
        className={`flex center pointer relative ${styles.trigger}`}
        onClick={openMain}
        aria-expanded={isMainOpen}
        aria-controls="promo-day-drawer"
    >
        <AlertIcon />
        <span className='flex center absolute top0 right0 circle'>{validCards.length}</span>
    </button>
      

      <SlideOver
        fade={mainFade}
        onDismiss={closeMain}
        onTransitionEnd={onMainTransitionEnd}
        isOpen={isMainOpen}
        size="partial"
        direction="rightSide"
        overlayProps={{
          className: 'section section-organization-drawer',
        }}
      >
        <div className={styles.headerPromoDay}>
          <div>
            <h3>Ofertas do dia</h3>
            <button
              type="button"            
              onClick={closeMain}
              aria-label="Fechar ofertas do dia"
            >
              ×
            </button>
          </div>
        </div>
        
        <section
          id="promo-day-drawer"
          className={styles.sectionPromoDay}
          aria-label="Ofertas do dia"
        >
          <div className={styles.wrapper}>
            {validCards.map((card, index) => (
              <PromoCard
                key={`${card.fileBanner || card.text || 'promo'}-${index}`}
                card={card}
                isMobile={isMobile ?? true}
              />
            ))}
          </div>
        </section>
      </SlideOver>
    </>
  )
}