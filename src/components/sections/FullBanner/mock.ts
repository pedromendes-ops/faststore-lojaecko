import type {
  FullBannerProps,
} from './types'

const MOCK_PROPS: FullBannerProps = {
    config: {
        label: 'Banner 01',
        grid: 'container',
        marginTop: 30,
        height: 500,
        priority: true,
    },
    slider: {
        showDots: true,
        showArrows: true,
        infiniteMode: true,
        autoPlay: true,
        autoPlayInterval: 3000,
    },
    items: [
        {
            image: 'https://picsum.photos/1360/656',
            imageMobile: 'https://picsum.photos/390/608',
            alt: 'Conheça nossas novidades',
            href: '/novidades',
            target: '_self',
        },
        {
            image: 'https://picsum.photos/1360/656',
            imageMobile: 'https://picsum.photos/390/608',
            alt: 'Confira nossas ofertas',
            href: '/ofertas',
            target: '_self',
        },
    ],
}

export default MOCK_PROPS