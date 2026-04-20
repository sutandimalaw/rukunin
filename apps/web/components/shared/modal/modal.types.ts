import { ReactNode } from "react"

export type ModalProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void

  trigger?: ReactNode
  title?: string
  description?: string

  children: ReactNode

  footer?: ReactNode
  showFooter?: boolean

  size?: "sm" | "md" | "lg"
}