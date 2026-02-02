'use client'
import { SidebarInset } from '@/components/ui/sidebar'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { transactionSchema } from './schema'
import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import useGetTransaction from './hooks/useGetTransaction'
import TableTransaction from './components/TableTransaction'
import { useCreateTransaction } from './hooks/useCreateTransaction'
import FinanceSummary from './components/FinanceSummary'
import CreateTransactionModal from './components/CreateTransactionModal'
import BreadcumbWithTitle from '@/components/shared/BreadcumbWithTitle'

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
            <BreadcumbWithTitle Title='Keuangan RT'/>
            <div className='mx-6 flex justify-end '>
                <Button className='cursor-pointer' onClick={() =>setOpen(true)}>Tambah Transaksi</Button>
            </div>      
            <FinanceSummary balance={dataTransaction?.balance} />
            <TableTransaction data={dataTransaction?.transactions} isLoading={false} error={null} />
            <CreateTransactionModal
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
