import { ColumnDef } from "@tanstack/react-table"
import { PAYMENT } from "@/app/utils/data-type"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, ArrowRight, ChevronDown, MoreHorizontal, ChevronRight, CirclePlus } from "lucide-react"

export const columns: ColumnDef<PAYMENT>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("full_name")}</div>
    ),
  },
  {
    accessorKey: "blok",
    header: "Blok",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("blok")}</div>
    ),
  },
  {
    accessorKey: "house_number",
    header: "No",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("house_number")}</div>
    ),
  },
  {
    accessorKey: "rt",
    header: "RT",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("rt")}</div>
    ),
  },
  {
    accessorKey: "periode_bayar",
    header: "Periode Bayar",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("periode_bayar")}</div>
    ),
  },
  {
    accessorKey: "status_bayar",
    header: "Status Bayar",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status_bayar")}</div>
    ),
  },
 
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "terlambat",
    header: "Terlambat",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status_bayar")}</div>
    ),
  },
   {
    accessorKey: "tagihan",
    header: "Tagihan",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status_bayar")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <div>
          <ChevronRight/>
        </div>
      )
    },
  },
]