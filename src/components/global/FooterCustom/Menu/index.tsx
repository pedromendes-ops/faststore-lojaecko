import { useState } from 'react'
import Link from 'next/link'

import styles from './Menu.module.scss'
import type { MenuProps } from '../types'

import useScreenResize from '../../../../hooks/useScreenResize'

export function Menu({
    phoneSanfona,
    items = [],
}: MenuProps) {
    
    const { isDesktop } = useScreenResize()
    const [openGroups, setOpenGroups] = useState<number[]>([])

    if (!items.length) {
        return null
    }

    const isAccordion = phoneSanfona === true && !isDesktop;

    const toggleGroup = (index: number) => {
        setOpenGroups((current) =>
            current.includes(index)
                ? current.filter(
                    (item) => item !== index
                )
                : [...current, index]
        )
    }

    return (
        <div className={`flex ${styles.footerMenu}`}>
        {items.map((group, index) => {
            const isOpen =
            openGroups.includes(index)

            const showMenu = !isAccordion || isOpen
            const menuId = `footer-menu-group-${index}`

            return (
                <div
                    key={`${group.titleGroup}-${index}`}
                    className={styles.footerNavigationGroup}
                >
                    {group.titleGroup && (
                        <>
                        {isAccordion ? (
                            <button
                                type="button"                                
                                className={`flex items-center w-100 ${styles.titleButton}`}
                                onClick={() =>
                                    toggleGroup(index)
                                }
                                aria-expanded={isOpen}
                                aria-controls={menuId}
                            >
                                <span>{group.titleGroup}</span>
                                <span className={`ml-auto flex items-center justify-center ${styles.icon} ${isOpen ? styles.iconOpen : ''}`} aria-hidden="true">
                                    <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.9982 2.396L7.19867 7.19552L2.39771 2.396" stroke="#1B1B1B" stroke-width="2.016" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </button>
                        ) : (
                        <div className={styles.title}>
                            {group.titleGroup}
                        </div>
                        )}
                        </>
                    )}

                    {showMenu && (
                        <nav
                            id={menuId}
                            aria-label={
                            group.titleGroup
                                ? `Links de ${group.titleGroup}`
                                : 'Footer Links Navigation'
                            }
                        >
                            <ul>
                                {group.footerLinks?.map(
                                    (link, linkIndex) => (
                                    <li key={`${link.text}-${linkIndex}`}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                target={link.target ?? '_self'}
                                                rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                                            >
                                                {link.text}
                                            </Link>
                                        ) : (
                                            <div dangerouslySetInnerHTML={{__html: link.text ?? '',}}/>
                                        )}
                                    </li>
                                    )
                                )}
                            </ul>
                        </nav>
                    )}
                </div>
                )
            })}
        </div>
    )
}