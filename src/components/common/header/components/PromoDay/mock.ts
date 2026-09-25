// PromoDay/mock.ts

import type { PromoDayProps } from './types'

const MOCK_PROPS: PromoDayProps = {
  active: true,
  activeButton: true,
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
}

export default MOCK_PROPS