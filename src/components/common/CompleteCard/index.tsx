import Link from 'next/link'
import { Image } from 'src/components/ui/Image'
import { Viewer } from "../../ui/viewer";
import useScreenResize from '../MyScreenResize'

import styles from './CompleteCard.module.scss'
import { contentPositions, absolutePositions } from './positions'
import { orderTextStyles } from './order'
import type {
  CompleteCardItem,
  CompleteCardLink,
  CompleteCardProps,
  CompleteCardText
} from './types'


//import MOCK_PROPS from './mock'
//const USE_LOCAL_MOCK = false

const safeNumber = (value?: string, fallback = 1) => {
  const number = Number(value)

  return Number.isFinite(number) && number >= 0 ? number : fallback
}

const directions = {
  row: 'row',
  columns: 'column',
  column: 'column',
} as const

const CardLinks = ({
  links = [],
  directionLinks = 'row',
}: {
  links?: CompleteCardLink[]
  directionLinks?: CompleteCardItem['directionLinks']
}) => {
  if (!links.length) return null

  const { isDesktop } = useScreenResize()
  

  return (
    <div
      className={styles.links}
      style={{
        flexDirection: directions[directionLinks ?? 'row'],
      }}
    >
      {links.map((link, index) => {
        const isButton = link.styleLinkText === 'button'

        return (
          <Link
            key={`${link.linkText}-${index}`}
            href={link.urlLinkText || '#'}
            target={link.targetLinkText || '_self'}
            rel={link.targetLinkText === '_blank' ? 'noopener noreferrer' : undefined}            
            className={`${styles.link} ${
              isButton ? styles.button : styles.textLink
            }`}
            style={{
              color: link.colorLinkText || '#110b0d',
              fontWeight: link.strongLink
                ? '700'
                : '400',
              fontSize: isDesktop
              ? link.fontSizeLink
              : link.fontSizeLinkPhone ?? '13px',
              background: isButton
                ? link.backgroundLinkText || '#fff'
                : 'transparent',
              ...(link.borderLinkText
              ? isButton
                ? {
                    border: `${link.borderWidth || '1px'} solid ${link.borderColorLinkText || '#110b0d'}`,
                  }
                : {
                    borderBottom: `${link.borderWidth || '1px'} solid ${link.borderColorLinkText || '#110b0d'}`,
                  }
              : {
                  border: 'none',
                }),
            }}
          >
            {link.linkText || 'Veja mais'}
          </Link>
        )
      })}
    </div>
  )
}

const CardImage = ({ card }: { card: CompleteCardItem }) => {
  if (!card.showBanner || !card.fileBanner) return null

  const hasLink = !!card.linkBanner?.trim()
  
  
  const image = (
    <Image
      src={card.fileBanner}
      alt={card.altBanner || ''}      
      width={900}
      height={900}            
      className={`${styles.image} ${card.hoverZoom === true ? styles.zoomHover : styles.noHover}`}
    />
  )

  return hasLink ? (
    <Link
      href={card.linkBanner!}
      className={`${styles.imageWrapper}
      
      ${styles.imageArea}
      ${styles.imageLink}`}
      aria-label={card.altBanner || 'Acessar conteúdo do card'}
      target={card.targetLinkBanner || '_self'}
      rel={card.targetLinkBanner === '_blank' ? 'noopener noreferrer' : undefined}
      >
      {image}
    </Link>
  ) : (
    <div className={`${styles.imageWrapper} ${styles.imageArea}`}>
      {image}
    </div>
  )
}


const CardContent = ({ card }: { card: CompleteCardItem }) => {
  const { isDesktop } = useScreenResize()

  if (!card.showText) return null

  const position = contentPositions[card.positionText || 'left-bottom']
  const absolutePosition = absolutePositions[card.positionText || 'left-bottom']

  const linkRight = isDesktop && card.positionLink === 'right'

  return (
    <div
      className={`
        ${styles.contentArea}
        ${styles.content}
        ${card.styleText === 'absolute'
          ? styles.absoluteContent
          : styles.relativeContent}
        ${linkRight ? styles.linkRight : ''}
        ${card.alignText === 'center' ? styles.centerlinks : ''}
        ${card.alignTextPhone ? styles.phoneCenter : ''}
      `}
      style={{
        paddingTop: `${card.paddingTopText || 0}px`,
        paddingBottom: `${card.paddingBottomText || 0}px`,
        paddingLeft: `${card.paddingLeftText || 0}px`,
        paddingRight: `${card.paddingRightText || 0}px`,
        maxWidth: card.maxWidthText ? card.maxWidthText : undefined,
        marginLeft: card.maxWidthText ? 'auto' : undefined,
        marginRight: card.maxWidthText ? 'auto' : undefined,
        background: card.backgroundBoxText || 'transparent',

        justifyContent: linkRight
          ? 'space-between'
          : position.justifyContent,

        alignItems: linkRight
          ? 'center'
          : position.alignItems,

        textAlign: card.alignText || 'left',

        ...(card.styleText === 'absolute'
          ? absolutePosition
          : {}),
      }}
    >
      <CardTexts texts={card.texts} />

      <CardLinks        
        links={card.links}
        directionLinks={card.directionLinks}
      />
    </div>
  )
}

const CardTexts = ({
  texts = [],
}: {
  texts?: CompleteCardText[]
}) => {
  const { isDesktop } = useScreenResize()
  

  if (!texts.length) return null

  return (
    <div className={styles.texts}>
      {texts.map((text, index) => (        
        <div
          key={index}
          className={styles.text}
          style={{
            color: text.coloText || '#110b0d',
            marginBottom: `${text.magingBottomText || 0}px`,
            fontSize: isDesktop
              ? text.fontSizeText
              : text.fontSizeTextPhone ?? text.fontSizeText,
            rowGap: text.rowGapText || '16px',
            ...(text.strongText && text.strongText !== 'default' && {
              fontWeight: text.strongText,
            }),
          }}          
        >
          <Viewer value={text.contentText || ''} />
        </div>
          
        
      ))}
    </div>
  )
}

const CardItem = ({ card }: { card: CompleteCardItem }) => {
  const { isDesktop } = useScreenResize()

  const isRelative =
    card.styleText === 'relative' &&
    card.showBanner === true &&
    card.showText === true

  const currentOrder = isDesktop
    ? card.orderText ?? 'left'
    : card.orderTextPhone ?? card.orderText ?? 'left'

  return (
    <article
      className={`${styles.card} ${
        card.styleText === 'absolute' ? styles.hasOverlayText : ''
      }`}
      style={isRelative ? orderTextStyles[currentOrder] : undefined}
    >
      <CardImage card={card} />
      <CardContent card={card} />
    </article>
  )
}

export const CompleteCard = (props: CompleteCardProps) => {
  //const data = USE_LOCAL_MOCK ? MOCK_PROPS : props
  const data = props

  const {
    active = true,
    hasTitle = false,
    sizeTitle = 'medium',
    textTitle = '',
    layoutDesktop = 'grid',
    columnsDesktop = '1',
    layoutTablet = 'grid',
    columnsTablet = '1',
    layoutPhone = 'grid',
    columnsPhone = '1',
    paddingPx = '10',
    paddingPxPhone = '10',
    customClassSection = '',
    areaSection = 'full',
    borderContainer = 'none',
    borderWidth = '1px',
    paddingBorder = '0',
    maxWidthSection,
    marginTopSection = '0',
    marginTopSectionPhone = '0',
    sectionLabel = '',
    cards = [],
  } = data

  //console.log('props CMS', props)
  //console.log('data renderizada', data)
  //console.log('cards renderizados', cards)

  const { isDesktop, isTablet } = useScreenResize()

  const layout = isDesktop ? layoutDesktop : isTablet ? layoutTablet : layoutPhone

  const columns = safeNumber(
    isDesktop ? columnsDesktop : isTablet ? columnsTablet : columnsPhone,
    1
  )
  
  
  const gap = isDesktop ? safeNumber(paddingPx, 10) : safeNumber(paddingPxPhone, 10)
  const topmargin = isDesktop ? marginTopSection ?? '0' : marginTopSectionPhone ?? '0'

  const content = (
    <div
      className={`${styles.wrapper} ${styles[layout]}`}
      style={
        {
          '--complete-card-columns': columns,
          '--complete-card-gap': `${gap}px`,
        } as React.CSSProperties
      }
    >
      {cards.map((card, index) => (
        <CardItem key={index} card={card} />
      ))}
    </div>
  )

  if (!active) return null;
  
  if (areaSection === 'container') {
    
    return (
      
      <section aria-label={sectionLabel || undefined} className={`${styles.section} ${customClassSection}`} style={{marginTop: `${topmargin}px`}}>
        <div className="wrap">
          <div className="container" style={{
            maxWidth: maxWidthSection ? `${maxWidthSection}px` : undefined,
            ...(borderContainer !== 'none' && {
              border: `${borderWidth} ${borderContainer} #110b0d`,
              padding: paddingBorder || 0
            }),
          }}>
            {hasTitle && 
              <div className={`boxTitle ${sizeTitle}`}>
                <Viewer value={textTitle} />
              </div>
            }
            {content}
          </div>
        </div>
      </section>
    )
  }
  return(
    <section
      aria-label={sectionLabel || undefined}
      style={{marginTop: `${topmargin}px`}}
      className={`${styles.section} ${customClassSection}`}
    >
      <div className="wrap">
        {hasTitle && 
          <div className={`boxTitle ${sizeTitle}`}>
            <Viewer value={textTitle} />
          </div>
        }
        {content}
      </div>
    </section>  
  )
}

export default CompleteCard