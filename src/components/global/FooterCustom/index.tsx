import styles from './FooterCustom.module.scss'
import type { FooterCustomProps } from './types'

import { Logo  } from './Logo'
import { SocialMedia } from './SocialMedia'
import { Payments, Security, Powerby  } from './Labels'
import { Menu } from './Menu'
import { Copyright } from './Copyright'

/** MOCK PARA TESTE */
import MOCK_PROPS from './mock'
const USE_LOCAL_MOCK = true

export const FooterCustom = (props: FooterCustomProps) => {
  
    const data = USE_LOCAL_MOCK ? MOCK_PROPS : props

    return (
        <footer aria-label='Footer' className={styles.footer}>
            <div className={styles.row1}>
                <div className='wrap'>
                    <div className='container'>
                        <Menu
                            phoneSanfona={data.menu?.phoneSanfona}
                            items={data.menu?.items ?? []}
                        />
                    </div>
                </div>                
            </div>
            <div className={styles.row2}>
                <div className='wrap'>
                    <div className='container'>
                        <div className={`flex items-center ${styles.labels}`}>
                            <Logo logo={data.logo} />
                            <SocialMedia
                                showTitle={data.socialMedia?.showTitle ?? false}
                                title={data.socialMedia?.title}
                                items={data.socialMedia?.items ?? []}
                            />
                            <Powerby
                                showTitle={data.powerBy?.showTitle ?? false}
                                title={data.powerBy?.title}
                                items={data.powerBy?.items ?? []}
                            />
                        </div>            
                    </div>
                </div>
            </div>
            <div className={styles.row3}>
                <div className='wrap'>
                    <div className='container'>
                        <Copyright
                            copyright={data.copyright}
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterCustom