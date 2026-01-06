import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ModalProps } from "./modal.types"
import { cn } from "@/lib/utils"

const sizeClass = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
}

const Modal = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  showFooter = true,
  size = "md",
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className={cn(sizeClass[size])}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {children}

        {showFooter && footer}
      </DialogContent>
    </Dialog>
  )
}

export default Modal