'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { transactionSchema } from './schema'
import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import useGetTransaction from './hooks/useGetTransaction'
import TableTransaction from './components/TableTransaction'
import Modal from './components/Modal'
import { useCreateTransaction } from './hooks/useCreateTransaction'
import FinanceSummary from './components/FinanceSummary'

const FinancePage = () => {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [submitError, setSubmitError] = React.useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = React.useState(false)
    const defaultValues: z.input<typeof transactionSchema> = {
        type: "",
        category: "",
        amount: 0,
        desc: ""
    }
    const { data: dataTransaction, isLoading, error } = useGetTransaction() 
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
            } catch (err: any) {
                setSubmitError(err.message || 'Terjadi kesalahan')
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
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Keuangan RT 4</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList> 
                    </Breadcrumb>
                </div>
            </header>
            <div className='mx-6 flex justify-end '>
                <Button className='cursor-pointer' onClick={() =>setOpen(true)}>Tambah Transaksi</Button>
            </div>      
            <FinanceSummary balance={dataTransaction?.balance} />
            <TableTransaction data={dataTransaction?.transactions} isLoading={false} error={null} />
            <Modal
                form={form}
                open={open}
                setOpen={setOpen} 
                submitError={submitError} 
                submitSuccess={submitSuccess} 
                isSubmitting={isSubmitting}
            />
        </SidebarInset>
    )
}

export default FinancePage
