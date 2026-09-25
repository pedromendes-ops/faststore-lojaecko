import type { FormField } from '../../ui/FormBuilder/types'

export type NewsletterLeadProps = {
    active?: boolean
    grid: 'container' | 'full'
    layout?: 'row' | 'column'        
    text?: string
    successMessage?: string
    formFields?: FormField[]
}