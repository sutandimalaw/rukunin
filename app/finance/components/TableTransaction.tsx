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
import { columns } from "./TransactionColumn"
import DataTable from "@/components/shared/DataTable"

type ITableProps = {
  data : any[] | undefined
  isLoading : boolean
  error : Error | null
}

const TableTransaction =( 
  {
    data,
    isLoading,
    error
  } : ITableProps  
)=> {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data : data ??[],
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
