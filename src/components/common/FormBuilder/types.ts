export type FormFieldOption = {
  label?: string
  value?: string
}

export type FormField = {
  type?: 'text' | 'email' | 'tel' | 'checkbox' | 'radio' | 'select' | 'submit'
  name?: string
  label?: string
  placeholder?: string
  required?: boolean
  options?: FormFieldOption[]
}

export type FormBuilderProps = {
  fields?: FormField[]
  onSubmit?: (payload: Record<string, string>) => void | Promise<void>
}