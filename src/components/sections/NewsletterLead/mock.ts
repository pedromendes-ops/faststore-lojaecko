import type { NewsletterLeadProps,} from './types'

const MOCK_PROPS: NewsletterLeadProps = {
  active: true,
  grid: 'container',
  layout: 'row',
  text: '<p>Cadastre-se e receba nossas novidades.</p>',
  successMessage: 'Cadastro efetuado com sucesso!',
  formFields: [
    {
      type: 'text',
      name: 'name',
      placeholder: 'Nome',
      required: true,
    },
    {
      type: 'email',
      name: 'email',
      placeholder: 'E-mail',
      required: true,
    },
    {
      type: 'checkbox',
      name: 'optin',
      label: 'Aceito receber novidades e promoções.',
      required: true,
    },
    {
      type: 'submit',
      label: 'Cadastrar',
    },
  ],
}

export default MOCK_PROPS