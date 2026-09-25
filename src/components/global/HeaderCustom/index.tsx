import { useEffect, useRef, useState } from 'react'

import styles from './HeaderCustom.module.scss'
import type { HeaderCustomProps } from './types'

import { TopBar } from './TopBar'
import { Logo } from './Logo'
import { Search } from './Search'
import { Welcome } from './Welcome'
import { PromoDay } from './PromoDay'
import { MiniCart } from './MiniCart'

/** MOCK PARA TESTE */
import MOCK_PROPS from './mock'
const USE_LOCAL_MOCK = true

export const HeaderCustom = (props: HeaderCustomProps) => {
  const data = USE_LOCAL_MOCK ? MOCK_PROPS : props

  const sentinelRef = useRef<HTMLDivElement>(null)
  const headerBarRef = useRef<HTMLDivElement>(null)

  const [isFixed, setIsFixed] = useState(false)
  const [headerBarHeight, setHeaderBarHeight] = useState(0)

  useEffect(() => {
    const sentinel = sentinelRef.current
    const headerBar = headerBarRef.current

    if (!sentinel || !headerBar) {
      return
    }

    setHeaderBarHeight(headerBar.offsetHeight)

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFixed(!entry.isIntersecting)
      },
      {
        threshold: 0,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [])

    return (
        <header className={styles.header}>
            <TopBar
                items={data.topBar?.items}
                background={data.topBar?.background}
            />

            <div ref={sentinelRef} className={styles.headerBarSentinel} />

            {isFixed && (
                <div
                    aria-hidden="true"
                    style={{ height: headerBarHeight }}
                />
            )}

            <div
                ref={headerBarRef}
                className={`${styles.headerBar} ${
                    isFixed ? styles.headerBarFixed : ''
                }`}
            >
                <div className='container'>
                    <div className={`flex items-center ${styles.innerHeader}`}>
                        <div className={styles.search}>
                            <Search
                                searchButtonDesktop={data.search?.searchButtonDesktop}
                                searchButtonMobile={data.search?.searchButtonMobile}
                                placeholder={data.search?.placeholder}
                            />
                        </div>
                        <Logo
                            legend={data.legend}
                            imageSrc={data.imageSrc}
                        />
                        <div className={`flex items-center ${styles.utils}`}>
                            <Welcome
                                showWishlist={data.welcome?.showWishlist}
                                logged={data.welcome?.logged}
                                anonymous={data.welcome?.anonymous}
                            />
                            <PromoDay
                                active = {data.promoDay?.active}                    
                                cards = {data.promoDay?.cards}
                            />
                            <MiniCart {...data.miniCart} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HeaderCustom