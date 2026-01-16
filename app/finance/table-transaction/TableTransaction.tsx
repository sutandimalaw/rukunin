"use client"

import { useState } from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { columns } from "./column"
import { DataTable } from "@/components/organisms/data-table"
import useGetTransaction from "../hooks/useGetTransaction"

const TableTransaction =()=> {
  const { data: dataTransaction, isLoading, error } = useGetTransaction()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data : dataTransaction ??[],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="m-6">
      <div className="flex items-center py-4">      
       History Transaksi
      </div>
      <DataTable
        table={table}
        columnsLength={columns.length}
      />
    </div>
  )
}

export default TableTransaction
