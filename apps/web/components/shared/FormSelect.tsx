import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldError, FieldLabel } from "@/components/ui/field"

type Option = {
  label: string
  value: string
}

interface FieldMeta {
  isTouched: boolean
  isValid: boolean
  errors: ({ message?: string } | undefined)[] | undefined
}

interface FieldProps {
  state: {
    meta: FieldMeta
    value: string | undefined
  }
  handleChange: ((value: string) => void) | undefined
}

interface FormSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  name: string
  label: string
  placeholder?: string
  options: Option[]
}

export function FormSelect({
  form,
  name,
  label,
  placeholder = "Pilih",
  options,
}: FormSelectProps) {
  return (
    <form.Field name={name}>
      {(field: FieldProps) => {
        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

        return (
          <div className="grid gap-2" data-invalid={isInvalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger id={name} aria-invalid={isInvalid} className="w-auto">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </div>
        )
      }}
    </form.Field>
  )
}
