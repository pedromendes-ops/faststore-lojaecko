import Link from 'src/components/ui/Link'
// import useScreenResize from 'src/sdk/ui/useScreenResize'
import styles from './CustomFooter.module.scss'
import { PaymentMethods } from "@faststore/ui";

const flags = [
  { icon: { icon: 'Visa' }, alt: 'Visa' },
  { icon: { icon: 'Mastercard' }, alt: 'Mastercard' },
  { icon: { icon: 'Diners' }, alt: 'Diners Club' },
  { icon: { icon: 'Amex' }, alt: 'Amex' },
  { icon: { icon: 'Pix' }, alt: 'Pix' },
  /*
  { icon: { icon: 'ApplePay' }, alt: 'ApplePay' },
  { icon: { icon: 'EloCard' }, alt: 'Elo Card' },  
  { icon: { icon: 'GooglePay' }, alt: 'GooglePay' },  
  { icon: { icon: 'PayPal' }, alt: 'PayPal' },  
  { icon: { icon: 'Stripe' }, alt: 'Stripe' },
  { icon: { icon: 'GooglePay' }, alt: 'GooglePay' },
   */
]

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
  footerNav?: FooterNavGroup[]
}

export function Navigation({
  footerNav = [],
}: Props) {
    return (
        <div className={`flex items-top justify-between no-flex ${styles.footerNavigation}`}>
            {footerNav.map((group, index) => (
                <div
                key={`${group.titleGroup}-${index}`}
                className={styles.footerNavigationGroup}
                >
                    {group.titleGroup && (
                        <div className={styles.title}>
                            {group.titleGroup}
                        </div>
                    )}
                    <nav aria-label="Footer Links Navigation">
                        <ul>
                            {group.footerLinks?.map((link, linkIndex) => (
                                <li>
                                {link.url ? (
                                    <Link
                                        key={`${link.text}-${linkIndex}`}
                                        href={link.url || '#'}
                                        target={link.target || '_self'}
                                        rel={
                                        link.target === '_blank'
                                            ? 'noopener noreferrer'
                                            : undefined
                                        }                                        
                                    >
                                        {link.text}
                                    </Link>
                                ) : (                                    
                                    <div
                                        dangerouslySetInnerHTML={{ __html: link.text || '' }}
                                    />
                                )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            ))}
            <div className={styles.footerPayments}>
                <PaymentMethods  title={<p>Formas de Pagamento</p>} flagList={flags} />
            </div>
        </div>
    )
}

export default Navigation