'use client'

import { SidebarInset } from '@/components/ui/sidebar'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { transactionSchema } from './schema'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import useGetTransaction from './hooks/useGetTransaction'
import useGetSummary from './hooks/useGetSummary'
import TableTransaction from './components/TableTransaction'
import { useCreateTransaction } from './hooks/useCreateTransaction'
import FinanceSummary from './components/FinanceSummary'
import CreateTransactionModal from './components/CreateTransactionModal'
import Filter, { type FilterParams } from './components/Filter'
import { useAuth } from '@/provider/auth-provider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

const FinancePage = () => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)
  const [filters, setFilters] = useState<FilterParams>({})

  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  const defaultValues: z.input<typeof transactionSchema> = {
    type: '',
    category: '',
    amount: 0,
    desc: '',
  }

  const { data: dataTransaction, isLoading, error } = useGetTransaction(filters)
  const { data: summary } = useGetSummary()
  const { createTransaction } = useCreateTransaction()

  const form = useForm({
    defaultValues,
    validators: {
      onChange: transactionSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(false)
      try {
        await createTransaction(value)
        setSubmitSuccess(true)
        form.reset()
        setOpen(false)
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Keuangan</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Kas RT</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <FinanceSummary
        balance={summary?.currentBalance ?? 0}
        incomeThisMonth={summary?.incomeThisMonth ?? 0}
        expensesThisMonth={summary?.expensesThisMonth ?? 0}
      />

      <div className="mx-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <Filter
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
        </div>
        {isSuperAdmin && (
          <Button className="cursor-pointer" onClick={() => setOpen(true)}>
            Tambah Transaksi
          </Button>
        )}
      </div>

      <TableTransaction data={dataTransaction?.data} isLoading={isLoading} error={error} />

      {isSuperAdmin && (
        <CreateTransactionModal
          form={form}
          open={open}
          setOpen={setOpen}
          submitError={submitError}
          submitSuccess={submitSuccess}
          isSubmitting={isSubmitting}
        />
      )}
    </SidebarInset>
  )
}

export default FinancePage
