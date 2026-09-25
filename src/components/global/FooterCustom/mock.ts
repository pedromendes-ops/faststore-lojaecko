import type { FooterCustomProps } from './types'

const MOCK_PROPS: FooterCustomProps = {
    logo: 'https://lojasurbane.vteximg.com.br/arquivos/logo.svg',
    menu: {
        phoneSanfona: true,
        items: [
            {
                titleGroup: 'Institucional',
                footerLinks: [
                    {target: '_self', text: 'Quem Somos', url: '/'},
                    {target: '_self', text: 'Responsabilidade Ambiental', url: '/'},
                    {target: '_self', text: 'Responsabilidade Social', url: '/'},
                    {target: '_self', text: 'Política de privacidade', url: '/'},
                ]
            },
            {
                titleGroup: 'Suporte',
                footerLinks: [
                    {target: '_self', text: 'Trocas e Devoluções', url: '/'},
                    {target: '_self', text: 'Pollítica de Entrega', url: '/'},
                    {target: '_self', text: 'Formas de pagamento', url: '/'},
                    {target: '_self', text: 'Regras Promoções', url: '/'},
                ]
            },
            {
                titleGroup: 'Minha conta',
                footerLinks: [
                    {target: '_self', text: 'Meus dados', url: '/'},
                    {target: '_self', text: 'Meus pedidos', url: '/'},
                    {target: '_self', text: 'Meus Favoritos', url: '/'}
                ]
            },
            {
                titleGroup: 'Contato',
                footerLinks: [
                    {target: '_self', text: '0800 000 000', url: 'tel:0800000000'},
                    {target: '_self', text: 'email@dominio.com', url: 'mailto:email@dominio.com'},
                    {target: '_self', text: 'Seg. a sex. das 9:00 às 18:00<br /><span>(exceto feriados)</span>', url: ''}
                ]
            }
        ]
    },
    socialMedia: {
        showTitle: false,
        title: 'Redes Sociais',
        items: [
            {
                image: 'https://lojasurbane.vteximg.com.br/arquivos/facebook.svg',
                label: 'selo 1',
                url: 'https://google.com'
            },
            {
                image: 'https://lojasurbane.vteximg.com.br/arquivos/instagram.svg',
                label: 'selo 2',
                url: 'https://google.com'
            },
            {
                image: 'https://lojasurbane.vteximg.com.br/arquivos/linkedin.svg',
                label: 'selo 3',
                url: 'https://google.com'
            },
            {
                image: 'https://lojasurbane.vteximg.com.br/arquivos/youtube.svg',
                label: 'selo 4',
                url: 'https://google.com'
            }
        ]
    },
    payments: {
        label: 'Visa, mastercard, pix',
        image: 'https://lojasurbane.vteximg.com.br/arquivos/payments.webp',
        url: ''
    },
    security: {
        showTitle: true,
        title: 'Selos e segurança',
        items: [
            {
                image: 'https://lojasurbane.vteximg.com.br/arquivos/pcy.wepb',
                label: 'selo 1',
                url: 'https://google.com'
            },
            {
                image: 'https://lojasurbane.vteximg.com.br/arquivos/lets.wepb',
                label: 'selo 2',
                url: 'https://google.com'
            }
        ]
    },
    powerBy: {
        showTitle: false,
        title: 'Power By',
        items: [
            {
                image: 'https://lojasurbane.vteximg.com.br/arquivos/agencia-selia.webp',
                label: 'logo 1',
                url: 'https://google.com'
            },
            {
                image: 'https://lojasurbane.vteximg.com.br/arquivos/vtex.webp',
                label: 'logo 2',
                url: 'https://google.com'
            }
        ]
    },
    copyright: 'Todos os direitos reservados'
}

export default MOCK_PROPS