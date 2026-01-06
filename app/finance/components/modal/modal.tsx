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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ModalProps {
    open? : boolean
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const  Modal=({ open, setOpen }: ModalProps)=> {
  return (
    <Dialog open ={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Transaksi</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Select name="transaction_type">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Jenis Transaksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="IN">Pemasukan</SelectItem>
                    <SelectItem value="OUT">Pengeluaran</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Select name="category">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="iuran">Iuran</SelectItem>
                    <SelectItem value="kebersihan">Kebersihan</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Input name="nominal" type="number" placeholder="Nominal"/>
            </div>
            <div className="grid gap-3">
              <Input name="desc" type="text" placeholder="Deskripsi"/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default Modal
