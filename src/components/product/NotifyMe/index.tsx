import { useState } from 'react'

import FirstModal from '../../common/FirstModal'
import FormBuilder from '../../common/FormBuilder'

import styles from './NotifyMe.module.scss'
import type { NotifyMeProps } from './types'

export const NotifyMe = ({
  productId,
  skuId,
  productName = 'este produto',
}: NotifyMeProps) => {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (payload: Record<string, string>) => {
    const data = {
      productId,
      skuId,
      productName,
      ...payload,
    }

    console.log('Payload Avise-me:', data)

    // await fetch('/api/notify-me', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // })

    setOpen(false)
  }

  return (
    <>
      {/*
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen(true)}
      >
        Avise-me quando chegar
      </button>

      <FirstModal
        active
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Produto indisponível"
        text={`Cadastre seu e-mail e avisaremos quando ${productName} voltar ao estoque.`}
        maxWidthModal="760"
        heightModal="420"
      >
      */}
        <div className={styles.title}>         
          <p><strong>Esgotado</strong></p>
          <p>Avise-me quando chegar</p>
        </div>
        <FormBuilder
          onSubmit={handleSubmit}
          fields={[
            {
              type: 'text',
              name: 'name',
              //label: 'Nome',
              placeholder: 'Digite seu nome',
              required: true,
            },
            {
              type: 'email',
              name: 'email',
              //label: 'E-mail',
              placeholder: 'Digite seu e-mail',
              required: true,
            },
            {
              type: 'checkbox',
              name: 'privacy',
              label: 'Aceito receber o aviso de disponibilidade deste produto.',
              required: true,
            },
            {
              type: 'submit',
              label: 'Receber aviso',
            },
          ]}
        />
      {/*
      </FirstModal>
      */}
    </>
  )
}

export default NotifyMe