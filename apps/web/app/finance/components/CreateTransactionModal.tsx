import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { transaction_type, category_in, category_out } from "../type/transactionType"
import { FormSelect } from "@/components/shared/FormSelect"
import { FormInput } from "@/components/shared/FormInput"

interface ModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  submitError: string | null
  submitSuccess: boolean
  isSubmitting: boolean
}

function CreateTransactionModal({
  form,
  open,
  setOpen,
  submitError,
  submitSuccess,
  isSubmitting,
}: ModalProps) {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <div>
              {form.getFieldValue("type") && (
                <FormSelect
                  form={form}
                  name="category"
                  label="Kategori"
                  options={form.getFieldValue("type") === 'OUT' ? category_out : category_in}
                />
              )}
            </div>
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
              <Button variant="outline">Batal</Button>
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

export default CreateTransactionModal
