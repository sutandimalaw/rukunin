'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardAction, CardContent, CardDescription,  CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { CircleDollarSign, TrendingDown, TrendingUp, Wallet, WalletCards } from 'lucide-react'
import React, { useState } from 'react'
import List from './list.tsx/page'
import { Button } from '@/components/ui/button'
import Modal from './components/modal'
import { transactionSchema } from './schema'
import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import { createClient } from '@/lib/supabase/client'

const page = () => {
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
    const form = useForm({
        defaultValues,
        validators: {
        onChange: transactionSchema,
        },
        onSubmit: async ({ value }) => {
            setIsSubmitting(true)
            setSubmitError(null)
            setSubmitSuccess(false)
            const supabase = await createClient()
            try {
                // full-form validation
                transactionSchema.parse(value)
                const { error } = await supabase.rpc("add_transaction_v2", {
                    p_date: new Date().toISOString().slice(0, 10),
                    p_type: value.type,
                    p_amount: value.amount,
                    p_description: value.desc,
                    p_category: value.category
                })
                if (error) throw error
                setSubmitSuccess(true)
                form.reset()
                setOpen?.(false)
            } catch (err: any) {
                setSubmitError(err.message || "Terjadi kesalahan")
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
        
            <div className='m-6 grid grid-cols-4 gap-5'>
                <Card className="gap-3 " >
                    <CardHeader>
                        <CardTitle>Saldo Kas</CardTitle>
                        <CardAction><CircleDollarSign/></CardAction>
                    </CardHeader>
                    <CardContent className='py-2'>
                        <div className='text-2xl font-bold text-green-700'>
                        Rp. 45.000.000                            
                        </div>  
                        <div className='text-sm text-gray-500'> Saldo Tersedia</div>                 
                    </CardContent>
                
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pemasukan Bulan Ini</CardTitle>
                        <CardAction><TrendingUp/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                        Rp. 15.000.000                            
                        </div> 
                        <div className='text-sm text-gray-500'> +7.3% dari bulan lalu</div>                  
                    </CardContent>   
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pengeluaran Bulan Ini</CardTitle>
                        <CardAction><TrendingDown/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold '>
                        Rp. 45.000.000                            
                        </div>   
                        <div className='text-sm text-gray-500'> -32% dari bulan lalu</div>                
                    </CardContent>
                    
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Tagihan Tertunggak</CardTitle>
                        <CardAction><Wallet/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold '>
                        Rp. 45.000.000                            
                        </div>                   
                        <div className='text-sm text-gray-500'> dari 35 warga</div> 
                    </CardContent>
                    
                </Card>
            </div>
            <List />
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

export default page
