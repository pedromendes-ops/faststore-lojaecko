import type {
  PostProps
} from './types'

const MOCK_PROPS: PostProps = {
    config: {
        label: 'Post 01',
        grid: 'container',
        marginTop: 30,        
        active: true        
    },
    layout: {
        desktop: 'left',
        tablet: 'right',
        phone: 'bottom',
        gap: 16
    },
    content: {
        imageSrc: 'https://picsum.photos/640/480',
        imageAlt: 'teste',
        text: 'teste',
        linkText: 'Veja mais',
        linkHref: '/sobre',
        linkTarget: '_self',
        linkStyle: 'button',
    }
}

export default MOCK_PROPS