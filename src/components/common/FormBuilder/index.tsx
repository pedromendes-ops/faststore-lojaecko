import styles from './FormBuilder.module.scss'
import type { FormBuilderProps } from './types'

export const FormBuilder = ({ fields = [], onSubmit }: FormBuilderProps) => {
  if (!fields.length) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>

    await onSubmit?.(payload)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {fields.map((field, index) => {
        const name = field.name || `field-${index}`
        const type = field.type || 'text'

        if (type === 'submit') {
          return (
            <button key={index} type="submit" className={styles.submitButton}>
              {field.label || 'Enviar'}
            </button>
          )
        }

        if (type === 'radio') {
          return (
            <fieldset key={index} className={styles.fieldset}>
              {field.label && <legend>{field.label}</legend>}

              {field.options?.map((option) => (
                <label key={option.value || option.label} className={styles.option}>
                  <input
                    type="radio"
                    name={name}
                    value={option.value || option.label || ''}
                    required={field.required}
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>
          )
        }

        if (type === 'select') {
          return (
            <label key={index} className={styles.field}>
              {field.label && <span>{field.label}</span>}

              <select name={name} required={field.required}>
                <option value="">Selecione</option>

                {field.options?.map((option) => (
                  <option
                    key={option.value || option.label}
                    value={option.value || option.label || ''}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )
        }

        if (type === 'checkbox') {
          return (
            <label key={index} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name={name}
                value="true"
                required={field.required}
              />
              <span>{field.label}</span>
            </label>
          )
        }

        return (
          <label key={index} className={styles.field}>
            {field.label && <span>{field.label}</span>}

            <input
              type={type}
              name={name}
              placeholder={field.placeholder}
              required={field.required}
            />
          </label>
        )
      })}
    </form>
  )
}

export default FormBuilder