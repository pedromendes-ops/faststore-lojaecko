import type { CompleteCardProps } from './types'

const MOCK_PROPS: CompleteCardProps = {
  layoutDesktop: 'grid',
  columnsDesktop: '1',
  layoutTablet: 'grid',
  marginTopSection: '20',
  columnsTablet: '1',
  layoutPhone: 'slider',
  columnsPhone: '1',
  paddingPx: '20',
  customClassSection: 'demo',
  areaSection: 'container',
  maxWidthSection: '',
  cards: [
    {
      showBanner: false,
      fileBanner: 'https://lojalevis.vteximg.com.br/arquivos/mock-2.jpg',
      altBanner: 'Banner 1',
      linkBanner: '',
      targetLinkBanner: '_self',
      showText: true,
      positionText: 'center-left',
      paddingRightText: '0',
      paddingLeftText: '0',
      paddingTopText: '0',
      paddingBottomText: '0',
      backgroundBoxText: '#fff',
      coloText: '#000',
      orderText: 'left',
      alignText: 'left',
      styleText: 'relative',
      directionLinks: 'row',
      positionLink: 'bottom',
      texts: [
        {
          magingBottomText: '20',
          coloText: '#000',
          fontSizeText: '22px',
          fontSizeTextPhone: '22px',
          strongText: '700',
          rowGapText: '0',
          contentText: '<h2>Título</h2>'
        },
        {
          magingBottomText: '0',
          coloText: '#666',
          fontSizeText: '12',
          fontSizeTextPhone: '12px',
          strongText: '400',
          rowGapText: '8px',
          contentText: '<p>Lorem impsum</p><p>Lorem impsum Lorem impsum Lorem impsum Lorem impsum</p>'
        }
      ],
      links: [
        {
          linkText: 'Comprar',
          urlLinkText: '#',
          targetLinkText: '_self',
          styleLinkText: 'link',
          colorLinkText: '#000',
          backgroundLinkText: '#000',
          borderLinkText: true,
        },
        {
          linkText: 'Veja mais',
          urlLinkText: '#',
          targetLinkText: '_self',
          styleLinkText: 'link',
          colorLinkText: '#000',
          backgroundLinkText: '#000',
          borderLinkText: true,
        },
      ],
    },
    /*
    {
      showBanner: true,
      fileBanner: 'https://lojalevis.vteximg.com.br/arquivos/mock-2.jpg',
      altBanner: 'Banner 1',
      linkBanner: '#',
      showText: true,
      contentText: '<h2>Card 1</h2><p>Texto de exemplo</p>',
      positionText: 'center-center',
      orderText: 'left',
      alignText: 'center',
      styleText: 'relative',
      directionLinks: 'row',
      links: [
        {
          linkText: 'Comprar',
          urlLinkText: '#',
          targetLinkText: '_self',
          styleLinkText: 'button',
          colorLinkText: '#fff',
          backgroundLinkText: '#000',
          borderLinkText: false,
        },
      ],
    },
    */
  ]
}

export default MOCK_PROPS

