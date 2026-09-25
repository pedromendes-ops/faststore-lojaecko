import type {PitBarProps} from './types'

const MOCK_PROPS: PitBarProps = {
    config: {
        label: 'Footer PitBar',
        grid: 'container',
        marginTop: 30,
        background: '#f5f5f7'
    },
    items: [
        {
            image: 'https://picsum.photos/60/60',            
            imageMobile: 'https://picsum.photos/60/60',
            alt: 'frete',
            line1: '<strong>Frete grátis</strong> <br> para todo Brasil'
        },
        {
            image: 'https://picsum.photos/60/60',
            imageMobile: 'https://picsum.photos/60/60',
            alt: 'entrega',
            line1: '<strong>Entrega expressa</strong> <br> para São Paulo'
        },
        {
            image: 'https://picsum.photos/60/60',
            imageMobile: 'https://picsum.photos/60/60',
            alt: 'pix',
            line1: 'Pague no PIX e <br> <strong>ganhe 10% off</strong>'
        },
        {
            image: 'https://picsum.photos/60/60',
            imageMobile: 'https://picsum.photos/60/60',
            alt: 'parcelamento',
            line1: 'Parcelamento em até <br> <strong>10x sem juros</strong>'
        },
    ],
}

export default MOCK_PROPS