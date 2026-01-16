import React from 'react'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

interface FormInputProps {
    form : any
    label: string
    name: string
    className?: string
    type :string
}

export function FormInput ({ 
    form,
    label, 
    name, 
    className,
    type
} :FormInputProps){
  return (
    <div className="grid gap-2">
        <form.Field
            name={name as string}
            children={(field: { state: { meta: { isTouched: any; isValid: any; errors: ({ message?: string } | undefined)[] | undefined }; value: string | number | readonly string[] | undefined }; name: string | undefined; handleBlur: React.FocusEventHandler<HTMLInputElement> | undefined; handleChange: (arg0: string) => void }) => {
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
            )}}
        />
        </div>
  )
}

