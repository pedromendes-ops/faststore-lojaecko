import type {
  BannersProps,
} from './types'

const MOCK_PROPS: BannersProps = {
  config: {
    label: 'Banners 01',
    active: true,
    grid: 'container',
    marginTop: 30,
    priority: false,

    layout: {
      desktop: 'grid',
      columnsDesktop: 4,
      heightDesktop: 300,

      tablet: 'slider',
      columnsTablet: 2,
      heightTablet: 260,

      phone: 'slider',
      columnsPhone: 2,
      heightPhone: 280,
      gap: 16,
    },

    style: {
      zoom: true,
      radius: true,
      shadow: true,
    },

    slider: {
        align: {
            desktop: 'default',
            tablet: 'container-start',
            phone: 'container-start',
        },

        peek: {
            desktop: 0,
            tablet: 60,
            phone: 48,
        },

        showDots: true,
        showArrows: true,
        infiniteMode: false,
        autoPlay: false,
        autoPlayInterval: 5000,
    }
  },

  items: [
    {
      active: true,
      image:
        'https://picsum.photos/800/600?1',
      imageMobile:
        'https://picsum.photos/600/800?1',
      alt:
        'Conheça nossas novidades',
      href: '/novidades',
      target: '_self',
    },
    {
      active: true,
      image:
        'https://picsum.photos/800/600?2',
      imageMobile:
        'https://picsum.photos/600/800?2',
      alt:
        'Confira nossas ofertas',
      href: '/ofertas',
      target: '_self',
    },
    {
      active: true,
      image:
        'https://picsum.photos/800/600?3',
      imageMobile:
        'https://picsum.photos/600/800?3',
      alt:
        'Mais vendidos',
      href: '/mais-vendidos',
      target: '_self',
    },
    {
      active: true,
      image:
        'https://picsum.photos/800/600?4',
      imageMobile:
        'https://picsum.photos/600/800?4',
      alt:
        'Lançamentos',
      href: '/lancamentos',
      target: '_self',
    },
    {
      active: true,
      image:
        'https://picsum.photos/800/600?4',
      imageMobile:
        'https://picsum.photos/600/800?4',
      alt:
        'Lançamentos',
      href: '/lancamentos',
      target: '_self',
    },
    {
      active: true,
      image:
        'https://picsum.photos/800/600?4',
      imageMobile:
        'https://picsum.photos/600/800?4',
      alt:
        'Lançamentos',
      href: '/lancamentos',
      target: '_self',
    },
    {
      active: true,
      image:
        'https://picsum.photos/800/600?4',
      imageMobile:
        'https://picsum.photos/600/800?4',
      alt:
        'Lançamentos',
      href: '/lancamentos',
      target: '_self',
    },
  ],
}


/*
const MOCK_PROPS: BannersProps = {
  config: {
    active: true,
    grid: 'container',
    marginTop: 30,
    priority: false,

    layout: {
      desktop: 'grid',
      columnsDesktop: 2,
      heightDesktop: 300,

      tablet: 'grid',
      columnsTablet: 1,
      heightTablet: 260,

      phone: 'grid',
      columnsPhone: 1,
      heightPhone: 280,
      gap: 16,
    },

    style: {
      zoom: false,
      radius: false,
      shadow: false,
    },

    slider: {
        align: {
            desktop: 'container-start',
            tablet: 'container-start',
            phone: 'container-start',
        },

        peek: {
            desktop: 0,
            tablet: 60,
            phone: 48,
        },

        showDots: true,
        showArrows: true,
        infiniteMode: false,
        autoPlay: false,
        autoPlayInterval: 5000,
    }
  },

  items: [
    {
      active: true,
      image:
        'https://picsum.photos/800/600?1',
      imageMobile:
        'https://picsum.photos/600/800?1',
      alt:
        'Conheça nossas novidades',
      href: '/novidades',
      target: '_self',
    },
    {
      active: true,
      image:
        'https://picsum.photos/800/600?2',
      imageMobile:
        'https://picsum.photos/600/800?2',
      alt:
        'Confira nossas ofertas',
      href: '/ofertas',
      target: '_self',
    }
  ],
}


const MOCK_PROPS: BannersProps = {
  config: {
    active: true,
    grid: 'container',
    marginTop: 30,
    priority: false,

    layout: {
      desktop: 'grid',
      columnsDesktop: 1,
      heightDesktop: 300,

      tablet: 'grid',
      columnsTablet: 1,
      heightTablet: 260,

      phone: 'grid',
      columnsPhone: 1,
      heightPhone: 280,
      gap: 16,
    },

    style: {
      zoom: true,
      radius: true,
      shadow: true,
    },

    slider: {
        align: {
            desktop: 'container-start',
            tablet: 'container-start',
            phone: 'container-start',
        },

        peek: {
            desktop: 0,
            tablet: 60,
            phone: 48,
        },

        showDots: true,
        showArrows: true,
        infiniteMode: false,
        autoPlay: false,
        autoPlayInterval: 5000,
    }
  },

  items: [
    {
      active: true,
      image:
        'https://picsum.photos/800/600?1',
      imageMobile:
        'https://picsum.photos/600/800?1',
      alt:
        'Conheça nossas novidades',
      href: '/novidades',
      target: '_self',
    }
  ],
  
}
  */

export default MOCK_PROPS