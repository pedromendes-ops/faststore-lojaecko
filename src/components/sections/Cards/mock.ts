import type {
  CardsProps,
} from './types'

const MOCK_PROPS: CardsProps = {
  config: {
    label: 'cards 01',
    active: true,
    grid: 'full',
    marginTop: 0,
    priority: false,

    layout: {
      desktop: 'grid',
      columnsDesktop: 1,
      heightDesktop: 300,

      tablet: 'slider',
      columnsTablet: 1,
      heightTablet: 260,

      phone: 'slider',
      columnsPhone: 1,
      heightPhone: 280,
      gap: 16,
      position: 'inner'
    },

    style: {
      background: "trnasparent",
      radius: true,
      
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
      mediaType: 'video',
      image:
        'https://picsum.photos/800/600?1',
      imageMobile:
        'https://picsum.photos/600/800?1',
      alt:
        'Conheça nossas novidades',
      video: 'https://lscoglobal.scene7.com/is/content/lscoglobal/26_H2_SPM_GDA_D1_AUG-700-SERIES_W_HP-VID-0x1080-4995k',
      videoMobile: 'https://lscoglobal.scene7.com/is/content/lscoglobal/26_H2_SPM_GDA_D1_AUG-700-SERIES_W_HP-VID-0x1080-4995k',
      href: '/novidades',
      target: '_self',
      text: '<h2>teste</h2>',
      alignLinks: 'center',
      link: [
        {
          "name": 'femininno',
          "value": '/categoria'
        },
        {
          "name": 'maxulino',
          "value": '/categoria'
        }
      ]
    }
  ],
}


/*
const MOCK_PROPS: CardsProps = {
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


const MOCK_PROPS: CardsProps = {
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