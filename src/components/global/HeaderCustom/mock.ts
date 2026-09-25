import type { HeaderCustomProps } from './types'

const MOCK_PROPS: HeaderCustomProps = {  
  imageSrc: 'https://lojasurbane.vteximg.com.br/arquivos/logo.svg',
  legend: 'Loja',  
  topBar: {
    background: '#AE4C4C',    
    items: [
      {
        text: 'PARCELE EM ATÉ 10X SEM JUROS',
      },
      {
        text: 'FRETE GRÁTIS ACIMA DE R$ 299',
      },
    ],
  },
  search: {
    searchButtonDesktop: true,
    searchButtonMobile: true,
    placeholder: 'Buscar...'
  },
  promoDay: {
    active: true,  
    cards: [
      {
        active: true,

        showBanner: true,
        fileBanner:
          'https://picsum.photos/540/260',
        fileBannerPhone:
          'https://picsum.photos/540/260',
        altBanner: 'Oferta especial do dia',

        linkBanner: '/ofertas',
        targetLinkBanner: '_self',
        text: `
          <h3>Ofertas especiais</h3>
          <p>
            Aproveite nossas ofertas selecionadas por tempo limitado.
          </p>
        `,
        links: [
          {
            linkText: 'Ver ofertas',
            urlLinkText: '/ofertas',
            targetLinkText: '_self',
          },
          {
            linkText: 'Confira os produtos',
            urlLinkText: '/produtos',
            targetLinkText: '_self',
          },
        ],
        showPolicy: true,
        policyText: 'Necessita de Cupom',
        policyLink: '/institucional/regulamento',
      },
      {
        active: true,

        showBanner: true,
        fileBanner:
          'https://picsum.photos/540/260',
        fileBannerPhone:
          'https://picsum.photos/540/260',
        altBanner: 'Oferta especial do dia',

        linkBanner: '/ofertas',
        targetLinkBanner: '_self',
        text: `
          <h3>Ofertas especiais</h3>
          <p>
            Aproveite nossas ofertas selecionadas por tempo limitado.
          </p>
        `,
        links: [
          {
            linkText: 'Ver ofertas',
            urlLinkText: '/ofertas',
            targetLinkText: '_self',
          },
          {
            linkText: 'Confira os produtos',
            urlLinkText: '/produtos',
            targetLinkText: '_self',
          },
        ],
        showPolicy: true,
        policyText: 'Necessita de Cupom',
        policyLink: '/institucional/regulamento',
      },
      {
        active: true,

        showBanner: true,
        fileBanner:
          'https://picsum.photos/540/260',
        fileBannerPhone:
          'https://picsum.photos/540/260',
        altBanner: 'Oferta especial do dia',

        linkBanner: '/ofertas',
        targetLinkBanner: '_self',
        text: `
          <h3>Ofertas especiais</h3>
          <p>
            Aproveite nossas ofertas selecionadas por tempo limitado.
          </p>
        `,
        links: [
          {
            linkText: 'Ver ofertas',
            urlLinkText: '/ofertas',
            targetLinkText: '_self',
          },
          {
            linkText: 'Confira os produtos',
            urlLinkText: '/produtos',
            targetLinkText: '_self',
          },
        ],
        showPolicy: true,
        policyText: 'Necessita de Cupom',
        policyLink: '/institucional/regulamento',
      },
      {
        active: true,
        showBanner: true,
        fileBanner:
          'https://picsum.photos/540/260',
        fileBannerPhone:
          'https://picsum.photos/540/260',
        altBanner: 'Promoção exclusiva',
        text: `
          <h3>Promoção exclusiva</h3>
          <p>
            Produtos selecionados com condições especiais.
          </p>
        `,
        links: [
          {
            linkText: 'Aproveitar agora',
            urlLinkText: '/promocao',
            targetLinkText: '_self',
          },
        ],

        showPolicy: false,
      },
    ],
  },
  welcome: {
    showWishlist: true,

    anonymous: {
      title: 'Bem-vindo!',
      text: 'Identifique-se aqui',
    },

    logged: {
      title: 'Olá!',
      text: 'Acessar a minha conta',
    },
  },
  miniCart: {
    title: 'Meu carrinho',

    alert: {
      text: 'Compra 100% segura',
    },

    emptyCart: {
      title: 'Seu carrinho está vazio',
      buttonLabel: 'Continuar comprando',
    },

    checkoutButton: {
      label: 'Finalizar compra',
      loadingLabel: 'Carregando...',
    },

    quantitySelector: {
      useUnitMultiplier: false,
    },

    taxesConfiguration: {
      usePriceWithTaxes: false,
      taxesLabel: 'Impostos inclusos',
    },

    rulerMinicart: {
      enabled: true,
      type: 'shipping',
      goal: 299,
      goalInCents: false,
      progressMessage: 'Faltam {value} para ganhar frete grátis',
      successMessage: 'Você ganhou frete grátis!',
      startLabel: 'R$ 0',
    },
  },
}

export default MOCK_PROPS

