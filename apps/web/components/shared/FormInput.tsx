import React from 'react'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

interface FieldMeta {
  isTouched: boolean
  isValid: boolean
  errors: ({ message?: string } | undefined)[] | undefined
}

interface FieldProps {
  state: {
    meta: FieldMeta
    value: string | number | readonly string[] | undefined
  }
  name: string | undefined
  handleBlur: React.FocusEventHandler<HTMLInputElement> | undefined
  handleChange: (value: string) => void
}

interface FormInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  label: string
  name: string
  type: string
}

export function FormInput({ form, label, name, type }: FormInputProps) {
  return (
    <div className="grid gap-2">
      <form.Field name={name}>
        {(field: FieldProps) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type={type}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>
    </div>
  )
}
