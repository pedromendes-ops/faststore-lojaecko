import styles from './CustomFooter.module.scss'
import Link from 'src/components/ui/Link'
import {
    InstagramIcon,
    FacebookIcon,  
    TiktokIcon,
    YoutubeIcon,
} from "../../icons/social-network";

export function SocialNetworks() {
  return (
    <div className={`flex items-center ${styles.footerSocial}`}>
        <div>
            <Link key="Instagram" href="" target="_blank" rel="noopener noreferrer"> <InstagramIcon /> </Link>
        </div>
        <div>
            <Link key="Facebook" href="" target="_blank" rel="noopener noreferrer"> <FacebookIcon /> </Link>
        </div>
        <div>
            <Link key="Tiktok" href="" target="_blank" rel="noopener noreferrer"> <TiktokIcon /> </Link>
        </div>
        <div>
            <Link key="Youtube" href="" target="_blank" rel="noopener noreferrer"> <YoutubeIcon /> </Link>
        </div>
        
    </div>
  )
}