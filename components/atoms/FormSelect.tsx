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

interface FormSelectProps {
  form: any
  name: string
  label: string
  placeholder?: string
  options: Option[]
  className?: string
}

export function FormSelect({
  form,
  name,
  label,
  placeholder = "Pilih",
  options,
  className,
}: FormSelectProps) {
  return (
    <form.Field name={name}>
      {(field: { state: { meta: { isTouched: any; isValid: any; errors: ({ message?: string } | undefined)[] | undefined }; value: string | undefined }; handleChange: ((value: string) => void) | undefined }) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid

        return (
          <div className="grid gap-2" data-invalid={isInvalid} >
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger
                  id={name}
                  aria-invalid={isInvalid}
                  className="w-auto"
                >
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
            {isInvalid && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </div>
        )
      }}
    </form.Field>
  )
}