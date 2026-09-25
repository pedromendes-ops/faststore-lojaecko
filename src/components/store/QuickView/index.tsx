import { Modal, SlideOver, Icon } from '@faststore/ui'
import { useEffect, useState} from 'react'
import { useQuickViewProduct } from './hooks/useQuickViewProduct'
import type { QuickViewProps } from './types'
import QuickViewContent from './components/QuickViewContent'


import { LAYOUT_QUICKVIEW } from '../../../constants/store'

import styles from './QuickView.module.scss'

export default function QuickView({
  isOpen,
  onClose,
  product

}: QuickViewProps) {
  
  const [fade, setFade] = useState<'in' | 'out'>('out')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frame = requestAnimationFrame(() => {
      setFade('in')
    })

    return () => {
      cancelAnimationFrame(frame)
    }

  }, [isOpen])

  useEffect(() => {
  if (!isOpen) {
    return
  }

  document.body.classList.add(
    'no-scroll'
  )

  return () => {
    document.body.classList.remove(
      'no-scroll'
    )
  }
}, [isOpen])

  const fadeOut = () => {
    setFade('out')
  }

  const handleTransitionEnd = () => {
    if (fade === 'out') {
      onClose()
    }
  }

  return (
    <>
    {LAYOUT_QUICKVIEW === 'slideover' ? (
      <SlideOver
        isOpen={isOpen}
        fade={fade}
        onDismiss={fadeOut}
        onTransitionEnd={
          handleTransitionEnd
        }
        size="partial"
        direction="rightSide"
        className={styles.sliderQuickView}
      >
        <div className={styles.quickView} data-fs-quick-view>
          <header data-fs-slide-over-header className={styles.header}>
            <span>Adicionar à sacola</span>
            <button onClick={fadeOut} aria-label="Fechar">
              <Icon name="X" weight="regular" />
            </button>
          </header>
          {isOpen && (
            <QuickViewBody
              productId={product.id}
            />
          )}
        </div>
      </SlideOver>
    ) : (

      <Modal
        isOpen={isOpen}
        onDismiss={onClose}
        className="modal"
        overlayProps={{ className: styles.overlay }}
        aria-label="comprar"
      >
        <div className={`modal-container ${styles.QuickViewModal}`}>
          <button className='modal-close flex center pointer' onClick={onClose} aria-label="Fechar">
            <Icon name="X" weight="regular" />
          </button>
          <div className={`modal-content ${styles.QuickView}`} data-fs-quick-view>        
            <QuickViewBody
              productId={product.id}
            />
          </div>
        </div>
      </Modal>
    )}
    </>
  )
}

function QuickViewBody({
  productId

}: {
  productId: string
}) {
  
  const [activeProductId, setActiveProductId] = useState(productId)
  const { product, isLoading, isNotFound } = useQuickViewProduct(activeProductId)

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-100 h-100'>
        <div className='spinner'></div>
      </div>
    )
  }

  if (isNotFound || !product) {
    return (
      <div className={styles.status}>
        Não foi possível carregar
        este produto.
      </div>
    )
  }

  return (
    <QuickViewContent
      product={product}
      onSkuSelect={setActiveProductId}
      layout={LAYOUT_QUICKVIEW}
    />
  )
}