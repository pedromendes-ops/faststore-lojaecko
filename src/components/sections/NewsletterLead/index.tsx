import {useState, } from 'react'
import FormBuilder from '../../ui/FormBuilder'
import { Viewer } from '../../ui/viewer'
import type {FormPayload, } from '../../ui/FormBuilder/types'
import styles from './NewsletterLead.module.scss'
import type {NewsletterLeadProps,} from './types'

import MOCK_PROPS from './mock'
const USE_LOCAL_MOCK = false

export const NewsletterLead = (props: NewsletterLeadProps) => {

    const data = USE_LOCAL_MOCK ? MOCK_PROPS : props
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const layout = data.layout ?? 'row'

    const handleSubmit = async (payload: FormPayload) => {
        try {
            setLoading(true)
            setError('')

            console.log('Newsletter payload:', payload)

            // await newsletterService.subscribe(payload)

            setSuccess(true)

        } catch (error) {
            console.error('Newsletter error:', error)
            setError('Não foi possível realizar o cadastro. Tente novamente.')

        } finally {
            setLoading(false)
        }
    }

    if (!data.active) {
        return null
    }

    const content = (
        <div className={`${styles.formNews} ${layout === 'column' ? styles.column : styles.row}`}>
            {data.text && (
                <div className={styles.textNews}>
                    <Viewer value={data.text} />
                </div>
            )}

            <div className={styles.bodyNews}>
                {!success && (
                    <FormBuilder
                        fields={data.formFields}
                        loading={loading}
                        onSubmit={handleSubmit}
                    />
                )}

                {error && (
                    <p className={styles.errorMessage} role="alert">{error}</p>
                )}

                {success && (
                    <div className={styles.successMessage} role="status">
                        {data.successMessage ?? 'Cadastro efetuado com sucesso.'}
                    </div>
                )}
            </div>
        </div>
    )

    return(
        <section
            aria-label="Newsletter"
            className={styles.newsletter}
        >        
            <div className="wrap">
                <div className={data?.grid}>
                    {content}
                </div>
            </div>
        </section>
    )
}

export default NewsletterLead