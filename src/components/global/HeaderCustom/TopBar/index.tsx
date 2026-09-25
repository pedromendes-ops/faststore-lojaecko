import { SwiperCarousel } from '../../../ui/SwiperCarousel'
import styles from './TopBar.module.scss'
import type { TopBarProps } from '../types'

export function TopBar({
    items = [],
    background = '#fff',  

}: TopBarProps) {

    if (!items.length) {
        return null
    }

    return (
        <div        
            className={`flex center ${styles.topBar}`}
            style={{
                backgroundColor: background
            }}
        >
            <div className={styles.cta}>
                <SwiperCarousel
                    slidesPerView={1}
                    spaceBetween={0}
                    showArrows
                    showDots={false}
                    loop={items.length > 1}
                >
                    {items.map((item, index) => (
                    <p
                        key={index}
                        className='tc'
                    >
                        {item.text}
                    </p>
                    ))}
                </SwiperCarousel>
            </div>
        </div>
    )
}