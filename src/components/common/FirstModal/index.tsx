import { useEffect, useState } from 'react'
import { Modal } from '@faststore/ui'
import { Image } from 'src/components/ui/Image'
import useScreenResize from 'src/sdk/ui/useScreenResize'
import FormBuilder from '../FormBuilder'

import styles from './FirstModal.module.scss'
import type { FirstModalProps } from './types'

const getStorage = (type: FirstModalProps['storageType']) => {
  if (typeof window === 'undefined') return null

  return type === 'sessionStorage'
    ? window.sessionStorage
    : window.localStorage
}

export const FirstModal = ({
  active = true,

  storageKey = 'first-modal-closed',
  storageType = 'localStorage',
  delaySeconds = '0',

  isOpen,
  onClose,

  maxWidthModal = '960',
  heightModal = '540',

  image = '',
  imageMobile = '',
  imageAlt = '',

  title = '',
  text = '',

  backgroundText = '#ffffff',
  colorText = '#000000',

  closeLabel = 'Fechar modal',

  showForm = false,
  formFields = [],
  successMessage = 'Cadastro realizado com sucesso.',

  children,
}: FirstModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const { isDesktop } = useScreenResize()
  

  const modalOpen = isOpen ?? internalOpen
  const isControlled = typeof isOpen === 'boolean'

  useEffect(() => {
    if (!active || isControlled) return

    const storage = getStorage(storageType)
    const alreadyClosed = storage?.getItem(storageKey)
    

    if (alreadyClosed) return

    const delay = Number(delaySeconds) || 0

    const timer = window.setTimeout(() => {
      setInternalOpen(true)
    }, delay * 1000)

    return () => window.clearTimeout(timer)
  }, [active, delaySeconds, storageKey, storageType, isControlled])

  const handleClose = () => {
    const storage = getStorage(storageType)

    storage?.setItem(storageKey, 'true')
    setInternalOpen(false)
    setSuccess(false)
    onClose?.()
  }

  const handleSubmit = async (payload: Record<string, string>) => {

    console.log('Payload FirstModal:', payload)

    // await fetch('/api/newsletter', {...})

    setSuccess(true)
  }

  if (!active) return null

  const currentImage = !isDesktop && imageMobile ? imageMobile : image

  return (
    <Modal
      isOpen={modalOpen}
      onDismiss={handleClose}
      className={styles.modal}
      overlayProps={{
        className: styles.overlay,
      }}
      aria-labelledby={title ? 'first-modal-title' : undefined}
    >
      <div
        className={styles.content}
        style={{
          maxWidth: `${maxWidthModal}px`,
          minHeight: `${heightModal}px`,
        }}
      >
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label={closeLabel}
        >
          ×
        </button>

        {currentImage && (
          <div className={styles.imageBox}>
            <Image
              src={currentImage}
              alt={imageAlt}
              width={700}
              height={700}
              className={styles.image}
              loading="eager"
            />
          </div>
        )}

        <div
          className={styles.textBox}
          style={{
            background: backgroundText,
            color: colorText,
          }}
        >
          {title && (
            <h2 id="first-modal-title" className={styles.title}>
              {title}
            </h2>
          )}

          {text && <p className={styles.text}>{text}</p>}

          {showForm && !children && !success && (
            <FormBuilder onSubmit={handleSubmit} fields={formFields} />
          )}
          
          {success && (
            <p className={styles.successMessage}>{successMessage}</p>
          )}

          {children}
        </div>
      </div>
    </Modal>
  )
}

export default FirstModal