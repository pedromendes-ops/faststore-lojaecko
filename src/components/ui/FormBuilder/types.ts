export type FormFieldOption = {
  label?: string
  value?: string
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'submit'

export type FormField = {
  type?: FormFieldType
  name?: string
  label?: string
  placeholder?: string
  required?: boolean
  options?: FormFieldOption[]
}

export type FormPayload =
  Record<string, string>

export type FormBuilderProps = {
  loading?: boolean
  fields?: FormField[]

  onSubmit?: (
    payload: FormPayload
  ) => void | Promise<void>
}