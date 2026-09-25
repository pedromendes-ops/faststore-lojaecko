import { Link } from '@faststore/ui'
import { useSession } from 'src/sdk/session'

import { UserIcon, WishlistIcon } from '../header.icons'
import styles from './Welcome.module.scss'

import type { WelcomeProps } from '../types'

export function Welcome({
  showWishlist = true,
  logged = {
    title: 'Olá!',
    text: 'Acessar a minha conta',
  },
  anonymous = {
    title: 'Bem-vindo!',
    text: 'Identifique-se aqui',
  },
}: WelcomeProps) {
    const { person } = useSession()
    const isAuthenticated = Boolean(person?.id ?? person?.email)

    const currentContent = isAuthenticated
        ? {
            title: logged?.title ?? 'Olá!',
            text: logged?.text ?? 'Acessar a minha conta',
        }
        : {
            title: anonymous?.title ?? 'Bem-vindo!',
            text: anonymous?.text ?? 'Identifique-se aqui',
        }

    return (
        <div className={`flex items-center ${styles.welcome}`}>
            <Link
                href={isAuthenticated ? '/account/profile' : '/login'}                
                className={`flex items-center ${styles.welcomeLink}`}
                aria-label={
                    isAuthenticated
                        ? 'Acessar minha conta'
                        : 'Entrar na minha conta'
                    }
            >
                <span className={`flex center ${styles.welcomeIcon}`}>
                    <UserIcon />
                </span>

                <span className={styles.welcomeText}>
                    <strong>{currentContent.title}</strong>
                    <span>{currentContent.text}</span>
                </span>
            </Link>

            {showWishlist && (
                <Link
                    href={isAuthenticated ? '/account/wishlist' : '/login'}                    
                    className={`flex center ${styles.wishlistLink}`}
                    aria-label="Lista de desejos"
                >
                    <WishlistIcon />
                </Link>
            )}
        </div>
    )
}