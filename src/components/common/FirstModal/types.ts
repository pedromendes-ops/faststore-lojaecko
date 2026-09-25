import type { ReactNode } from 'react'
import type { FormField } from '../FormBuilder/types'

export type StorageType = 'localStorage' | 'sessionStorage'

export type FirstModalProps = {
  active?: boolean
  storageKey?: string
  storageType?: StorageType
  delaySeconds?: string

  isOpen?: boolean
  onClose?: () => void

  maxWidthModal?: string
  heightModal?: string

  image?: string
  imageMobile?: string
  imageAlt?: string

  title?: string
  text?: string

  backgroundText?: string
  colorText?: string
  closeLabel?: string

  showForm?: boolean
  formFields?: FormField[]
  successMessage?: string

  children?: ReactNode
}