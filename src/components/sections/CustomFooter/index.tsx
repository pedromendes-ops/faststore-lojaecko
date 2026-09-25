import styles from './CustomFooter.module.scss'
import { Images } from './Images'
import { About } from './About'
import { Copyright } from './Copyright'
import { SocialNetworks } from './SocialNetworks'
import { Navigation } from './Navigation'




type InstagramImage = {
    image?: string
    link?: string
    alt?: string
}

type FooterLink = {
  text?: string
  url?: string
  target?: '_self' | '_blank'
}

type FooterNavGroup = {
  titleGroup?: string
  footerLinks?: FooterLink[]
}

type Props = {
    instagramTitle?: string
    instagramImages?: InstagramImage[]
    aboutTitle?: string
    aboutText?: string
    paragraphCopyright?: string
    footerNav?: FooterNavGroup[]
}

export function CustomFooter({
    instagramTitle = "@levisbrasil",
    instagramImages = [],
    aboutTitle = "SOBRE A LEVI'S®",
    aboutText = "<p>Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos...</p>",
    paragraphCopyright = "© 2023 LEVI STRAUSS & CO",
    footerNav = [
        {
            titleGroup: 'Informações',
            footerLinks: [
                {
                    text: 'Sobre nós',
                    url: '/sobre-nos',
                    target: '_self',
                },
                {
                    text: 'Trocas e Devoluções',
                    url: '/trocas-e-devolucoes',
                    target: '_self',
                },
            ],
        },
        {
            titleGroup: 'Atendimento',
            footerLinks: [
                {
                    text: '<p><strong>Horário de Atendimento</strong> <br> Segunda à Sexta das 8h às 20h <br> Sábado das 9h às 18h <br> Exceto Feriados</p><p><strong>sac@levi.com.br</strong></p>',
                    url: '',
                    target: '_self',
                }
            ],
        },
    ],

}: Props) {
    return (
        <footer className={styles.extfooter}>
            <div className="wrap">
                <div className="container">
                    <div className={`flex items-top ${styles.topFooter}`}>
                        <Images
                            title={instagramTitle}
                            images={instagramImages}
                        />                    
                    </div>
                </div>
            </div>
            <div className={styles.aboutFooter}>
                <About
                    title={aboutTitle}
                    text={aboutText}
                />
            </div>
            <div className="wrap">
                <div className="container">                    
                    <div className={styles.navFooter}>
                        <Navigation footerNav={footerNav} />                        
                    </div>
                    <div className={`flex items-center justify-between ${styles.bottomFooter}`}>
                        <Copyright                            
                            paragraphCopyright={paragraphCopyright}
                        />
                        <SocialNetworks />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default CustomFooter