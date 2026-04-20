import { ColumnDef } from "@tanstack/react-table"
import { Resident } from "@/lib/api/residents"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight } from "lucide-react"
import { getFamilyRelationLabel } from "@/lib/api/households"
import Link from "next/link"

export const columns: ColumnDef<Resident>[] = [
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
    accessorKey: "fullName",
    header: "Nama",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("fullName")}</div>
    ),
  },
  {
    id: "blok",
    header: "Blok",
    cell: ({ row }) => (
      <div>{row.original.household?.blok ?? "-"}</div>
    ),
  },
  {
    id: "houseNumber",
    header: "No",
    cell: ({ row }) => (
      <div>{row.original.household?.houseNumber ?? "-"}</div>
    ),
  },
  {
    id: "rt",
    header: "RT",
    cell: ({ row }) => (
      <div>{row.original.household?.rt ?? "-"}</div>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const g = row.getValue<string>("gender")
      return <div>{g === 'MEN' ? 'L' : g === 'WOMAN' ? 'P' : g}</div>
    },
  },
  {
    accessorKey: "familyRelation",
    header: "Relasi",
    cell: ({ row }) => (
      <div className="text-sm">{getFamilyRelationLabel(row.getValue("familyRelation"))}</div>
    ),
  },
  {
    accessorKey: "occupation",
    header: "Pekerjaan",
    cell: ({ row }) => (
      <div>{row.getValue("occupation") ?? "-"}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const resident = row.original
      return (
        <Link
          href={`/residents/${resident.id}`}
          className="inline-flex cursor-pointer"
          aria-label="Lihat detail"
        >
          <ChevronRight />
        </Link>
      )
    },
  },
]
