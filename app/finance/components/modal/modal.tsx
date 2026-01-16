import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { trans_category, transaction_type } from "../../constanta/transactionType"
import { FormSelect } from "@/components/atoms/FormSelect"
import { FormInput } from "@/components/atoms/FormInput"


interface ModalProps {
  form : any
  open? : boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  submitError: string | null,
  submitSuccess: boolean, 
  isSubmitting : boolean
}

function Modal({ 
    form, 
    open, 
    setOpen, 
    submitError, 
    submitSuccess, 
    isSubmitting 
}: ModalProps)  {
  
  return (
    <Dialog open ={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="grid gap-4"
          >
            <DialogHeader>
              <DialogTitle>Tambah Transaksi</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <FormSelect
                form={form}
                name="type"
                label="Tipe"
                options={transaction_type}
              />
              <FormSelect
                form={form}
                name="category"
                label="Kategori"
                options={trans_category}
              />
              <FormInput
                form={form}
                name="amount" 
                label="Nominal"
                type="number"
              />
              <FormInput
                form={form}
                name="desc" 
                label="Deskripsi"    
                type="text"          
              />
            </div>
            {submitError && (
              <p className="text-sm text-red-500">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-sm text-green-600">
                Transaksi berhasil disimpan
              </p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}

export default Modal
